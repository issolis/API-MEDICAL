import pool from "../../config/db.js";

export class SurgeryState {

    // ── Obtener todos los estados ──
    static async getAll(client = pool) {
        const result = await client.query(
            'SELECT id, description FROM surgery_state ORDER BY id'
        );
        return result.rows;
    }

    // ── Obtener un estado por ID ──
    static async getById(id, client = pool) {
        const result = await client.query(
            'SELECT id, description FROM surgery_state WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // ── Obtener un estado por descripción ──
    static async getByDescription(description, client = pool) {
        const result = await client.query(
            'SELECT id, description FROM surgery_state WHERE LOWER(description) = $1',
            [description.toLowerCase()]
        );
        return result.rows[0];
    }

    // ── Crear un nuevo estado ──
    static async create(description, client = pool) {
        const result = await client.query(
            'INSERT INTO surgery_state (description) VALUES ($1) RETURNING id, description',
            [description]
        );
        return result.rows[0];
    }

    // ── Actualizar un estado existente ──
    static async update(id, description, client = pool) {
        const result = await client.query(
            'UPDATE surgery_state SET description = $1 WHERE id = $2 RETURNING id, description',
            [description, id]
        );
        return result.rows[0];
    }

    // ── Eliminar un estado ──
    static async delete(id, client = pool) {
        const result = await client.query(
            'DELETE FROM surgery_state WHERE id = $1 RETURNING id, description',
            [id]
        );
        return result.rows[0];
    }

    static async existsById(id, client = pool) {
        const result = await client.query(`
                SELECT 1
                FROM surgery_state
                WHERE id = $1
                LIMIT 1
            `, [id]);

        return result.rowCount > 0;
    }
}