export class SurgeryRoleValidator {
    static validateId(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new Error("Invalid surgery role id");
            }

            req.params.id = id;
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
            const { description } = req.body;

            if (description === undefined) {
                throw new Error("Field 'description' is required");
            }

            if (typeof description !== "string") {
                throw new Error("Description must be a string");
            }

            const cleaned = description.trim();

            if (!cleaned) {
                throw new Error("Description cannot be empty");
            }

            if (cleaned.length > 50) {
                throw new Error("Description cannot exceed 50 characters");
            }

            req.body.description = cleaned;
            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static validateUpdate(req, res, next) {
        return this.validateCreate(req, res, next);
    }
}