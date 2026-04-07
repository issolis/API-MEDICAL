import pool from "../../config/db.js";

export class SurgeryRole {
    static async getAll(client = pool) {
        const result = await client.query(`
            SELECT id, description
            FROM surgery_role
            ORDER BY id
        `);

        return result.rows;
    }

    static async getById(id, client = pool) {
        const result = await client.query(`
            SELECT id, description
            FROM surgery_role
            WHERE id = $1
        `, [id]);

        return result.rows[0];
    }

     static async getIdByDescription(description, client = pool) {
        const result = await client.query(`
            SELECT id
            FROM surgery_role
            WHERE description = $1
            LIMIT 1
        `, [description]);

        return result.rows[0]?.id ?? null;
    }
    
    static async getByDescription(description, client = pool) {
        const result = await client.query(`
            SELECT id, description
            FROM surgery_role
            WHERE description = $1
        `, [description]);

        return result.rows[0];
    }

    static async existsById(id, client = pool) {
        const result = await client.query(`
            SELECT EXISTS(
                SELECT 1
                FROM surgery_role
                WHERE id = $1
            ) AS exists
        `, [id]);

        return result.rows[0].exists;
    }

    static async existsByDescription(description, client = pool) {
        const result = await client.query(`
            SELECT EXISTS(
                SELECT 1
                FROM surgery_role
                WHERE description = $1
            ) AS exists
        `, [description]);

        return result.rows[0].exists;
    }

    static async create({ description }, client = pool) {
        const result = await client.query(`
            INSERT INTO surgery_role (description)
            VALUES ($1)
            RETURNING id, description
        `, [description]);

        return result.rows[0];
    }

    static async update(id, { description }, client = pool) {
        const result = await client.query(`
            UPDATE surgery_role
            SET description = $1
            WHERE id = $2
            RETURNING id, description
        `, [description, id]);

        return result.rows[0];
    }

    static async delete(id, client = pool) {
        const result = await client.query(`
            DELETE FROM surgery_role
            WHERE id = $1
            RETURNING id, description
        `, [id]);

        return result.rows[0];
    }
}