const { Schema, model } = require('mongoose');

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
      default: function () {
        return this.content.length;
      },
    },
    dayWordDates: [Date],
  },
  { timestamps: true }
);

const Word = model('Word', wordSchema);

module.exports = Word;
