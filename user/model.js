const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userConstants = require('./constants');

const userSchema = new Schema(
  {
    guessLength: {
      type: Number,
      requred: true,
      default: userConstants.defaultGuessLength,
    },
    guessLanguage: {
      type: String,
      required: true,
      default: userConstants.defaultGuessLanguage,
    },
    attemptsCount: {
      type: Number,
      required: true,
      default: userConstants.defaulAttemptsCount,
    },
  },
  { timestamps: true }
);

// TODO: Increment attempts count?

userSchema.methods.validateGuess = function (userGuesses, dayWord, guess) {
  // user preference does not match entered data
  if (this.guessLength !== guess.length) {
    return {
      error: `please insert guess with length ${this.guessLength} or change settings`,
    };
  }
  // user preference does not match entered data
  if (this.guessLanguage !== guess.language) {
    return {
      error: `please insert guess in language ${this.guessLanguage} or change settings`,
    };
  }
  // check if user wasn't already correct
  if (userGuesses.includes(dayWord)) {
    return { error: 'you have already guessed the word successfully' };
  }
  // check if user hasn't already entered the same word
  if (userGuesses.includes(guess.content)) {
    return { error: 'word already entered. please try another' };
  }
  // check attempts count
  if (userGuesses.length == this.attemptsCount) {
    return { error: 'no more attempts for this language and length' };
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
