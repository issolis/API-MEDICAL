import pool from "../../config/db.js";
import Doctor from "./doctor.model.js";

export class DoctorService {
    static async getAllDoctors(client = pool) {
        return await Doctor.getAllDoctors(client);
    }

    static async getClinicalRoleIds(client = pool) {
        return await Doctor.getClinicalRoleIds(client);
    }

    static async doctorExists(id, client = pool) {
        return await Doctor.doctorExists(id, client);
    }

    static async getPatientRoleId(client = pool) {
        return await Doctor.getPatientRoleId(client);
    }

    static async getDoctorDashboardStats(id, client = pool) {
        const exists = await Doctor.doctorExists(id, client);

        if (!exists) {
            throw new Error("Doctor not found");
        }

        return await Doctor.getDoctorDashboardStats(id, client);
    }

    static async getByUserId(userId, client = pool) {
        const isDoctor = await Doctor.doctorExists(userId, client);

        if (!isDoctor) {
            throw new Error("User is not a doctor");
        }

        return await Doctor.getByUserId(userId, client);
    }

    static async getSurgeryById(userId, surgeryId, client = pool) {
        const isDoctor = await Doctor.doctorExists(userId, client);

        if (!isDoctor) {
            throw new Error("User is not a doctor");
        }

        const surgery = await Doctor.getSurgeryById(userId, surgeryId, client);

        if (!surgery) {
            throw new Error("This surgery does not belong to the doctor");
        }

        return surgery;
    }
}