import { SurgeryState } from "./surgeryState.model.js";

export class SurgeryStateService {

    static async getAll() {
        return await SurgeryState.getAll();
    }

    static async getById(id) {
        const state = await SurgeryState.getById(id);
        if (!state) {
            throw new Error("Surgery state not found");
        }
        return state;
    }

    static async getByDescription(description) {
        const state = await SurgeryState.getByDescription(description);
        if (!state) {
            throw new Error("Surgery state not found");
        }
        return state;
    }

    static async create(description) {
        // Verificar que no exista un estado con la misma descripción
        const existing = await SurgeryState.getByDescription(description);
        if (existing) {
            throw new Error("Surgery state already exists");
        }
        return await SurgeryState.create(description);
    }

    static async update(id, description) {
        // Verificar que el estado exista
        const state = await SurgeryState.getById(id);
        if (!state) {
            throw new Error("Surgery state not found");
        }
        // Verificar que no haya otro estado con la misma descripción
        const existing = await SurgeryState.getByDescription(description);
        if (existing && existing.id !== id) {
            throw new Error("Another surgery state with that description already exists");
        }
        return await SurgeryState.update(id, description);
    }

    static async delete(id) {
        const state = await SurgeryState.getById(id);
        if (!state) {
            throw new Error("Surgery state not found");
        }
        return await SurgeryState.delete(id);
    }
    static async existsById(id, client) {
        return await SurgeryState.existsById(id, client);
    }
}