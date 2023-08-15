import { matchedData, validationResult } from "express-validator";

export const validateMiddleware = validationRules => {
    return async (req, res, next) => {
        await Promise.all(validationRules.map(rule => rule.run(req)));
        
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            req.body = matchedData(req, { locations: ['body'], includeOptionals: true });
            req.query = matchedData(req, { locations: ['query'], includeOptionals: true });
            req.params = matchedData(req, { locations: ['params'], includeOptionals: true });
            req.cookies = matchedData(req, { locations: ['cookies'], includeOptionals: true });
            req.headers = matchedData(req, { locations: ['headers'], includeOptionals: true });
            return next();
        }

        res.status(400).json({
            message: "Validation failed",
            errors: errors.formatWith(error => error.msg).mapped()
        })
    };
}