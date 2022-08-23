const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    userId: {
      type: mongoose.Schema.ObjectId,
      requred: true,
    },
    wordId: {
      type: mongoose.Schema.ObjectId,
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
  },
  { timestamps: true }
);

guessSchema.methods.color = function (dayWord) {
  let dayWordArr = [...dayWord];
  let result = [...this].map((c) => {
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

const Guess = mongoose.model('Guess', guessSchema);

module.exports = Guess;
