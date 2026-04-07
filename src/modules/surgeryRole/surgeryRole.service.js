import { SurgeryRole } from "./surgeryRole.model.js";

export class SurgeryRoleService {
    static async getAll() {
        return await SurgeryRole.getAll();
    }

    static async getById(id) {
        const found = await SurgeryRole.getById(id);

        if (!found) {
            throw new Error("Surgery role not found");
        }

        return found;
    }

    static async create({ description }) {
        const exists = await SurgeryRole.existsByDescription(description);

        if (exists) {
            throw new Error("Surgery role already exists");
        }

        return await SurgeryRole.create({ description });
    }

    static async update(id, { description }) {
        const found = await SurgeryRole.getById(id);

        if (!found) {
            throw new Error("Surgery role not found");
        }

        const existingWithSameDescription =
            await SurgeryRole.getByDescription(description);

        if (
            existingWithSameDescription &&
            existingWithSameDescription.id !== id
        ) {
            throw new Error("Another surgery role already uses that description");
        }

        return await SurgeryRole.update(id, { description });
    }

    static async delete(id) {
        const found = await SurgeryRole.getById(id);

        if (!found) {
            throw new Error("Surgery role not found");
        }

        return await SurgeryRole.delete(id);
    }

    static async existsById(id) {
        return await SurgeryRole.existsById(id);
    }

    static async existsByDescription(description) {
        return await SurgeryRole.existsByDescription(description);
    }

    static async getIdByDescription(description, client) {
        const roleId = await SurgeryRole.getIdByDescription(description, client);

        if (!roleId) {
            throw new Error(`Missing surgery role configuration: ${description}`);
        }

        return roleId;
    }
}