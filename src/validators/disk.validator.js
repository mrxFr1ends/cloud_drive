import { body, param, query } from "express-validator";

const typeValidationRules = (place) =>
    place("type")
        .exists()
        .withMessage("type is required")
        .isIn(["file", "folder"])
        .withMessage('type must be "file" or "folder"');

const idValidationRules = (place, name) => 
    place(name)
        .exists()
        .withMessage(`${name} is required`)
        .isMongoId()
        .withMessage(`${name} must be MongoId`);

const nameValidationRules = (required) => {
    const rules = [ 
        body('name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage("name cannot be empty")
            .not()
            .matches(/[\t\n\r\x0b\x0c]+/)
            .withMessage("name contains invalid characters")
    ];
    if (required) {
        rules.unshift(
            body('name')
                .exists()
                .withMessage("name is required")
        )
    }
    return rules;
}

export const create = [
    ...nameValidationRules(true),
    idValidationRules(body, 'parentId'),
    typeValidationRules(body),
];

export const getRoot = [
    query("filter")
        .optional()
        .isIn(["trashed", "all"])
        .withMessage('filter must be equal "trashed" or "all"'),
];

export const getById = [
    idValidationRules(param, 'id'),
    typeValidationRules(query)
];

export const updateById = [
    idValidationRules(body, 'id'),
    body("trashed")
        .optional()
        .isBoolean({ strict: true })
        .withMessage("trashed must be boolean"),
    ...nameValidationRules(false),
    typeValidationRules(body)
];

export const deleteById = [
    idValidationRules(param, 'id'),
    typeValidationRules(query)
];
