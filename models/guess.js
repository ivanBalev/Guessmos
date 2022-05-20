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
}, { timestamps: true });

const Guess = mongoose.model('Guess', guessSchema);

module.exports = Guess;