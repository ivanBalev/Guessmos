const mongoose = require('mongoose');
const { wordSchema } = require('../models/word')

// TODO: consider removing entity altogether and using server cache with regular word entity
const DayWord = mongoose.model('DayWord', wordSchema);

module.exports = DayWord;