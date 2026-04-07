import { UserService } from "./user.service.js";
import { UserRole } from "../user_role/user_role.model.js";
import pool from "../../config/db.js";

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

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const user = await UserService.createUser(req.body, client);

            const { password, ...safeUser } = user;

            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: safeUser
            });
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            res.status(400).json({
                success: false,
                message: err.message
            });
        } finally {
            client.release();
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
    static async getByRole(req, res) {
        try {
            const roleId = parseInt(req.params.role, 10);

            if (Number.isNaN(roleId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid role id"
                });
            }

            const users = await UserService.getUsersByRoleId(roleId);

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
}