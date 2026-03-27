import { RequestValidator } from "../../shared/request.validator.js";


export class UserRoleValidator {

    static validateAssign(req, res, next) {
        const { user_id, role_id } = req.body;

        if (user_id === undefined || role_id === undefined) {
            return res.status(400).json({
                success: false,
                message: "user_id and role_id are required"
            });
        }

        const u = Number(user_id);
        const r = Number(role_id);

        if (!Number.isInteger(u) || !Number.isInteger(r)) {
            return res.status(400).json({
                success: false,
                message: "user_id and role_id must be integers"
            });
        }

        req.body.user_id = u;
        req.body.role_id = r;

        next();
    }

    static validateUserIdParam(req, res, next) {
        const { user_id } = req.params;

        const u = Number(user_id);

        if (!Number.isInteger(u)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user_id"
            });
        }

        req.params.user_id = u;

        next();
    }

    static validateRemoveParams(req, res, next) {
        try {
            req.params.user_id = RequestValidator.validateInteger(
                req.params.user_id,
                "user_id"
            );

            req.params.role_id = RequestValidator.validateInteger(
                req.params.role_id,
                "role_id"
            );

            next();

        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}