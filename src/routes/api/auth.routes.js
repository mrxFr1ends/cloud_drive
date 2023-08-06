import express from 'express';
import UserController from '../../controllers/UserController.js';
import * as ValidationRules from '../../validators/auth.validator.js';
import { validateMiddleware } from '../../middlewares/validateMiddleware.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { userMiddleware } from '../../middlewares/userMiddleware.js';
const authRouter = new express.Router();

authRouter.post('/login', 
    validateMiddleware(ValidationRules.login),
    asyncHandler(UserController.login)
);

authRouter.post('/register', 
    validateMiddleware(ValidationRules.register),
    asyncHandler(UserController.register)
);

authRouter.get('/auth', userMiddleware, asyncHandler(UserController.auth));

export default authRouter;