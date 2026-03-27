import { RequestValidator } from "../../shared/request.validator.js";

export class UserValidator {

    static validateIdParam(req, res, next) {
        try {
            req.params.id = RequestValidator.validateInteger(
                req.params.id,
                "id"
            );

            next();

        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }

    static validateCreate(req, res, next) {
        try {
            RequestValidator.requireFields(req.body, [
                "id",
                "fName",
                "lName",
                "password",
                "roles"
            ]);

            req.body.id = RequestValidator.validateInteger(
                req.body.id,
                "id"
            );

            req.body.roles = RequestValidator.validateIntegers(
                req.body.roles
            );

            if (!Array.isArray(req.body.roles) || req.body.roles.length === 0) {
                throw new Error("roles must be a non-empty array");
            }

            req.body.fName = req.body.fName.trim();
            req.body.lName = req.body.lName.trim();

            if (!req.body.fName || !req.body.lName) {
                throw new Error("Names cannot be empty");
            }

            if (req.body.password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }

            next();

        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}