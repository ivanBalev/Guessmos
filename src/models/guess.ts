import { Schema, model, Types, Model, Document } from 'mongoose';
import AppError from './../utils/appError';
import { UserDocument } from './user';
import { WordDocument } from './word';

const constants = {
  minLength: 5,
  maxLength: 11,
};
const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};

export type ColoredLetter = {
  color: string;
  value: string;
}

interface IGuess {
  _id: Types.ObjectId;
  content: string;
  language: string;
  length: number;
  userId: Types.ObjectId;
  wordId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// TODO: IN GENERAL: Good idea to iplement smth like view models so we don't operate with db entities everywhere
// Will definitely help with preventing DATA LEAKS
export type GuessDocument = Document<Types.ObjectId> & IGuess;

interface GuessModel extends Model<IGuess> {
                                                       // TODO: separate interface for this
  colorContent(guessContent: string, dayWord: string): ColoredLetter[],
  validateForUser (user: UserDocument, pastUserGuesses: string[], dayWord: string, word: WordDocument): void,
  getByUser (user: UserDocument): Promise<GuessDocument[]>
}

const guessSchema = new Schema<IGuess, GuessModel>(
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      requred: true,
    },
    wordId: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Colors user's guess depending on how
 * closely it matches the word of the day
 *
 * @param {String} guessContent
 * @param {String} dayWord
 */
guessSchema.static('colorContent',
function (guessContent: string, dayWord: string): ColoredLetter[] {
  /**
   * Throw error if guess & dayWord don't match guess entity
   * length constraints or don't match each other's length
   */
  if (
    guessContent.length < constants.minLength ||
    guessContent.length > constants.maxLength ||
    dayWord.length < constants.minLength ||
    dayWord.length > constants.maxLength ||
    dayWord.length !== guessContent.length
  ) {
    // TODO: make this error more specific
    throw new AppError('Invalid input - unsupported data length', 400);
  }

  // Prepares input for comparison
  let dayWordArr = [...dayWord];
  let result = [...guessContent].map((c) => {
    return { value: c, color: colors.gray };
  });

  /**
   * Colors all exact matches in green and remove letter
   * from dayWord array to indicate it has been matched
   */
  result.forEach((c, idx) => {
    if (dayWord[idx] == c.value) {
      result[idx].color = colors.green;
      // TODO: not sure if empty char won't cause bugs
      dayWordArr[idx] = '';
    }
  });

  /**
   * Colors all letters that exist but not in the right place
   * in yellow and remove respective letter from dayWord array
   */
  result.forEach((c, idx) => {
    if (dayWordArr.includes(c.value) && c.color != colors.green) {
      result[idx].color = colors.yellow;
      // TODO: not sure if empty char won't cause bugs
      dayWordArr[dayWordArr.indexOf(c.value)] = '';
    }
  });
  return result;
});

/**
 * Validates user's current guess
 *
 * @param {User} user
 * @param {Array} pastUserGuesses
 * @param {String} dayWord
 * @param {Guess} guess
 */
guessSchema.static('validateForUser', function (
  user: UserDocument,
  pastUserGuesses: string[],
  dayWord: string,
  word: WordDocument,
) {
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
  // check if user wasn't already correct
  if (pastUserGuesses.includes(dayWord)) {
    throw new AppError(
      'Invalid input - you have already guessed the word successfully',
      400
    );
  }
  // check if user hasn't already entered the same word
  if (pastUserGuesses.includes(word.content)) {
    throw new AppError(
      'Invalid input - word already entered. please try another',
      400
    );
  }
  // check attempts count
  if (pastUserGuesses.length >= user.attemptsCount) {
    throw new AppError(
      'Invalid input - no more attempts for this language and length',
      400
    );
  }
});

/**
 * Gets all guesses for user according to their
 * current preference for length and language
 *
 * @param {User} user
 */
// What do we return if there is just 1 result or no results? Is it still an array?
guessSchema.static('getByUser', async function (user: UserDocument): Promise<GuessDocument[]> {
  const { todayStr, tomorrowStr } = getDateStrings();
  const findQuery = {
    userId: user._id,
    createdAt: {
      $gte: todayStr,
      $lte: tomorrowStr,
    },
    length: user.wordLength,
    language: user.wordLanguage,
  };
  return await this.find(findQuery);
});

const Guess = model<IGuess, GuessModel>('Guess', guessSchema);

export default Guess;

// TODO: use library
// Helper date formatting function
function getDateStrings() {
  let today = new Date();
  let tomorrow = new Date();
  tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

  const todayStr = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  const tomorrowStr = `${tomorrow.getFullYear()}-${
    tomorrow.getMonth() + 1
  }-${tomorrow.getDate()}`;

  return { todayStr, tomorrowStr };
}
