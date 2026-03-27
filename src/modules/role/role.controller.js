import { RoleService } from "./role.service.js";

export class RoleController {

    static async getAll(req, res) {
        try {
            const roles = await RoleService.getAllRoles();

            res.status(200).json({
                success: true,
                count: roles.length,
                data: roles
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async getByDescription(req, res) {
        try {
            const role = await RoleService.getRoleByDescription(req.params.description);

            res.status(200).json({
                success: true,
                data: role
            });

        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }
}