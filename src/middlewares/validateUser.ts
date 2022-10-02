import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import { Request } from "express";

export default catchAsync(async (req: Request<{}, {}, { wordLength: number, wordLanguage: 'en' | 'bg', attemptsCount: number }>, res) => {
  const user = res.locals.user;
  const preference = req.body;
  // Validate data
  user.wordLength = preference.wordLength ?? user.wordLength;
  user.wordLanguage = preference.wordLanguage ?? user.wordLanguage;
  user.attemptsCount = preference.attemptsCount ?? user.attemptsCount;
  const updatedUser = new User(user);
  res.locals.user = updatedUser;
})