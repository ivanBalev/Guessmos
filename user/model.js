const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userConstants = require('./constants');


const userSchema = new Schema({
    wordLength: {
        type: Number,
        requred: true,
        default: userConstants.defaultGuessLength,
    },
    wordLanguage: {
        type: String,
        required: true,
        default: userConstants.defaultGuessLanguage,
    },
    attemptsCount: {
        type: Number,
        required: true,
        default: userConstants.defaulAttemptsCount,
    },
}, { timestamps: true });

userSchema.virtual('id').get(function () {
    return this._id.toString();
});

const User = mongoose.model('User', userSchema);

module.exports = User;