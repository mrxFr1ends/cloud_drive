import { validationResult } from "express-validator";

export const validateMiddleware = validationRules => {
    return async (req, res, next) => {
        await Promise.all(validationRules.map(rule => rule.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty())
            return next();

        res.status(400).json({
            message: "Validation failed",
            errors: errors.formatWith(error => error.msg).mapped()
        })
    };
}