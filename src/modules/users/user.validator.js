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
    static validateRoleParam(req, res, next) {
        try {


            const { role } = req.params;

            if (!role || typeof role !== "string") {
                throw new Error("Role must be a valid string");
            }

            req.params.role = role.trim().toLowerCase();

            if (!req.params.role) {
                throw new Error("Role cannot be empty");
            }

            next();

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}