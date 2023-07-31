import { generateAuthToken } from '../helpers/jwt.js';
import { getPasswordHash, comparePassword } from '../helpers/passwordHash.js';
import Folder from '../models/Folder.js';
import UserService from '../services/UserService.js';

const getResponseWithToken = (user) => {
    return {
        token: generateAuthToken(user), 
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            diskSpace: user.diskSpace,
            usedSpace: user.usedSpace,
        }
    };
}

class UserController {
    async register(req, res) {
        const { username, email, password } = req.body;
        if (await UserService.getByNameOrEmail(username, email))
            return res.status(400).json({message: `User with email '${email}' or username '${username}' already exist`});

        const hashPassword = await getPasswordHash(password);
        const user = await UserService.create(username, email, hashPassword);

        await Folder.create({ _id: user._id, name: user._id, ownerId: user._id });

        return res.json(getResponseWithToken(user));
    }

    async login(req, res) {
        const { login, password } = req.body;
        const user = await UserService.getByNameOrEmail(login, login);
        if (!user)
            return res.status(401).json({message: "Incorrect email, username or password"});

        if (!(await comparePassword(password, user.password))) 
            return res.status(401).json({message: "Incorrect email, username or password"});

        return res.json(getResponseWithToken(user));
    }
}

export default new UserController();