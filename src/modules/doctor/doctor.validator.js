import { RequestValidator } from "../../shared/request.validator.js";

export class DoctorValidator {
    static validateId(req, res, next) {
        try {
            req.params.id = RequestValidator.validateInteger(
                req.params.id,
                "id"
            );

            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static validateUserId(req, res, next) {
        try {
            req.params.userId = RequestValidator.validateInteger(
                req.params.userId,
                "userId"
            );

            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static validateUserIdAndSurgeryId(req, res, next) {
        try {
            req.params.userId = RequestValidator.validateInteger(
                req.params.userId,
                "userId"
            );

            req.params.surgeryId = RequestValidator.validateInteger(
                req.params.surgeryId,
                "surgeryId"
            );

            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}