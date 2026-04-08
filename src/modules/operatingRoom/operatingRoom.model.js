import pool from "../../config/db.js";

export class OperatingRoom {

    static async getAll(client = pool) {
        const result = await client.query(
            `
            SELECT id
            FROM operating_room
            ORDER BY id
            `
        );

        return result.rows;
    }

    static async getById(id, client = pool) {
        const result = await client.query(
            `
            SELECT id
            FROM operating_room
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0];
    }
}