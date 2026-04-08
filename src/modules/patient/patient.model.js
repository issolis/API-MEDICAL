import pool from "../../config/db.js";
import { Surgery } from "../surgery/surgery.model.js";

export class Patient {
    static async isPatient(userId, client = pool) {
        const result = await client.query(`
            SELECT 1
            FROM user_role ur
            INNER JOIN role r
                ON r.id = ur.role_id
            WHERE ur.user_id = $1
              AND LOWER(r.description) = 'patient'
            LIMIT 1
        `, [userId]);
        return result.rowCount > 0;
    }

    static async getByUserId(userId, client = pool) {
        const isPatient = await this.isPatient(userId, client);

        console.log("hello")
        if (!isPatient) {
            throw new Error("User is not a patient");
        }

        return await Surgery.getByUserId(userId, { role: "patient" }, client);
    }

    static async getSurgeryById(userId, surgeryId, client = pool) {
        const isPatient = await this.isPatient(userId, client);

        if (!isPatient) {
            throw new Error("User is not a patient");
        }

        const surgery = await Surgery.getById(surgeryId, { role: "patient" }, client);

        if (!surgery) {
            throw new Error("Surgery not found");
        }

        const surgeries = await Surgery.getByUserId(userId, client);
        const belongsToPatient = surgeries.some(s => s.id === surgeryId);

        if (!belongsToPatient) {
            throw new Error("This surgery does not belong to the patient");
        }

        return surgery;
    }

    static async getAll(client = pool) {
        const result = await client.query(
            `
            SELECT 
                u.id,
                u.fname,
                u.lname
            FROM users u
            INNER JOIN user_role ur
                ON ur.user_id = u.id
            INNER JOIN role r
                ON r.id = ur.role_id
            WHERE r.description = 'patient'
            ORDER BY u.id
            `
        );

        return result.rows;
    }
}