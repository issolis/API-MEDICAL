import pool from "../../config/db.js";

export class UserModel {

    static async getUserById(id, client = pool) {
        const result = await client.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );

        return result.rows[0];
    }

    static async getAllUsers(client = pool) {
        const result = await client.query(
            'SELECT id, fName, lName FROM users'
        );

        return result.rows;
    }

    static async createUser({ id, fName, lName, password }, client = pool) {
        const result = await client.query(
            `INSERT INTO users (id, fName, lName, password)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id, fName, lName, password]
        );

        return result.rows[0];
    }

    static async deleteUser(id, client = pool) {
        const result = await client.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [id]
        );

        return result.rows[0];
    }
    
    static async getUsersByRoleId(roleId, client = pool) {
        const result = await client.query(
            `
        SELECT u.id, u.fname, u.lname
        FROM users u
        INNER JOIN user_role ur ON u.id = ur.user_id
        WHERE ur.role_id = $1
        ORDER BY u.id
        `,
            [roleId]
        );

        return result.rows;
    }
}