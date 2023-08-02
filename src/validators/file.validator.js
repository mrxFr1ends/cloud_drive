import { body, param } from "express-validator";

export const getFileValidationRules = [
    param("id")
        .optional()
        .isMongoId().withMessage("id must be MongoId")
];

export const updateFileValidationRules = [
    body("id")
        .exists().withMessage("id is required")
        .isMongoId().withMessage("id must be MongoId"),
    body("trashed")
        .optional()
        .isBoolean({ strict: true }).withMessage("trashed must be boolean"),
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("name cannot be empty")
        .not().matches(/[\t\n\r\x0b\x0c]+/).withMessage("name contains invalid characters")
];

export const deleteFileValidationRules = [
    param("id")
        .exists().withMessage("id is required")
        .isMongoId().withMessage("id must be MongoId")
];