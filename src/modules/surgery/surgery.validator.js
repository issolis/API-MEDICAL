import { RequestValidator } from "../../shared/request.validator.js";
import {SurgeryService} from "./surgery.service.js"

export class SurgeryValidator {

    // Valida :id como entero positivo
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

    // Valida :stateId
    static validateStateId(req, res, next) {
        const id = Number(req.params.stateId);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid stateId: must be a positive integer"
            });
        }
        next();
    }

    // Valida :typeId
    static validateTypeId(req, res, next) {
        const id = Number(req.params.typeId);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid typeId: must be a positive integer"
            });
        }
        next();
    }

    // Valida :userId
    static validateUserId(req, res, next) {
        const id = Number(req.params.userId);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId: must be a positive integer"
            });
        }
        next();
    }

    // Valida el body para crear/actualizar cirugía
    static validateBody(req, res, next) {
    try {
        const {
            surgery_date,
            type_id,
            state_id,
            patient_id,
            surgeon_id,
            anesthesiologist_id,
            assistant_ids
        } = req.body;

        // surgery_date
        if (!surgery_date) {
            throw new Error("Field 'surgery_date' is required");
        }

        const dateObj = new Date(surgery_date);
        if (isNaN(dateObj.getTime())) {
            throw new Error("Field 'surgery_date' must be a valid date (ISO 8601)");
        }

        // type_id
        if (!Number.isInteger(type_id) || type_id <= 0) {
            throw new Error("Field 'type_id' is required and must be a positive integer");
        }

        // state_id
        if (!Number.isInteger(state_id) || state_id <= 0) {
            throw new Error("Field 'state_id' is required and must be a positive integer");
        }

        // patient_id
        if (!Number.isInteger(patient_id) || patient_id <= 0) {
            throw new Error("Field 'patient_id' is required and must be a positive integer");
        }

        // surgeon_id
        if (!Number.isInteger(surgeon_id) || surgeon_id <= 0) {
            throw new Error("Field 'surgeon_id' is required and must be a positive integer");
        }

        // anesthesiologist_id
        if (
            !Number.isInteger(anesthesiologist_id) ||
            anesthesiologist_id <= 0
        ) {
            throw new Error(
                "Field 'anesthesiologist_id' is required and must be a positive integer"
            );
        }

        // assistant_ids
        if (!Array.isArray(assistant_ids)) {
            throw new Error("Field 'assistant_ids' is required and must be an array");
        }

        for (const assistantId of assistant_ids) {
            if (!Number.isInteger(assistantId) || assistantId <= 0) {
                throw new Error(
                    "All values in 'assistant_ids' must be positive integers"
                );
            }
        }

        // Optional: evitar duplicados en assistants
        const uniqueAssistantIds = new Set(assistant_ids);
        if (uniqueAssistantIds.size !== assistant_ids.length) {
            throw new Error("Field 'assistant_ids' must not contain duplicate values");
        }

        // Optional: evitar que una misma persona tenga dos roles incompatibles
        if (patient_id === surgeon_id) {
            throw new Error("Patient and surgeon must be different users");
        }

        if (patient_id === anesthesiologist_id) {
            throw new Error("Patient and anesthesiologist must be different users");
        }

        if (surgeon_id === anesthesiologist_id) {
            throw new Error("Surgeon and anesthesiologist must be different users");
        }

        if (assistant_ids.includes(patient_id)) {
            throw new Error("Patient cannot also be an assistant in the same surgery");
        }

        if (assistant_ids.includes(surgeon_id)) {
            throw new Error("Surgeon cannot also be an assistant in the same surgery");
        }

        if (assistant_ids.includes(anesthesiologist_id)) {
            throw new Error("Anesthesiologist cannot also be an assistant in the same surgery");
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

    


    /// NEW 

    static async validateGetSurgeriesByDayAndUserId(req, res, next) {
        try {
            req.params.id = RequestValidator.validateInteger(
                req.params.id,
                "user id"
            );

            const exists = await SurgeryService.surgeryUserExists(req.params.id);

            if (!exists) {
                throw new Error("User not found");
            }

            const date = req.params.date?.trim();

            if (!date) {
                throw new Error("date is required");
            }

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(date)) {
                throw new Error("date must be in format YYYY-MM-DD");
            }

            const parsedDate = new Date(date);

            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date");
            }

            req.params.date = date;

            next();
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}