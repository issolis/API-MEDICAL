import pool from "../../config/db.js";

export class SurgeryUsers {
    static async getAll(client = pool) {
        const result = await client.query(`
            SELECT
                su.surgery_id,
                su.user_id,
                su.surgery_role_id,
                sr.description AS surgery_role_description
            FROM surgery_users su
            INNER JOIN surgery_role sr
                ON sr.id = su.surgery_role_id
            ORDER BY su.surgery_id, su.user_id
        `);

        return result.rows;
    }

    static async getBySurgeryId(surgery_id, client = pool) {
        const result = await client.query(`
            SELECT
                su.surgery_id,
                su.user_id,
                su.surgery_role_id,
                sr.description AS surgery_role_description
            FROM surgery_users su
            INNER JOIN surgery_role sr
                ON sr.id = su.surgery_role_id
            WHERE su.surgery_id = $1
            ORDER BY su.user_id
        `, [surgery_id]);

        return result.rows;
    }

    static async getByUserId(user_id, client = pool) {
        const result = await client.query(`
            SELECT
                su.surgery_id,
                su.user_id,
                su.surgery_role_id,
                sr.description AS surgery_role_description
            FROM surgery_users su
            INNER JOIN surgery_role sr
                ON sr.id = su.surgery_role_id
            WHERE su.user_id = $1
            ORDER BY su.surgery_id
        `, [user_id]);

        return result.rows;
    }

    static async getOne(surgery_id, user_id, client = pool) {
        const result = await client.query(`
            SELECT
                su.surgery_id,
                su.user_id,
                su.surgery_role_id
            FROM surgery_users su
            WHERE su.surgery_id = $1
              AND su.user_id = $2
        `, [surgery_id, user_id]);

        return result.rows[0];
    }

    static async exists(surgery_id, user_id, client = pool) {
        const result = await client.query(`
            SELECT EXISTS(
                SELECT 1
                FROM surgery_users
                WHERE surgery_id = $1
                  AND user_id = $2
            ) AS exists
        `, [surgery_id, user_id]);

        return result.rows[0].exists;
    }

    static async existsRoleInSurgery(surgery_id, surgery_role_id, client = pool) {
        const result = await client.query(`
            SELECT EXISTS(
                SELECT 1
                FROM surgery_users
                WHERE surgery_id = $1
                  AND surgery_role_id = $2
            ) AS exists
        `, [surgery_id, surgery_role_id]);

        return result.rows[0].exists;
    }

    static async create({ surgery_id, user_id, surgery_role_id }, client = pool) {

        const result = await client.query(`
            INSERT INTO surgery_users (surgery_id, user_id, surgery_role_id)
            VALUES ($1, $2, $3)
            RETURNING surgery_id, user_id, surgery_role_id
        `, [surgery_id, user_id, surgery_role_id]);

        return result.rows[0];
    }

    static async updateRole(
        surgery_id,
        user_id,
        { surgery_role_id },
        client = pool
    ) {
        const result = await client.query(`
            UPDATE surgery_users
            SET surgery_role_id = $1
            WHERE surgery_id = $2
              AND user_id = $3
            RETURNING surgery_id, user_id, surgery_role_id
        `, [surgery_role_id, surgery_id, user_id]);

        return result.rows[0];
    }

    static async delete(surgery_id, user_id, client = pool) {
        const result = await client.query(`
            DELETE FROM surgery_users
            WHERE surgery_id = $1
              AND user_id = $2
            RETURNING surgery_id, user_id, surgery_role_id
        `, [surgery_id, user_id]);

        return result.rows[0];
    }
}