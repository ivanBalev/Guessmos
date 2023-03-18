import { Schema, model, Types, Document, Model } from 'mongoose';
import Guess from "../models/Guess";
import User from "../models/User";
import Word from "../models/Word";
import AppError from "../utils/appError";

export const constants = {
  minLength: 5,
  maxLength: 11,
  colors: {
    green: 'green',
    yellow: 'yellow',
    gray: 'gray',
  }
};

// Define properties added for db exclusively
interface IMongooseGuess extends Guess {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Type we receive back from db
export type GuessDocument = Document<Types.ObjectId> & IMongooseGuess;

// Define static custom functions attached to our model
interface GuessStaticsModel extends Model<IMongooseGuess> {
  createOne(userId: string, word: Word): Promise<Guess>,
  getByUser(user: User): Promise<Guess[]>,
  validateForUser(user: User, pastUserGuesses: string[], dayWord: string, word: Word): void,
  checkWord(userId: string, word: Word, dayWord: string): Promise<{ color: string; letter: string; }[]>,
  colorLetters(dayWord: string, word: string): { letter: string, color: string }[]
}

// Define schema for db
const guessSchema = new Schema<IMongooseGuess, GuessStaticsModel>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    content: {
      type: String,
      required: [true, 'Guess must have content'],
    },
    language: {
      type: String,
      requred: true,
    },
    length: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      ref: 'User',
      requred: true,
    },
    wordId: {
      type: String,
      ref: 'Word',
      required: true,
    },
  },
  { timestamps: true }
);

// Create guess
guessSchema.static('createOne',
  async function (userId: string, word: Word): Promise<Guess> {
    // Validate data
    const guess = new Guess({
      userId: userId,
      // word id is nullable since the class is used as both input and view model
      wordId: word.id!,
      length: word.length,
      language: word.language,
      content: word.content,
    });

    // Return result from creation (of GuessDocument type)
    return await GuessModel.create(guess);
  });

// Get user's guesses for the day & set preference
guessSchema.static('getByUser',
  async function (user: User): Promise<Guess[]> {

    // Get today & tomorrow date strings for query
    const { todayStr, tomorrowStr } = getDateStrings();

    // Construct query
    const findQuery = {
      userId: user.id,
      createdAt: {
        $gte: todayStr,
        $lte: tomorrowStr,
      },
      length: user.wordLength,
      language: user.wordLanguage,
    };
    return await GuessModel.find(findQuery);
  });

// Validate user's current guess
guessSchema.static('validateForUser',
  function (user: User, pastUserGuesses: string[], dayWord: string, word: Word): void {
    // user preference does not match entered data
    if (user.wordLength !== word.length) {
      throw new AppError(
        `Invalid input - please insert guess with length ${user.wordLength}`,
        400
      );
    }
    // user preference does not match entered data
    if (user.wordLanguage !== word.language) {
      throw new AppError(
        `Invalid input - please insert guess in language ${user.wordLanguage}`,
        400
      );
    }
    // user was already correct
    if (pastUserGuesses.includes(dayWord)) {
      throw new AppError(
        'Invalid input - you have already guessed the word successfully',
        400
      );
    }
    // user has already entered the same word
    if (pastUserGuesses.includes(word.content)) {
      throw new AppError(
        'Invalid input - word already entered. please try another',
        400
      );
    }
    // attempts count exceeded
    if (pastUserGuesses.length >= user.attemptsCount) {
      throw new AppError(
        'Invalid input - no more attempts for this language and length',
        400
      );
    }
  });

// Validates guess, creates it in db and colors its letters against the word of the day
guessSchema.static('checkWord',
  async function (userId: string, word: Word, dayWord: string): Promise<{ color: string; letter: string; }[]> {

    // Throw error if guess & dayWord don't match guess entity
    // length constraints or don't match each other's length
    if (
      word.content.length < constants.minLength ||
      word.content.length > constants.maxLength ||
      dayWord.length < constants.minLength ||
      dayWord.length > constants.maxLength ||
      dayWord.length !== word.content.length
    ) {
      throw new AppError('Invalid input - unsupported data length', 400);
    }

    // Add guess to db and color its letters
    await GuessModel.createOne(userId, word);
    return GuessModel.colorLetters(dayWord, word.content);
  });

guessSchema.static('colorLetters', function (dayWord: string, word: string): { letter: string, color: string }[] {
  // Color letters
  // Prepares input for comparison
  let dayWordArr = [...dayWord];
  let result = [...word].map((c) => {
    return { letter: c, color: constants.colors.gray };
  });

  /**
   * Colors all exact matches in green and remove letter
   * from dayWord array to indicate it has been matched
   */
  result.forEach((c, idx) => {
    if (dayWord[idx] == c.letter) {
      result[idx].color = constants.colors.green;
      dayWordArr[idx] = '';
    }
  });

  /**
   * Colors all letters that exist but not in the right place
   * in yellow and remove respective letter from dayWord array
   */
  result.forEach((c, idx) => {
    if (dayWordArr.includes(c.letter) && c.color != constants.colors.green) {
      result[idx].color = constants.colors.yellow;
      dayWordArr[dayWordArr.indexOf(c.letter)] = '';
    }
  });
  return result;
})

// TODO: use library
// Helper date formatting function
function getDateStrings() {

  // Get today date
  let today = new Date();

  // Get tomorrow date by adding one day to today
  let tomorrow = new Date();
  tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

  // Construct today & tomorrow strings for mongoose
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1
    }-${today.getDate()}`;
  const tomorrowStr = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1
    }-${tomorrow.getDate()}`;
  return { todayStr, tomorrowStr };
}

const GuessModel = model<IMongooseGuess, GuessStaticsModel>('Guess', guessSchema);
export default GuessModel;
