import pool from "../../config/db.js";
import { PatientService } from "./patient.service.js";

export class PatientController {

    static async create(req, res) {

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const patient = await PatientService.create(
                req.body,
                req.user,
                client
            );

            await client.query("COMMIT");

            res.status(201).json(patient);

        } catch (error) {

            await client.query("ROLLBACK");

            res.status(400).json({ error: error.message });

        } finally {
            client.release();
        }
    }
}