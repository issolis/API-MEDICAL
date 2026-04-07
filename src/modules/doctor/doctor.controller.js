import { DoctorService } from "./doctor.service.js";

export class DoctorController {
    static async getAll(req, res) {
        try {
            const doctors = await DoctorService.getAllDoctors();

            res.status(200).json({
                success: true,
                count: doctors.length,
                data: doctors
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getDashboardStats(req, res) {
        try {
            const { id } = req.params;

            const stats = await DoctorService.getDoctorDashboardStats(id);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getSurgeries(req, res) {
        try {
            const { userId } = req.params;

            const surgeries = await DoctorService.getByUserId(userId);

            res.status(200).json({
                success: true,
                count: surgeries.length,
                data: surgeries
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getSurgeryById(req, res) {
        try {
            const { userId, surgeryId } = req.params;

            const surgery = await DoctorService.getSurgeryById(
                userId,
                surgeryId
            );

            res.status(200).json({
                success: true,
                data: surgery
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}