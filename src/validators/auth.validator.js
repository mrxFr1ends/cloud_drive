import { oneOf, body } from 'express-validator';

const usernameRule = (field) => body(field, "Incorrect username")
    .exists().withMessage("Username is required")
    .isLength({min: 6, max: 20}).withMessage("Username must be at least 6 characters and more than 20 characters")
    .isAlpha().withMessage("Username can contain only latin alpha characters");

const emailRule = (field) => body(field, "Incorrect email")
    .isEmail();

const passwordRule = body('password', "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number")
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });

export const login = [
    body('login').custom(async (_, { req }) => {
        return oneOf([
            usernameRule('login'),
            emailRule('login'),
        ])
        .run(req, { dryRun: true })
        .then(results => {
            if (results.array().length !== 0)
                throw new Error("Invalid username or email")
        });
    }), 
    passwordRule
];

export const register = [
    usernameRule('username'),
    emailRule('email'),
    passwordRule
];