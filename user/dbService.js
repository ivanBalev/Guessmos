const User = require('./model');
const constants = require('./constants');

const getUser = async (uuid) => {
    if (uuid && uuid.length !== constants.defaultIdLength) {
        return { error: 'invalid uuid' };
    }

    const user = uuid ? await User.findById(uuid) : await new User().save();

    if (!user) {
        return { error: 'user with given uuid does not exist. insert empty value to generate new uuid or try again' };
    }

    return user;
}

module.exports = {
    getUser
}
