const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userConstants = require('./userConstants');


const userSchema = new Schema({
    wordLength: {
        type: Number,
        requred: true,
        default: userConstants.defaultWordLength,
    },
    wordLanguage: {
        type: String,
        required: true,
        default: userConstants.defaultWordLanguage,
    },
    attemptsCount: {
        type: Number,
        required: true,
        default: userConstants.defaulAttemptsCount,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;