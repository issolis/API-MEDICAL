import { UserService } from "./users.service.js";

export class UserController {

    static async getById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            const { password, ...safeUser } = user;

            res.status(200).json({
                success: true,
                data: safeUser
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
            const users = await UserService.getAllUsers();

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

    static async create(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            const { password, ...safeUser } = user;

            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: safeUser
            });

        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }

    static async remove(req, res) {
        try {
            const user = await UserService.deleteUser(req.params.id);
            const { password, ...safeUser } = user;

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: safeUser
            });

        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }
}