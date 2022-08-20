const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      requred: true,
    },
    length: {
      type: Number,
      required: true,
    },
    dayWordDates: [Date],
  },
  { timestamps: true }
);

// TODO: this can be circumvented. NOT NEEDED
wordSchema.virtual('id').get(function () {
  return this._id.toString();
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
