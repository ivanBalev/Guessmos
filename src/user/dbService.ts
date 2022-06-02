import User from './model';
import * as userConstants from './constants';
import * as wordConstants from '../word/constants';

const maxAttemptsCount = 50;

const getUser = async (uuid: any) => {
    if (uuid && uuid.length !== userConstants.defaultIdLength) {
        return { error: 'invalid uuid' };
    }

    const user = uuid ? await User.findById(uuid) : await new User().save();

    if (!user) {
        return { error: 'user with given uuid does not exist. insert empty value to generate new uuid or try again' };
    }

    return user;
}

const updateUser = async (uuid: any, preference: any) => {
    let validatedPreference: {
        wordLanguage: string,
        wordLength: number,
        attemptsCount: number,
    } = { wordLanguage: '', wordLength: 0, attemptsCount: 0 };

    if (Object.values(wordConstants.languages).includes(preference.wordLanguage)) {
        validatedPreference.wordLanguage = preference.wordLanguage;
    }

    if (preference.wordLength >= wordConstants.defaultWordLength &&
        preference.wordLength < wordConstants.defaultWordLength + wordConstants.defaultWordsCount) {
        validatedPreference.wordLength = preference.wordLength;
    }

    if (!isNaN(preference.attemptsCount) && preference.attemptsCount > 0) {
        if (preference.attemptsCount > maxAttemptsCount) {
            preference.attemptsCount = maxAttemptsCount;
        }
        validatedPreference.attemptsCount = preference.attemptsCount;
    }

    await User.findByIdAndUpdate(uuid, validatedPreference);
}

export default {
    getUser,
    updateUser,
}
