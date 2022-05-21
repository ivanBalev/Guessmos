const mongoose = require('mongoose');
const { wordSchema } = require('./wordModel')

const DayWord = mongoose.model('DayWord', wordSchema);

module.exports = DayWord;