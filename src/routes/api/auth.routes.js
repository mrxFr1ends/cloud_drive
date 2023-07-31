import express from 'express';
import UserController from '../../controllers/UserController.js';
import { loginValidationRules, registerValidationRules } from '../../validators/auth.validator.js';
import { validateMiddleware } from '../../middlewares/validateMiddleware.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
const authRouter = new express.Router();

authRouter.post('/login', 
    validateMiddleware(loginValidationRules),
    asyncHandler(UserController.login)
);

authRouter.post('/register', 
    validateMiddleware(registerValidationRules),
    asyncHandler(UserController.register)
);

// logout

export default authRouter;