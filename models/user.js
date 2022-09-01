const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = {
  minWordLength: 5,
  maxWordLength: 11,
  minAttemptsCount: 6,
  maxAttemptsCount: 50,
  languages: { en: 'en', bg: 'bg' },
};

const userSchema = new Schema(
  {
    wordLength: {
      type: Number,
      default: constants.minWordLength,
      min: [
        constants.minWordLength,
        `Guess length must be above ${constants.minWordLength - 1}`,
      ],
      max: [
        constants.maxWordLength,
        `Guess length must be below ${constants.maxWordLength + 1}`,
      ],
    },
    wordLanguage: {
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
