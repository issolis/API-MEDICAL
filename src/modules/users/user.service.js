import { UserModel } from "./user.model.js";
import bcrypt from "bcrypt";
import { DBValidator } from "../../shared/db.validator.js";
import { UserRole } from "../user_role/user_role.model.js";
import pool from "../../config/db.js";

export class UserService {

    static async getUserById(id) {
        const user = await UserModel.getUserById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    static async getAllUsers() {
        return await UserModel.getAllUsers();
    }

    static async createUser(data, client) {
        let { id, fName, lName, password, roles } = data;

        const existing = await UserModel.getUserById(id);
        if (existing) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        roles = await DBValidator.ensureRolesExist(roles);

        const user = await UserModel.createUser({
            id,
            fName,
            lName,
            password: hashedPassword
        }, client);

        await Promise.all(
            roles.map(role => UserRole.assignRole(id, role.id ?? role, client))
        );

        return user;
    }

    static async deleteUser(id) {
        const user = await UserModel.deleteUser(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
    static async getUsersByRoleId(roleId, client = pool) {
        const result = await client.query(
            `
        SELECT u.id, u.fname, u.lname
        FROM users u
        INNER JOIN user_role ur ON u.id = ur.user_id
        WHERE ur.role_id = $1
        ORDER BY u.id
        `,
            [roleId]
        );

        return result.rows;
    }
}