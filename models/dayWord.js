const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: inherit schema from word
const schema = new Schema({
    content: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        requred: true,
    },
}, { timestamps: true });

const DayWord = mongoose.model('DayWord', schema);

module.exports = DayWord;