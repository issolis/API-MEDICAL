import { Surgery } from "./surgery.model.js";
import { SurgeryType } from "../surgeryType/surgeryType.model.js";
import { SurgeryState } from "../surgeryState/surgeryState.model.js";
import { SurgeryTypeService } from "../surgeryType/surgeryType.service.js";
import { SurgeryStateService } from "../surgeryState/surgeryState.service.js";
import { UserService } from "../users/user.service.js";

import pool from "../../config/db.js";

export class SurgeryService {

    static async getAll() {
        return await Surgery.getAll();
    }

    static async getById(id) {
        const surgery = await Surgery.getById(id);
        if (!surgery) {
            throw new Error("Surgery not found");
        }
        return surgery;
    }

    static async getByState(stateId) {
        // Verificar que el estado exista
        const state = await SurgeryState.getById(stateId);
        if (!state) {
            throw new Error("Surgery state not found");
        }
        return await Surgery.getByState(stateId);
    }

    static async getByType(typeId) {
        const type = await SurgeryType.getById(typeId);
        if (!type) {
            throw new Error("Surgery type not found");
        }
        return await Surgery.getByType(typeId);
    }

    static async getByUserId(userId) {
        const surgeries = await Surgery.getByUserId(userId);

        if (!surgeries || surgeries.length === 0) {
            throw new Error("No surgeries found for this user");
        }

        return surgeries;
    }

    static async createFull(data, client) {
        const {
            type_id,
            state_id,
            patient_id,
            surgeon_id,
            anesthesiologist_id,
            assistant_ids
        } = data;

        const typeExists = await SurgeryTypeService.existsById(type_id, client);
        if (!typeExists) {
            throw new Error("Surgery type not found");
        }


        const stateExists = await SurgeryStateService.existsById(state_id, client);
        if (!stateExists) {
            throw new Error("Surgery state not found");
        }
        const patientExists = await UserService.existsById(patient_id, client);
        if (!patientExists) {
            throw new Error("Patient user not found");
        }

        const surgeonExists = await UserService.existsById(surgeon_id, client);
        if (!surgeonExists) {
            throw new Error("Surgeon user not found");
        }

        const anesthesiologistExists = await UserService.existsById(
            anesthesiologist_id,
            client
        );
        if (!anesthesiologistExists) {
            throw new Error("Anesthesiologist user not found");
        }
        for (const assistantId of assistant_ids) {
            const assistantExists = await UserService.existsById(assistantId, client);

            if (!assistantExists) {
                throw new Error(`Assistant user not found: ${assistantId}`);
            }
        }

        const patientHasPatientRole = await UserService.hasRole(
            patient_id,
            "patient",
            client
        );
        if (!patientHasPatientRole) {
            throw new Error("Selected patient does not have patient role");
        }

        const surgeonHasRole = await UserService.hasRole(
            surgeon_id,
            "surgeon",
            client
        );
        if (!surgeonHasRole) {
            throw new Error("Selected user does not have surgeon role");
        }

        const anesthesiologistHasRole = await UserService.hasRole(
            anesthesiologist_id,
            "anesthesiologist",
            client
        );
        if (!anesthesiologistHasRole) {
            throw new Error("Selected user does not have anesthesiologist role");
        }

        for (const assistantId of assistant_ids) {
            const assistantHasRole = await UserService.hasRole(
                assistantId,
                "assistant",
                client
            );

            if (!assistantHasRole) {
                throw new Error(
                    `Selected user does not have assistant role: ${assistantId}`
                );
            }
        }
        console.log("hh");
        return await Surgery.createFullSurgery(data, client);
    }

    static async update(id, { surgery_date, type_id, state_id }) {
        const surgery = await Surgery.getById(id);
        if (!surgery) throw new Error("Surgery not found");

        const type = await SurgeryType.getById(type_id);
        if (!type) throw new Error("Surgery type not found");

        const state = await SurgeryState.getById(state_id);
        if (!state) throw new Error("Surgery state not found");

        return await Surgery.update(id, { surgery_date, type_id, state_id });
    }

    static async delete(id) {
        const surgery = await Surgery.getById(id);
        if (!surgery) throw new Error("Surgery not found");
        return await Surgery.delete(id);
    }

    static async getSurgeriesByDayAndUserId(id, date, client = pool) {
        return await Surgery.getSurgeriesByDayAndUserId(id, date, client);
    }



}