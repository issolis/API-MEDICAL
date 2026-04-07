import { DoctorService } from "./doctor.service.js";

export class DoctorController {
    static async getAllDoctors(req, res) {
        try {
            console.log("hello")
            const doctors = await DoctorService.getAllDoctors();

            return res.status(200).json({
                success: true,
                data: doctors
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }

    static async getDoctorDashboardStats(req, res) {
        try {
            const { id } = req.params;

            const stats = await DoctorService.getDoctorDashboardStats(id);

            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}