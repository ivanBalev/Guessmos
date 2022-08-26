const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Word must have content'],
    },
    language: {
      type: String,
      requred: [true, 'Word must have language'],
      enum: {
        values: ['en', 'bg'],
        message: 'Supported languages: en, bg',
      },
    },
    length: {
      type: Number,
      required: true,
    },
    dayWordDates: [Date],
  },
  { timestamps: true }
);

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
