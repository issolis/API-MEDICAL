import { SurgeryType } from "./surgeryType.model.js";

export class SurgeryTypeService {

    static async getAll() {
        return await SurgeryType.getAll();
    }

    static async getById(id) {
        const type = await SurgeryType.getById(id);
        if (!type) {
            throw new Error("Surgery type not found");
        }
        return type;
    }

    static async getByDescription(description) {
        const type = await SurgeryType.getByDescription(description);
        if (!type) {
            throw new Error("Surgery type not found");
        }
        return type;
    }

    static async create(description) {
        const existing = await SurgeryType.getByDescription(description);
        if (existing) {
            throw new Error("Surgery type already exists");
        }
        return await SurgeryType.create(description);
    }

    static async update(id, description) {
        const type = await SurgeryType.getById(id);
        if (!type) {
            throw new Error("Surgery type not found");
        }
        const existing = await SurgeryType.getByDescription(description);
        if (existing && existing.id !== id) {
            throw new Error("Another surgery type with that description already exists");
        }
        return await SurgeryType.update(id, description);
    }

    static async delete(id) {
        const type = await SurgeryType.getById(id);
        if (!type) {
            throw new Error("Surgery type not found");
        }
        return await SurgeryType.delete(id);
    }
    static async existsById(id, client) {
        return await SurgeryType.existsById(id, client);
    }
}