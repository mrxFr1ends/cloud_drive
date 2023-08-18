import bcrypt from 'bcrypt';

export const getPasswordHash = async (password) => {
    const hash = bcrypt.hash(password, +process.env.SALT_OR_ROUNDS);
    return hash;
}

export const comparePassword = async (password, passwordHash) => {
    const compared = bcrypt.compare(password, passwordHash);
    return compared;
}