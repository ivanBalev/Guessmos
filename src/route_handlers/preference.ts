import userService from '../user/dbService';

const setUserPreference = async (req: any, res: any) => {
    const user = await userService.getUser(req.headers.uuid);
    if (user.error) {
        return res.send(user);
    }

    res.send(await userService.updateUser(user.id, req.body));
}

export default setUserPreference;

