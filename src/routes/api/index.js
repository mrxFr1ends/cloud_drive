import express from 'express';
import authRouter from './auth.routes.js';
import diskRouter from './disk.routes.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
const apiRouter = new express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/disk', authMiddleware, diskRouter);

export default apiRouter;