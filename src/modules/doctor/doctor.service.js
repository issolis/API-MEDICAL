import pool from "../../config/db.js";

export class DoctorService {
    static clinicalRoles = ["surgeon", "anesthesiologist", "assistant"];

    static async getAllDoctors(client = pool) {
        const result = await client.query(
            `
            SELECT 
                u.id,
                u.fname,
                u.lname,
                ARRAY_AGG(DISTINCT r.description ORDER BY r.description) AS roles,
                COUNT(DISTINCT su.surgery_id) AS total_surgeries
            FROM users u
            INNER JOIN user_role ur
                ON ur.user_id = u.id
            INNER JOIN role r
                ON r.id = ur.role_id
            LEFT JOIN surgery_users su
                ON su.user_id = u.id
            WHERE r.description = ANY($1)
            GROUP BY u.id, u.fname, u.lname
            ORDER BY u.id
            `,
            [this.clinicalRoles]
        );

        return result.rows;
    }
    static async getClinicalRoleIds(client = pool) {
        const result = await client.query(
            `
            SELECT id
            FROM role
            WHERE description = ANY($1)
            `,
            [["surgeon", "anesthesiologist", "assistant"]]
        );

        return result.rows.map(row => row.id);
    }

    static async doctorExists(id, client = pool) {
        const clinicalRoleIds = await this.getClinicalRoleIds(client);

        const result = await client.query(
            `
            SELECT 1
            FROM users u
            INNER JOIN user_role ur
                ON ur.user_id = u.id
            WHERE u.id = $1
              AND ur.role_id = ANY($2)
            LIMIT 1
            `,
            [id, clinicalRoleIds]
        );

        return result.rowCount > 0;
    }
    
    static async getPatientRoleId(client = pool) {
        const result = await client.query(
            `
            SELECT id
            FROM role
            WHERE description = $1
            LIMIT 1
            `,
            ["patient"]
        );

        return result.rows[0]?.id ?? null;
    }

    static async getDoctorDashboardStats(id, client = pool) {
        const patientRoleId = await this.getPatientRoleId(client);

        const result = await client.query(
            `
            SELECT
                COUNT(DISTINCT CASE
                    WHEN s.surgery_date::date = CURRENT_DATE THEN s.id
                END) AS "todaySurgeries",

                COUNT(DISTINCT CASE
                    WHEN s.surgery_date::date > CURRENT_DATE THEN s.id
                END) AS "upcomingSurgeries",

                COUNT(DISTINCT CASE
                    WHEN patient_ur.user_id IS NOT NULL THEN patient_u.id
                END) AS "assignedPatients"

            FROM surgery_users su_doc
            INNER JOIN surgery s
                ON s.id = su_doc.surgery_id

            LEFT JOIN surgery_users su_patient
                ON su_patient.surgery_id = s.id
               AND su_patient.user_id <> su_doc.user_id

            LEFT JOIN users patient_u
                ON patient_u.id = su_patient.user_id

            LEFT JOIN user_role patient_ur
                ON patient_ur.user_id = patient_u.id
               AND patient_ur.role_id =$1

            WHERE su_doc.user_id = $2
            `,
            [patientRoleId, id]
        );

        return result.rows[0];
    }

}