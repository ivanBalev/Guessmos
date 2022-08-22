const User = require('./model');
const userConstants = require('./constants');

const getUser = async (uuid) => {
  // TODO: elvis operator
  if (uuid && uuid.length !== userConstants.defaultIdLength) {
    return { error: 'invalid uuid' };
  }

  const user = uuid ? await User.findById(uuid) : await new User().save();

  if (!user) {
    return {
      error:
        'user with given uuid does not exist. insert empty value to generate new uuid or try again',
    };
  }

  return user;
};

const updateUser = async (uuid, preference) => {
  const validatedPreference = {};

  if (
    Object.values(userConstants.languages).includes(preference.wordLanguage)
  ) {
    validatedPreference.wordLanguage = preference.wordLanguage;
  }

  if (
    preference.wordLength >= userConstants.defaultGuessLength &&
    preference.wordLength < userConstants.maxGuessLength
  ) {
    validatedPreference.wordLength = preference.wordLength;
  }

  if (!isNaN(preference.attemptsCount) && preference.attemptsCount > 0) {
    if (preference.attemptsCount > userConstants.maxAttemptsCount) {
      preference.attemptsCount = maxAttemptsCount;
    }
    validatedPreference.attemptsCount = preference.attemptsCount;
  }

  await User.findByIdAndUpdate(uuid, validatedPreference);
};

module.exports = {
  getUser,
  updateUser,
};
