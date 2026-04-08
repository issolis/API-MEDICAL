export class SurgeryStateValidator {

    // Valida que el parámetro :id sea un entero positivo
    static validateId(req, res, next) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid id: must be a positive integer"
            });
        }
        next();
    }

    // Valida que el parámetro :description sea un string válido
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

    // Valida el body para crear o actualizar (POST / PUT)
    static validateBody(req, res, next) {
        const { description } = req.body;
        if (!description || typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Field 'description' is required and must be a string"
            });
        }
        const trimmed = description.trim();
        if (trimmed.length === 0 || trimmed.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Description must be between 1 and 100 characters"
            });
        }
        req.body.description = trimmed;
        next();
    }
}