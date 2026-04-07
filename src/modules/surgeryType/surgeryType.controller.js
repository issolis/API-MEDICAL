import { SurgeryTypeService } from "./surgeryType.service.js";

export class SurgeryTypeController {

    static async getAll(req, res) {
        try {
            const types = await SurgeryTypeService.getAll();
            res.status(200).json({
                success: true,
                count: types.length,
                data: types
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
            const type = await SurgeryTypeService.getById(Number(req.params.id));
            res.status(200).json({
                success: true,
                data: type
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
            const type = await SurgeryTypeService.getByDescription(req.params.description);
            res.status(200).json({
                success: true,
                data: type
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
            const type = await SurgeryTypeService.create(req.body.description);
            res.status(201).json({
                success: true,
                data: type
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
            const type = await SurgeryTypeService.update(
                Number(req.params.id),
                req.body.description
            );
            res.status(200).json({
                success: true,
                data: type
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
            const type = await SurgeryTypeService.delete(Number(req.params.id));
            res.status(200).json({
                success: true,
                message: "Surgery type deleted",
                data: type
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }
}