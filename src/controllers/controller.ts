import catchAsync from './../utils/catchAsync';
import * as dbService from './../services/dbService';
import { Request, Response } from 'express';
import { UserDocument } from '../models/user';

// Guess word of the day
export const guess = catchAsync(
  async (req: Request<{}, {}, {word: string}>,
         res: Response<{}, Record<'user', UserDocument>>) => {
  res.status(200).json({
    status: 'success',
    data: await dbService.guess(req.body.word, res.locals.user),
  });
});

// Get guesses for current day
export const getUserState = catchAsync(
  async (_req, res: Response<{}, Record<'user', UserDocument>>) => {
  res.status(200).json({
    status: 'success',
    // TODO: why does this not shout?? - user is listed as type any
    data: await dbService.getUserState(res.locals.user),
  });
});

// Set word language, length and number of attempts preference
export const setPreference = catchAsync(
  async (req: Request<{}, {}, { wordLength: number, wordLanguage: 'en' | 'bg', attemptsCount: number }>,
         res: Response<{}, Record<'user', UserDocument>>) => {
  res.status(200).json({
    status: 'success',
    data: await dbService.updateUser(res.locals.user, req.body),
  });
});
