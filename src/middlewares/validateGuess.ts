import Word from "../models/Word";
// TODO: env variable will decide if '/mongoose' or '/sql' service. Conditional import.
import GuessService from "../services/mongoose/GuessService";
import WordService from "../services/mongoose/WordService";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import getDayWord from "../utils/getDayWord";

export default catchAsync(async (req, res) => {
  const user = res.locals.user;
  // Assert word exists in dictionary
  // code smell - exposing deeper-layer methods at top directly.
  const word = (await WordService.findOne({ content: req.body.word.toLowerCase() })) as Word;
  if (!word) throw new AppError('Invalid input - word does not exist in dictionary', 404);

  // Assert word is a valid guess and create new guess
  const userGuessesSoFar = (await GuessService.getByUser(user)).map((g) => g.content);
  const dayWord = await getDayWord(user);
  GuessService.validateForUser(user, userGuessesSoFar, dayWord, word);
  res.locals.word = word;
})