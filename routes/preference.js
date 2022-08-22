const userService = require('../user/dbService');

const setUserPreference = async (req, res) => {
    const user = await userService.getUser(req.headers.uuid);
    if (user.error) {
        return res.send(user);
    }

    res.send(await userService.updateUser(user.id, req.body));
}

module.exports = setUserPreference;

