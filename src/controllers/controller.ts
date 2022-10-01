import catchAsync from './../utils/catchAsync';
import { Request, Response } from 'express';

import User from '../models/User';
import Word from '../models/Word';
// TODO: env variable will decide if '/mongoose' or '/sql' service. Conditional import.
import WordService from '../services/mongoose/WordService';
import GuessService from '../services/mongoose/GuessService';
import UserService from '../services/mongoose/UserService';

import AppError from '../utils/appError';
import getDayWord from '../utils/getDayWord';

// Guess word of the day
export const guess = catchAsync(async (req: Request<{}, {}, {word: string}>, res: Response<{}, Record<'user', User>>) => {
  const user = res.locals.user;

  // Assert word exists in dictionary
  const word = (await WordService.findOne({ content: req.body.word.toLowerCase() })) as Word;
  if (!word) throw new AppError('Invalid input - word does not exist in dictionary', 404);

  // Assert word is a valid guess and create new guess
  const userGuessesSoFar = (await GuessService.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  GuessService.validateForUser(user, userGuessesSoFar, dayWord, word);
  await GuessService.createOne(user.id!, word);

  // Color word
  const data = GuessService.colorContent(word.content, dayWord);
  res.status(200).json({ status: 'success', data });
});

// Get guesses for current day
export const getUserState = catchAsync(async (_req, res: Response<{}, Record<'user', User>>) => {
  const user = res.locals.user;
  const userGuesses = (await GuessService.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  // Color each guess
  const data = userGuesses.map((g) => GuessService.colorContent(g, dayWord));
  ;
  res.status(200).json({ status: 'success', data });
});

// Set word language, length and number of attempts preference
export const setPreference = catchAsync(async (req: Request<{}, {}, { wordLength: number, wordLanguage: 'en' | 'bg', attemptsCount: number }>, res: Response<{}, Record<'user', User>>) => {
  let user = res.locals.user;
  const preference = req.body;
  
  // Validate data
  user.wordLength = preference.wordLength ?? user.wordLength;
  user.wordLanguage = preference.wordLanguage ?? user.wordLanguage;
  user.attemptsCount = preference.attemptsCount ?? user.attemptsCount;
  const updatedUser = new User(user);

  // Update user preference
  const data = await UserService.findByIdAndUpdate(user.id, updatedUser);
  res.status(200).json({ status: 'success', data });
});
