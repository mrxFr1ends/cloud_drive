import jwt from 'jsonwebtoken';

export const generateAuthToken = (user) => {
    const token = jwt.sign(
        { _id: user._id }, 
        process.env.SECRET_KEY, 
        { expiresIn: '1h'}
    );
    return token;
}

export const verifyToken = (token) => {
    const tokenData = jwt.verify(token, process.env.SECRET_KEY);
    return { _id: tokenData._id }
}