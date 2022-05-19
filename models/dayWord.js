const mongoose = require('mongoose');
const { wordSchema } = require('../models/word')

const DayWord = mongoose.model('DayWord', wordSchema);

module.exports = DayWord;