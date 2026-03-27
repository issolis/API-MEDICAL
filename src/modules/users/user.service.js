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
}