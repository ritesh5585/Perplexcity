import { body, validationResult } from "express-validator"

export function validate(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}
export const registerValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("username is required")
        .isLength(
            {
                min: 3,
                max: 30
            }
        ).withMessage("username must be between 3 and 30 character")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must contain 6 character"),

    validate

]

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Valid email is required"),

    body("password")
        .notEmpty().withMessage("Password is required"),

    validate
]