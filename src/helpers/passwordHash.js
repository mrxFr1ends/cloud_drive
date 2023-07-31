import bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from '../config.js';

export const getPasswordHash = async (password) => {
    const hash = bcrypt.hash(password, SALT_OR_ROUNDS);
    return hash;
}

export const comparePassword = async (password, passwordHash) => {
    const compared = bcrypt.compare(password, passwordHash);
    return compared;
}