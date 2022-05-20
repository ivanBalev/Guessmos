const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultWordLength = 5;
const defaultWordLanguage = null;

const userSchema = new Schema({
    wordLength: {
        type: Number,
        requred: true,
        default: defaultWordLength,
    },
    wordLanguage: {
        type: String,
        required: true,
        default: defaultWordLanguage,
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;