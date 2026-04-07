import { DoctorService } from "./doctor.service.js";
import { RequestValidator } from "../../shared/request.validator.js";

export class DoctorValidator {
    static async validateDoctorId(req, res, next) {
        try {
            req.params.id = RequestValidator.validateInteger(
                req.params.id,
                "doctor id"
            );

            const exists = await DoctorService.doctorExists(req.params.id);

            if (!exists) {
                throw new Error("Doctor not found");
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