const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Guess = mongoose.model('Guess', guessSchema);

module.exports = Guess;
