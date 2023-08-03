import express from 'express';
import authRouter from './auth.routes.js';
import diskRouter from './disk.routes.js';
import { userMiddleware } from '../../middlewares/userMiddleware.js';
const apiRouter = new express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/disk', userMiddleware, diskRouter);

export default apiRouter;