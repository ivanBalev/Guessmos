const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      requred: true,
    },
    wordId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Word',
      required: true,
    },
  },
  { timestamps: true }
);

guessSchema.statics.colorContent = function (guessContent, dayWord) {
  if (typeof guessContent !== 'string' || typeof dayWord !== 'string') {
    throw new AppError('please enter arguments of appropriate type');
  }

  if (
    guessContent.length < constants.minLength ||
    guessContent.length > constants.maxLength ||
    dayWord.length < constants.minLength ||
    dayWord.length > constants.maxLength ||
    dayWord.length !== guessContent.length
  ) {
    throw new AppError('unsupported data length');
  }

  let dayWordArr = [...dayWord];
  let result = [...guessContent].map((c) => {
    return { value: c, color: colors.gray };
  });
  // green
  result.forEach((c, idx) => {
    if (dayWord[idx] == c.value) {
      result[idx].color = colors.green;
      dayWordArr[idx] = null;
    }
  });
  // yellow
  result.forEach((c, idx) => {
    if (dayWordArr.includes(c.value) && c.color != colors.green) {
      result[idx].color = colors.yellow;
      dayWordArr[dayWordArr.indexOf(c.value)] = null;
    }
  });
  return result;
};

guessSchema.statics.validateForUser = function (
  user,
  pastUserGuesses,
  dayWord,
  guess
) {
  // user preference does not match entered data
  if (user.guessLength !== guess.length) {
    throw new AppError(`please insert guess with correct length`);
  }
  // user preference does not match entered data
  if (user.guessLanguage !== guess.language) {
    throw new AppError(`please insert guess in correct language`);
  }
  // check if user wasn't already correct
  if (pastUserGuesses.includes(dayWord)) {
    throw new AppError('you have already guessed the word successfully');
  }
  // check if user hasn't already entered the same word
  if (pastUserGuesses.includes(guess.content)) {
    throw new AppError('word already entered. please try another');
  }
  // check attempts count
  if (pastUserGuesses.length >= user.attemptsCount) {
    throw new AppError('no more attempts for this language and length');
  }
};

guessSchema.statics.getByUser = async function (user) {
  const { todayStr, tomorrowStr } = getDateStrings();
  const findQuery = {
    userId: user._id,
    createdAt: {
      $gte: todayStr,
      $lte: tomorrowStr,
    },
    length: user.guessLength,
    language: user.guessLanguage,
  };
  return await this.find(findQuery);
};

const Guess = mongoose.model('Guess', guessSchema);

module.exports = Guess;

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
