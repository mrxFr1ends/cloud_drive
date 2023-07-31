import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

export const generateAuthToken = (user) => {
    const token = jwt.sign(
        { _id: user._id }, 
        SECRET_KEY, 
        { expiresIn: '1h'}
    );
    return token;
}

export const verifyToken = (token) => {
    const tokenData = jwt.verify(token, SECRET_KEY);
    return { _id: tokenData._id }
}