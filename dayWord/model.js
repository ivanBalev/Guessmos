const mongoose = require('mongoose');
const { wordSchema } = require('../word/model')

const DayWord = mongoose.model('DayWord', wordSchema);

module.exports = DayWord;