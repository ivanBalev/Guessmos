const Word = require('../models/word');
const Guess = require('../models/guess');
const AppError = require('./../utils/appError');
const getDayWord = require('./../utils/getDayWord');
const mongooseRepository = require('./mongooseRepository');

async function guess(guess, user) {
  // Check if word exists in db
  const word = await mongooseRepository.findOne(Word, {
    content: guess.toLowerCase(),
  });
  if (!word) {
    throw new AppError(
      'Invalid input - word does not exist in dictionary',
      404
    );
  }

  // Check if user hasn't already entered the word, guessed it etc.
  const userGuesses = (await Guess.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
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

async function getUserState(user) {
  // Get all of user's guesses for the current day according to their preference
  const userGuesses = (await Guess.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  // Color each guess
  return userGuesses.map((g) => Guess.colorContent(g, dayWord));
}

async function updateUser(user, preference) {
  try {
    // Update user preference
    await mongooseRepository.update(user, preference);
  } catch (err) {
    // Invalid input data
    throw new AppError(err.message, 400);
  }
}

module.exports = {
  guess,
  getUserState,
  updateUser,
};
