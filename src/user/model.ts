import mongoose from 'mongoose';
import * as userConstants from './constants';


const userSchema = new mongoose.Schema({
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
    },
}, { timestamps: true });

userSchema.virtual('id').get(function () {
    return this._id.toString();
});

const User = mongoose.model('User', userSchema);

export default User;