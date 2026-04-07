import pool from "../../config/db.js";

export class Role {

    static async getAllRoles(client = pool) {
        const result = await client.query(
            'SELECT id, description FROM role ORDER BY id'
        );

        return result.rows;
    }

    static async getRoleByDescription(description, client = pool) {
        const result = await client.query(
            'SELECT id, description FROM role WHERE description = $1',
            [description]
        );

        return result.rows[0];
    }
}