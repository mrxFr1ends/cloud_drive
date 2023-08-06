import { generateAuthToken } from "../helpers/jwt.js";
import { comparePassword, getPasswordHash } from "../helpers/passwordHash.js";
import FolderService from "../services/FolderService.js";
import UserService from "../services/UserService.js";

const getResponseWithToken = user => {
    return {
        token: generateAuthToken(user),
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            diskSpace: user.diskSpace,
            usedSpace: user.usedSpace,
        },
    };
};

class UserController {
    async register(req, res) {
        const { username, email, password } = req.body;
        if (await UserService.getByNameOrEmail(username, email))
            return res
                .status(409)
                .json({
                    message: "User with this email or username already exists",
                });

        const hashPassword = await getPasswordHash(password);
        const user = await UserService.create(username, email, hashPassword);

        await FolderService.createRoot(user._id);
        return res.status(201).json(getResponseWithToken(user));
    }

    async login(req, res) {
        const { login, password } = req.body;
        const user = await UserService.getByNameOrEmail(login, login);
        if (!user)
            return res
                .status(401)
                .json({ message: "Incorrect email, username or password" });

        if (!(await comparePassword(password, user.password)))
            return res
                .status(401)
                .json({ message: "Incorrect email, username or password" });

        return res.json(getResponseWithToken(user));
    }

    async auth(req, res) {
        return res.json(getResponseWithToken(req.user));
    }
}

export default new UserController();
