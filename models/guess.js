const { Schema, model } = require('mongoose');
const AppError = require('./../utils/appError');
const constants = {
  minLength: 5,
  maxLength: 11,
};
const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};

const guessSchema = new Schema(
  {
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
      type: Schema.ObjectId,
      ref: 'User',
      requred: true,
    },
    wordId: {
      type: Schema.ObjectId,
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
guessSchema.statics.colorContent = function (guessContent, dayWord) {
  // Throw error if params are not strings
  if (typeof guessContent !== 'string' || typeof dayWord !== 'string') {
    throw new AppError(
      'Invalid input - please enter arguments of appropriate type',
      400
    );
  }

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
      dayWordArr[idx] = null;
    }
  });

  /**
   * Colors all letters that exist but not in the right place
   * in yellow and remove respective letter from dayWord array
   */
  result.forEach((c, idx) => {
    if (dayWordArr.includes(c.value) && c.color != colors.green) {
      result[idx].color = colors.yellow;
      dayWordArr[dayWordArr.indexOf(c.value)] = null;
    }
  });
  return result;
};

/**
 * Validates user's current guess
 *
 * @param {User} user
 * @param {Array} pastUserGuesses
 * @param {String} dayWord
 * @param {Guess} guess
 */
guessSchema.statics.validateForUser = function (
  user,
  pastUserGuesses,
  dayWord,
  guess
) {
  // user preference does not match entered data
  if (user.wordLength !== guess.length) {
    throw new AppError(
      `Invalid input - please insert guess with length ${user.wordLength}`,
      400
    );
  }
  // user preference does not match entered data
  if (user.wordLanguage !== guess.language) {
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
  if (pastUserGuesses.includes(guess.content)) {
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
};

/**
 * Gets all guesses for user according to their
 * current preference for length and language
 *
 * @param {User} user
 */
guessSchema.statics.getByUser = async function (user) {
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
};

const Guess = model('Guess', guessSchema);

module.exports = Guess;

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
