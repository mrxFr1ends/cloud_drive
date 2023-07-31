import User from '../models/User.js';

class UserService {
    async create(username, email, password) {
        const user = await User.create({ username, email, password });
        return user;
    }

    async getByNameOrEmail(username, email) {
        const user = await User.findOne({ $or: [{username}, {email}] });
        return user;
    }

    async getById(id) {
        const user = await User.findById(id);
        return user;
    }
}

export default new UserService();