export class SurgeryUsersValidator {
    static validateIds(req, res, next) {
        try {
            const surgery_id = Number(req.params.surgery_id);
            const user_id = Number(req.params.user_id);

            if (!Number.isInteger(surgery_id) || surgery_id <= 0) {
                throw new Error("Invalid surgery_id");
            }

            if (!Number.isInteger(user_id) || user_id <= 0) {
                throw new Error("Invalid user_id");
            }

            req.params.surgery_id = surgery_id;
            req.params.user_id = user_id;

            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static validateSurgeryId(req, res, next) {
        try {
            const surgery_id = Number(req.params.surgery_id);

            if (!Number.isInteger(surgery_id) || surgery_id <= 0) {
                throw new Error("Invalid surgery_id");
            }

            req.params.surgery_id = surgery_id;
            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static validateUserId(req, res, next) {
        try {
            const user_id = Number(req.params.user_id);

            if (!Number.isInteger(user_id) || user_id <= 0) {
                throw new Error("Invalid user_id");
            }

            req.params.user_id = user_id;
            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static validateCreate(req, res, next) {
        try {
            const { surgery_id, user_id, surgery_role_id } = req.body;

            if (
                surgery_id === undefined ||
                user_id === undefined ||
                surgery_role_id === undefined
            ) {
                throw new Error(
                    "Fields 'surgery_id', 'user_id' and 'surgery_role_id' are required"
                );
            }

            req.body.surgery_id = Number(surgery_id);
            req.body.user_id = Number(user_id);
            req.body.surgery_role_id = Number(surgery_role_id);

            if (!Number.isInteger(req.body.surgery_id) || req.body.surgery_id <= 0) {
                throw new Error("Invalid surgery_id");
            }

            if (!Number.isInteger(req.body.user_id) || req.body.user_id <= 0) {
                throw new Error("Invalid user_id");
            }

            if (
                !Number.isInteger(req.body.surgery_role_id) ||
                req.body.surgery_role_id <= 0
            ) {
                throw new Error("Invalid surgery_role_id");
            }

            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static validateUpdateRole(req, res, next) {
        try {
            const { surgery_role_id } = req.body;

            if (surgery_role_id === undefined) {
                throw new Error("Field 'surgery_role_id' is required");
            }

            req.body.surgery_role_id = Number(surgery_role_id);

            if (
                !Number.isInteger(req.body.surgery_role_id) ||
                req.body.surgery_role_id <= 0
            ) {
                throw new Error("Invalid surgery_role_id");
            }

            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}