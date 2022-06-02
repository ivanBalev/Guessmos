import mongoose from 'mongoose';

const guessSchema = new mongoose.Schema({
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

export default Guess;