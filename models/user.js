const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = {
  minGuessLength: 5,
  maxGuessLength: 11,
  minAttemptsCount: 6,
  maxAttemptsCount: 50,
  languages: { en: 'en', bg: 'bg' },
};

const userSchema = new Schema(
  {
    guessLength: {
      type: Number,
      default: constants.minGuessLength,
      min: [
        constants.minGuessLength,
        `Guess length must be above ${constants.minGuessLength - 1}`,
      ],
      max: [
        constants.maxGuessLength,
        `Guess length must be below ${constants.maxGuessLength + 1}`,
      ],
    },
    guessLanguage: {
      type: String,
      default: constants.languages.en,
      enum: {
        values: Object.values(constants.languages),
        message: 'Unsupported language',
      },
    },
    attemptsCount: {
      type: Number,
      default: constants.minAttemptsCount,
      min: [
        constants.minAttemptsCount,
        `Attempts must be above ${constants.minAttemptsCount - 1}`,
      ],
      max: [
        constants.maxAttemptsCount,
        `Attempts must be below ${constants.maxAttemptsCount + 1}`,
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
