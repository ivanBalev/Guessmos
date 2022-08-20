const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guessSchema = new Schema({
    userId: {
        type: String,
        requred: true,
    },
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

const Guess = mongoose.model('Guess', guessSchema);

module.exports = Guess;