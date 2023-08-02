import { body, param, query } from 'express-validator';

export const createFolderValidationRules = [
    body('name').trim()
        .exists().notEmpty().withMessage("name is required")
        .not().matches(/[\t\n\r\x0b\x0c]+/).withMessage("name contains invalid characters"),
    body('parentId', 'Incorrect parentId')
        .exists().withMessage("parentId is required")
        .isMongoId().withMessage("parentId must be MongoId")
];

export const getFolderValidationRules = [
    param('id').optional().isMongoId().withMessage("id must be MongoId"),
    query('filter').optional().equals('trashed').withMessage("filter must be equal to 'trashed'")
];

export const updateFolderValidationRules = [
    body('id')
        .exists().withMessage("id is required")
        .isMongoId().withMessage("id must be MongoId"),
    body('trashed').optional().isBoolean({ strict: true }).withMessage("trashed must be boolean"),
    body('name').optional().trim()
        .notEmpty().withMessage("name cannot be empty")
        .not().matches(/[\t\n\r\x0b\x0c]+/).withMessage("name contains invalid characters")
];

export const deleteFolderValidationRules = [
    param('id')
        .exists().withMessage("id is required")
        .isMongoId().withMessage("id must be MongoId")
];