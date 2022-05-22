const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dayWordSchema = new Schema({
    wordId: {
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
}, { timestamps: true });


const DayWord = mongoose.model('DayWord', dayWordSchema);

module.exports = DayWord;