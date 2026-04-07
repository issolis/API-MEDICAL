import { SurgeryUsersService } from "./surgeryUsers.service.js";

export class SurgeryUsersController {
    static async getAll(req, res) {
        try {
            const assignments = await SurgeryUsersService.getAll();

            res.status(200).json({
                success: true,
                count: assignments.length,
                data: assignments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getBySurgeryId(req, res) {
        try {
            const data = await SurgeryUsersService.getBySurgeryId(req.params.surgery_id);

            res.status(200).json({
                success: true,
                count: data.length,
                data
            });
        } catch (error) {
            const status = error.message === "Surgery not found" ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getByUserId(req, res) {
        try {
            const data = await SurgeryUsersService.getByUserId(req.params.user_id);

            res.status(200).json({
                success: true,
                count: data.length,
                data
            });
        } catch (error) {
            const status = error.message === "User not found" ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            const created = await SurgeryUsersService.create(req.body);

            res.status(201).json({
                success: true,
                message: "User assigned to surgery successfully",
                data: created
            });
        } catch (error) {
            let status = 500;

            if (
                error.message === "Surgery not found" ||
                error.message === "User not found" ||
                error.message === "Surgery role not found"
            ) {
                status = 404;
            } else if (error.message === "User is already assigned to this surgery") {
                status = 409;
            }

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateRole(req, res) {
        try {
            const updated = await SurgeryUsersService.updateRole(
                req.params.surgery_id,
                req.params.user_id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: "Surgery user role updated successfully",
                data: updated
            });
        } catch (error) {
            let status = 500;

            if (
                error.message === "Surgery-user assignment not found" ||
                error.message === "Surgery role not found"
            ) {
                status = 404;
            }

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const deleted = await SurgeryUsersService.delete(
                req.params.surgery_id,
                req.params.user_id
            );

            res.status(200).json({
                success: true,
                message: "User removed from surgery successfully",
                data: deleted
            });
        } catch (error) {
            const status =
                error.message === "Surgery-user assignment not found" ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }
}