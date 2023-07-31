import { verifyToken } from '../helpers/jwt.js';

export const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS')
        return next();
    
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer'))
        return res.status(401).json({message: "User not logged in"});

    const token = auth.slice(7);
    try {
        const decoded = verifyToken(token);
        req.tokenData = decoded;
        next();
    } catch (err) { 
        if (err.name === 'TokenExpiredError')
            return res.status(403).send({message: "Error verifying token"});
        throw err;
    }
};