import pool from "../../config/db.js";

export class SurgeryType {

    static async getAll(client = pool) {
        const result = await client.query(
            'SELECT id, description FROM surgery_type ORDER BY id'
        );
        return result.rows;
    }

    static async getById(id, client = pool) {
        const result = await client.query(
            'SELECT id, description FROM surgery_type WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async getByDescription(description, client = pool) {
        const result = await client.query(
            'SELECT id, description FROM surgery_type WHERE LOWER(description) = $1',
            [description.toLowerCase()]
        );
        return result.rows[0];
    }

    static async create(description, client = pool) {
        const result = await client.query(
            'INSERT INTO surgery_type (description) VALUES ($1) RETURNING id, description',
            [description]
        );
        return result.rows[0];
    }

    static async update(id, description, client = pool) {
        const result = await client.query(
            'UPDATE surgery_type SET description = $1 WHERE id = $2 RETURNING id, description',
            [description, id]
        );
        return result.rows[0];
    }

    static async delete(id, client = pool) {
        const result = await client.query(
            'DELETE FROM surgery_type WHERE id = $1 RETURNING id, description',
            [id]
        );
        return result.rows[0];
    }

    static async existsById(id, client = pool) {
        const result = await client.query(`
            SELECT 1
            FROM surgery_type
            WHERE id = $1
            LIMIT 1
        `, [id]);

        return result.rowCount > 0;
    }
}