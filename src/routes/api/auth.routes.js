import express from 'express';
import UserController from '../../controllers/UserController.js';
import * as ValidationRules from '../../validators/auth.validator.js';
import { validateMiddleware } from '../../middlewares/validateMiddleware.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
const authRouter = new express.Router();

authRouter.post('/login', 
    validateMiddleware(ValidationRules.login),
    asyncHandler(UserController.login)
);

authRouter.post('/register', 
    validateMiddleware(ValidationRules.register),
    asyncHandler(UserController.register)
);

export default authRouter;