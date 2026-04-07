import { SurgeryService } from "./surgery.service.js";
import pool from "../../config/db.js";

export class SurgeryController {

    static async getAll(req, res) {
        try {
            const surgeries = await SurgeryService.getAll();
            res.status(200).json({
                success: true,
                count: surgeries.length,
                data: surgeries
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const surgery = await SurgeryService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: surgery });
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    }

    static async getByState(req, res) {
        try {
            const surgeries = await SurgeryService.getByState(Number(req.params.stateId));
            res.status(200).json({
                success: true,
                count: surgeries.length,
                data: surgeries
            });
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    }

    static async getByType(req, res) {
        try {
            const surgeries = await SurgeryService.getByType(Number(req.params.typeId));
            res.status(200).json({
                success: true,
                count: surgeries.length,
                data: surgeries
            });
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    }

    static async getByUserId(req, res) {
        try {
            const surgeries = await SurgeryService.getByUserId(Number(req.params.userId));
            res.status(200).json({
                success: true,
                count: surgeries.length,
                data: surgeries
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async create(req, res) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const createdSurgery = await SurgeryService.createFull(req.body, client);

            await client.query("COMMIT");

            return res.status(201).json({
                success: true,
                message: "Surgery created successfully",
                data: createdSurgery
            });
        } catch (error) {
            await client.query("ROLLBACK");

            let status = 500;

            if (
                error.message === "Surgery type not found" ||
                error.message === "Surgery state not found" ||
                error.message === "Patient user not found" ||
                error.message === "Surgeon user not found" ||
                error.message === "Anesthesiologist user not found" ||
                error.message.startsWith("Assistant user not found")
            ) {
                status = 404;
            } else if (
                error.message === "Selected patient does not have patient role" ||
                error.message === "Selected user does not have surgeon role" ||
                error.message === "Selected user does not have anesthesiologist role" ||
                error.message.startsWith("Selected user does not have assistant role") ||
                error.message.startsWith("Missing surgery role configuration")
            ) {
                status = 400;
            }

            return res.status(status).json({
                success: false,
                message: error.message
            });
        } finally {
            client.release();
        }
    }

    static async update(req, res) {
        try {
            const surgery = await SurgeryService.update(
                Number(req.params.id),
                req.body
            );
            res.status(200).json({ success: true, data: surgery });
        } catch (err) {
            const status = err.message.includes("not found") ? 404 : 500;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await SurgeryService.delete(Number(req.params.id));
            res.status(200).json({
                success: true,
                message: "Surgery deleted"
            });
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    }


    //// NEW

    static async getSurgeriesByDayAndUserId(req, res) {
        try {
            const { id, date } = req.params;

            console.log(id, date);

            const surgeries = await SurgeryService.getSurgeriesByDayAndUserId(
                Number(id),
                date
            );

            return res.status(200).json({
                success: true,
                data: surgeries
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}