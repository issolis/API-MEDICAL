export class RoleValidator {

    static validateDescription(req, res, next) {
        const { description } = req.params;

        if (!description || typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid description"
            });
        }

        const trimmed = description.trim();

        if (trimmed.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Description cannot be empty"
            });
        }

        req.params.description = trimmed.toLowerCase();

        next();
    }
}