import User from "../models/User";
import Word from "../models/Word";
import GuessService from "../services/GuessService";
import WordService from "../services/WordService";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import getDayWord from "../utils/getDayWord";

export default catchAsync(async (req, res) => {

  const user = res.locals.user as User;

  // Assert word exists in dictionary
  const word = (await WordService.findOne({ content: req.body.word.toLowerCase() })) as Word;
  if (!word) throw new AppError('Invalid input - content does not exist', 404);

  // Assert word is a valid guess and create new guess
  {
    // Get user guesses for current preference
    const userGuessesSoFar = (await GuessService.getByUser(user)).map((g) => g.content);
    const dayWord = await getDayWord(user);

    // Validate guess (does guess length match current user preference, etc...)
    GuessService.validateForUser(user, userGuessesSoFar, dayWord, word);
  }

  // Attach word from db to response object for controller to manipulate
  res.locals.word = word;
})