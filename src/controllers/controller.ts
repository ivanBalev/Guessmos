import catchAsync from './../utils/catchAsync';
import GuessService from '../services/GuessService';
import UserService from '../services/UserService';
import getDayWord from '../utils/getDayWord';

// Guess word of the day
export const guess = catchAsync(async (_req, res) => {

  // Get user
  const user = res.locals.user;

  // Get current word of the day
  const dayWord = await getDayWord(user);

  // Check word of the day agianst user's guess
  const data = await GuessService.checkWord(user.id, res.locals.word, dayWord);
  res.status(200).json({ status: 'success', data });
});

// Get guesses for current day
export const getState = catchAsync(async (_req, res) => {

  // Get user
  const user = res.locals.user;

  // Get all of the user's guesses
  const userGuesses = (await GuessService.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);

  // Color each guess
  const data = await Promise.all(userGuesses.map(async (word) => await GuessService.colorLetters(dayWord, word)));
  res.status(200).json({ status: 'success', data });
});

// Set user preference for word length, language and number of attempts
export const setPreference = catchAsync(async (_req, res) => {
  
  // Submit updated data (this returns user state before update)
  await UserService.findByIdAndUpdate(res.locals.user.id, res.locals.user);

  // Get updated user state
  const data = await UserService.findById(res.locals.user.id);
  res.status(200).json({ status: 'success', data });
});
