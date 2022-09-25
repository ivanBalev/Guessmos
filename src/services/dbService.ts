import Word, { WordDocument } from '../models/word';
import Guess from '../models/guess';
import AppError from './../utils/appError';
import getDayWord from './../utils/getDayWord';
import * as mongooseRepository from './mongooseRepository';
import { UserDocument } from '../models/user';

// TODO: Create interface with methods we currently use in the mongoose repo.
// Same interface will be used by MySql database, but with different implementation
// dbService will only swap the interface implementation but will use the same methods for both
// or however many dbmsses we decide to include

export async function guess(guess: string, user: UserDocument) {
  // Check if word exists in db
  const word = (await mongooseRepository.findOne(Word, { content: guess.toLowerCase() })) as WordDocument;
  if (!word) {
    throw new AppError(
      'Invalid input - word does not exist in dictionary',
      404
    );
  }

  // Check if user hasn't already entered the word, guessed it etc.
  const userGuesses = (await Guess.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  // TODO: how do we increment attemptsCount?
  Guess.validateForUser(user, userGuesses, dayWord, word);

  // Create new guess
  const guessObject = {
    userId: user._id,
    wordId: word._id,
    length: word.length,
    language: word.language,
    content: word.content,
  };
  await mongooseRepository.create(Guess, guessObject);

  // Color guess
  return Guess.colorContent(word.content, dayWord);
}


// TODO: Make return type explicit
export async function getUserState(user: UserDocument) {
  // Get all of user's guesses for the current day according to their preference
  const userGuesses = (await Guess.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  // Color each guess
  return userGuesses.map((g) => Guess.colorContent(g, dayWord));
}

export async function updateUser(user: UserDocument, preference: {wordLength: number, wordLanguage: 'en' | 'bg', attemptsCount: number}) {
  try {
    // Update user preference
    await mongooseRepository.update(user, preference);
  } catch (err) {
    // Invalid input data
    throw new AppError((err as Error).message, 400);
  }
}
