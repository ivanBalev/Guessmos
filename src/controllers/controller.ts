import catchAsync from './../utils/catchAsync';
import GuessService from '../services/mongoose/GuessService';
import UserService from '../services/mongoose/UserService';

import getDayWord from '../utils/getDayWord';

// Guess word of the day
export const guess = catchAsync(async (_req, res) => {
  const user = res.locals.user;
  const dayWord = await getDayWord(user);
  // Check word
  const data = await GuessService.checkWord(user.id, res.locals.word, dayWord);
  res.status(200).json({ status: 'success', data });
});

// Get guesses for current day
export const getUserState = catchAsync(async (_req, res) => {
  const user = res.locals.user;
  const userGuesses = (await GuessService.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  // Color each guess
  const data = await Promise.all(userGuesses.map(async (g) => await GuessService.colorLetters(dayWord, g)));
  res.status(200).json({ status: 'success', data });
});

export const setPreference = catchAsync(async (_req, res) => {
  const data = await UserService.findByIdAndUpdate(res.locals.user.id, res.locals.user);
  res.status(200).json({ status: 'success', data });
});
