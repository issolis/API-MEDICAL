import pool from "../../config/db.js";
import { PatientService } from "./patient.service.js";

export class PatientController {

    static async create(req, res) {

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const patient = await PatientService.create(
                req.body,
                req.user,
                client
            );

            await client.query("COMMIT");

            res.status(201).json(patient);

        } catch (error) {

            await client.query("ROLLBACK");

            res.status(400).json({ error: error.message });

        } finally {
            client.release();
        }
    }

    static async getSurgeries(req, res, next) {
        try {
            const userId = req.params.userId;

            const surgeries = await PatientService.getSurgeriesByPatientId(userId);

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

    static async getSurgeryById(req, res, next) {
        try {
            const userId = req.params.userId;
            const surgeryId = req.params.surgeryId;

            const surgery = await PatientService.getPatientSurgeryById(userId, surgeryId);

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

    static async getAll(req, res) {
        try {
            const patients = await PatientService.getAll();

            res.json({
                success: true,
                count: patients.length,
                data: patients
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}