const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guessSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        requred: true,
    },
    length: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Guess = mongoose.model('Guess', guessSchema);

module.exports = Guess;