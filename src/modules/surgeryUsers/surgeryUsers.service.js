import { SurgeryUsers } from "./surgeryUsers.model.js";
import { Surgery } from "../surgery/surgery.model.js";
import { User } from "../user/user.model.js";
import { SurgeryRole } from "../surgeryRole/surgeryRole.model.js";
import pool from "../../config/db.js";

export class SurgeryUsersService {
    static async getAll() {
        return await SurgeryUsers.getAll();
    }

    static async getBySurgeryId(surgery_id) {
        const surgeryExists = await Surgery.existsById(surgery_id);

        if (!surgeryExists) {
            throw new Error("Surgery not found");
        }

        return await SurgeryUsers.getBySurgeryId(surgery_id);
    }

    static async getByUserId(user_id) {
        const userExists = await User.existsById(user_id);

        if (!userExists) {
            throw new Error("User not found");
        }

        return await SurgeryUsers.getByUserId(user_id);
    }

    static async create({ surgery_id, user_id, surgery_role_id }, client = pool) {
        const surgeryExists = await Surgery.existsById(surgery_id);
        if (!surgeryExists) {
            throw new Error("Surgery not found");
        }

        const userExists = await User.existsById(user_id);
        if (!userExists) {
            throw new Error("User not found");
        }

        const roleExists = await SurgeryRole.existsById(surgery_role_id);
        if (!roleExists) {
            throw new Error("Surgery role not found");
        }

        const relationExists = await SurgeryUsers.exists(surgery_id, user_id);
        if (relationExists) {
            throw new Error("User is already assigned to this surgery");
        }

        return await SurgeryUsers.create({ surgery_id, user_id, surgery_role_id });
    }

    static async updateRole(surgery_id, user_id, { surgery_role_id }) {
        const relation = await SurgeryUsers.getOne(surgery_id, user_id);

        if (!relation) {
            throw new Error("Surgery-user assignment not found");
        }

        const roleExists = await SurgeryRole.existsById(surgery_role_id);
        if (!roleExists) {
            throw new Error("Surgery role not found");
        }

        return await SurgeryUsers.updateRole(
            surgery_id,
            user_id,
            { surgery_role_id }
        );
    }

    static async delete(surgery_id, user_id) {
        const relation = await SurgeryUsers.getOne(surgery_id, user_id);

        if (!relation) {
            throw new Error("Surgery-user assignment not found");
        }

        return await SurgeryUsers.delete(surgery_id, user_id);
    }

    static async exists(surgery_id, user_id) {
        return await SurgeryUsers.exists(surgery_id, user_id);
    }

    static async existsRoleInSurgery(surgery_id, surgery_role_id) {
        return await SurgeryUsers.existsRoleInSurgery(surgery_id, surgery_role_id);
    }
}