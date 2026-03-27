import pool from "../../config/db.js";

export class UserRole{

    static async assignRole(user_id, role_id, client = pool) {
        const result = await client.query(
            `INSERT INTO user_role (user_id, role_id)
             VALUES ($1, $2)
             RETURNING *`,
            [user_id, role_id]
        );

        return result.rows[0];
    }

    static async getRolesByUser(user_id, client = pool) {
        const result = await client.query(
            `SELECT r.id, r.description
             FROM user_role ur
             JOIN role r ON ur.role_id = r.id
             WHERE ur.user_id = $1 `,
            [user_id]
        );

        return result.rows;
    }

    static async getAll(client = pool){
        const result = await client.query(
            'SELECT * FROM user_role'
        );


        return result.rows 
    }

    static async removeRole(user_id, role_id, client = pool) {
        const result = await client.query(
            `DELETE FROM user_role
             WHERE user_id = $1 AND role_id = $2
             RETURNING *`,
            [user_id, role_id]
        );

        return result.rows[0];
    }
}