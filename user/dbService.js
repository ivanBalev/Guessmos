const User = require('./model');
const userConstants = require('./constants');
const wordConstants = require('../word/constants');

const getUser = async (uuid) => {
    if (uuid && uuid.length !== userConstants.defaultIdLength) {
        return { error: 'invalid uuid' };
    }

    const user = uuid ? await User.findById(uuid) : await new User().save();

    if (!user) {
        return { error: 'user with given uuid does not exist. insert empty value to generate new uuid or try again' };
    }

    return user;
}

const updateUser = async (uuid, preference) => {
    const validatedPreference = {};

    // Мега грубата валидация :x
    if (Object.values(wordConstants.languages).includes(preference.wordLanguage)) {
        validatedPreference.wordLanguage = preference.wordLanguage;
    }

    if (preference.wordLength >= wordConstants.defaultWordLength &&
        preference.wordLength < wordConstants.defaultWordLength + wordConstants.defaultWordsCount) {
        validatedPreference.wordLength = preference.wordLength;
    }

    if (!isNaN(preference.attemptsCount) && preference.attemptsCount > 0) {
        validatedPreference.attemptsCount = preference.attemptsCount;
    }

    await User.findByIdAndUpdate(uuid, validatedPreference);
}

module.exports = {
    getUser,
    updateUser,
}
