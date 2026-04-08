import { SurgeryStateService } from "./surgeryState.service.js";

export class SurgeryStateController {

    static async getAll(req, res) {
        try {
            const states = await SurgeryStateService.getAll();
            res.status(200).json({
                success: true,
                count: states.length,
                data: states
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const state = await SurgeryStateService.getById(Number(req.params.id));
            res.status(200).json({
                success: true,
                data: state
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }

    static async getByDescription(req, res) {
        try {
            const state = await SurgeryStateService.getByDescription(req.params.description);
            res.status(200).json({
                success: true,
                data: state
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }

    static async create(req, res) {
        try {
            const state = await SurgeryStateService.create(req.body.description);
            res.status(201).json({
                success: true,
                data: state
            });
        } catch (err) {
            const status = err.message.includes("already exists") ? 409 : 500;
            res.status(status).json({
                success: false,
                message: err.message
            });
        }
    }

    static async update(req, res) {
        try {
            const state = await SurgeryStateService.update(
                Number(req.params.id),
                req.body.description
            );
            res.status(200).json({
                success: true,
                data: state
            });
        } catch (err) {
            const status = err.message.includes("not found") ? 404 : 409;
            res.status(status).json({
                success: false,
                message: err.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const state = await SurgeryStateService.delete(Number(req.params.id));
            res.status(200).json({
                success: true,
                message: "Surgery state deleted",
                data: state
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }
}