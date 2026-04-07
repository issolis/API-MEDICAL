import {RequestValidator} from "../../shared/request.validator.js"

export class PatientValidator {

    static validateCreate(req, res, next) {
        try {
            const { fName, lName } = req.body;

            if (!fName || !lName) {
                throw new Error("Missing patient name");
            }

            if (typeof fName !== "string" || typeof lName !== "string") {
                throw new Error("Names must be strings");
            }

            req.body.fName = fName.trim();
            req.body.lName = lName.trim();

            if (!req.body.fName || !req.body.lName) {
                throw new Error("Invalid names");
            }

            next();

        } catch (error) {
            res.status(400).json({ error: error.message });
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
            next(error);
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
            next(error);
        }
    }

}