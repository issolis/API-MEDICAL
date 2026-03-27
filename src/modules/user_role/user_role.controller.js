import { UserRoleService } from "./user_role.service.js";

export class UserRoleController {

    static async assign(req, res) {
        try {
            const result = await UserRoleService.assignRole(req.body);

            res.status(201).json({
                success: true,
                message: "Role assigned successfully",
                data: result
            });

        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }

    static async getByUser(req, res) {
        try {
            const roles = await UserRoleService.getRolesByUser(req.params.user_id);

            res.status(200).json({
                success: true,
                count: roles.length,
                data: roles
            });

        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }

    static async getAll(req, res) {
            try {
                const users = await UserRoleService.getAll();
    
                res.status(200).json({
                    success: true,
                    count: users.length,
                    data: users
                });
    
            } catch (err) {
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
        }

    static async remove(req, res) {
    try {
        const { user_id, role_id } = req.params;

        const result = await UserRoleService.removeRole({
            user_id,
            role_id
        });

        res.status(200).json({
            success: true,
            message: "Role removed successfully",
            data: result
        });

    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}
}