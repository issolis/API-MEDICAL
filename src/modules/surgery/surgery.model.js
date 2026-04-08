import pool from "../../config/db.js";
import { SurgeryUsers } from "../surgeryUsers/surgeryUsers.model.js";
import { SurgeryRoleService } from "../surgeryRole/surgeryRole.service.js";


export class Surgery {

    // ── Obtener todas las cirugías con tipo y estado ──
    static async getAll(client = pool) {
        const result = await client.query(`
            SELECT
                s.id,
                s.surgery_date,
                s.type_id,
                st.description  AS type_description,
                s.state_id,
                ss.description  AS state_description
            FROM surgery s
            JOIN surgery_type  st ON s.type_id  = st.id
            JOIN surgery_state ss ON s.state_id = ss.id
            ORDER BY s.surgery_date DESC
        `);
        return result.rows;
    }

    // ── Obtener cirugías por estado ──
    static async getByState(stateId, client = pool) {
        const result = await client.query(`
            SELECT
                s.id,
                s.surgery_date,
                s.type_id,
                st.description  AS type_description,
                s.state_id,
                ss.description  AS state_description
            FROM surgery s
            JOIN surgery_type  st ON s.type_id  = st.id
            JOIN surgery_state ss ON s.state_id = ss.id
            WHERE s.state_id = $1
            ORDER BY s.surgery_date DESC
        `, [stateId]);
        return result.rows;
    }

    // ── Obtener cirugías por tipo ──
    static async getByType(typeId, client = pool) {
        const result = await client.query(`
            SELECT
                s.id,
                s.surgery_date,
                s.type_id,
                st.description  AS type_description,
                s.state_id,
                ss.description  AS state_description
            FROM surgery s
            JOIN surgery_type  st ON s.type_id  = st.id
            JOIN surgery_state ss ON s.state_id = ss.id
            WHERE s.type_id = $1
            ORDER BY s.surgery_date DESC
        `, [typeId]);
        return result.rows;
    }

    // ── Crear una cirugía ──
    static async create({ surgery_date, type_id, state_id, operating_room_id }, client = pool) {
        const result = await client.query(
            `
        INSERT INTO surgery (surgery_date, type_id, state_id, operating_room_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, surgery_date, type_id, state_id, operating_room_id
        `,
            [surgery_date, type_id, state_id, operating_room_id]
        );

        return result.rows[0];
    }
    // ── Actualizar una cirugía ──
    static async update(id, { surgery_date, type_id, state_id }, client = pool) {
        const result = await client.query(`
            UPDATE surgery
            SET surgery_date = $1, type_id = $2, state_id = $3
            WHERE id = $4
            RETURNING id, surgery_date, type_id, state_id
        `, [surgery_date, type_id, state_id, id]);
        return result.rows[0];
    }

    // ── Eliminar una cirugía ──
    static async delete(id, client = pool) {
        const result = await client.query(
            'DELETE FROM surgery WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }


    static async getByUserId(userId, { role = null, excludeRole = null } = {}, client = pool) {
        if (role && excludeRole) {
            throw new Error("role and excludeRole cannot be used together");
        }

        let query = `
        SELECT
            s.id,
            s.surgery_date,
            st.description AS type_description,
            ss.description AS state_description,
            sr.description AS user_role_in_surgery
        FROM surgery_users su
        JOIN surgery s
            ON su.surgery_id = s.id
        JOIN surgery_type st
            ON s.type_id = st.id
        JOIN surgery_state ss
            ON s.state_id = ss.id
        JOIN surgery_role sr
            ON su.surgery_role_id = sr.id
        WHERE su.user_id = $1
    `;

        const params = [userId];
        let index = 2;

        if (role) {
            query += ` AND LOWER(sr.description) = LOWER($${index})`;
            params.push(role);
            index++;
        }

        if (excludeRole) {
            query += ` AND LOWER(sr.description) <> LOWER($${index})`;
            params.push(excludeRole);
            index++;
        }


        query += ` ORDER BY s.surgery_date DESC`;

        const result = await client.query(query, params);
        return result.rows;
    }

    static async getById(id, { role = null, excludeRole = null } = {}, client = pool) {
        if (role && excludeRole) {
            throw new Error("role and excludeRole cannot be used together");
        }

        const surgeryResult = await client.query(`
        SELECT
            s.id,
            s.surgery_date,
            s.type_id,
            st.description AS type_description,
            s.state_id,
            ss.description AS state_description
        FROM surgery s
        JOIN surgery_type st
            ON s.type_id = st.id
        JOIN surgery_state ss
            ON s.state_id = ss.id
        WHERE s.id = $1
    `, [id]);

        if (surgeryResult.rows.length === 0) {
            return null;
        }

        let teamQuery = `
        SELECT
            su.user_id,
            u.fName,
            u.lName,
            su.surgery_role_id,
            sr.description AS role_description
        FROM surgery_users su
        JOIN users u
            ON su.user_id = u.id
        JOIN surgery_role sr
            ON su.surgery_role_id = sr.id
        WHERE su.surgery_id = $1
    `;

        const params = [id];
        let index = 2;

        if (role) {
            teamQuery += ` AND LOWER(sr.description) = LOWER($${index})`;
            params.push(role);
            index++;
        }

        if (excludeRole) {
            teamQuery += ` AND LOWER(sr.description) <> LOWER($${index})`;
            params.push(excludeRole);
            index++;
        }

        teamQuery += ` ORDER BY su.surgery_role_id`;

        const teamResult = await client.query(teamQuery, params);

        return {
            ...surgeryResult.rows[0],
            team: teamResult.rows
        };
    }


    ///[NEW] EDITEB BY issolis
    static async getRequiredSurgeryRoleIds(client = pool) {
        const roleDescriptions = [
            "patient",
            "surgeon",
            "anesthesiologist",
            "assistant"
        ];

        const roleIds = {};
        for (const description of roleDescriptions) {
            const roleId = await SurgeryRoleService.getIdByDescription(description, client);

            if (!roleId) {
                throw new Error(`Missing surgery role configuration: ${description}`);
            }

            roleIds[description] = roleId;
        }

        return roleIds;
    }

    static async assignRequiredUsersToSurgery(surgeryId, data, roleIds, client = pool) {

        await SurgeryUsers.create(
            {
                surgery_id: surgeryId,
                user_id: data.patient_id,
                surgery_role_id: roleIds.patient
            },
            client
        );

        await SurgeryUsers.create(
            {
                surgery_id: surgeryId,
                user_id: data.surgeon_id,
                surgery_role_id: roleIds.surgeon
            },
            client
        );

        await SurgeryUsers.create(
            {
                surgery_id: surgeryId,
                user_id: data.anesthesiologist_id,
                surgery_role_id: roleIds.anesthesiologist
            },
            client
        );

        for (const assistantId of data.assistant_ids) {
            await SurgeryUsers.create(
                {
                    surgery_id: surgeryId,
                    user_id: assistantId,
                    surgery_role_id: roleIds.assistant
                },
                client
            );
        }
    }

    static async createFullSurgery(data, client = pool) {
        const surgery = await this.create(
            {
                surgery_date: data.surgery_date,
                type_id: data.type_id,
                state_id: data.state_id,
                operating_room_id: data.operating_room_id
            },
            client
        );

        const roleIds = await this.getRequiredSurgeryRoleIds(client);

        await this.assignRequiredUsersToSurgery(
            surgery.id,
            data,
            roleIds,
            client
        );

        return surgery;
    }

    static async getSurgeriesByDayAndUserId(id, date, client = pool) {
        const result = await client.query(
            `
        SELECT
            s.id,
            s.surgery_date,
            s.operating_room_id,
            st.description AS type,
            ss.description AS state
        FROM surgery s
        INNER JOIN surgery_users su
            ON su.surgery_id = s.id
        INNER JOIN surgery_type st
            ON st.id = s.type_id
        INNER JOIN surgery_state ss
            ON ss.id = s.state_id
        WHERE su.user_id = $1
          AND s.surgery_date::date = $2
        ORDER BY s.surgery_date
        `,
            [id, date]
        );

        return result.rows;
    }

    static async existsByDateAndOperatingRoom(surgery_date, operating_room_id, client = pool) {
        const result = await client.query(
            `
        SELECT 1
        FROM surgery
        WHERE surgery_date = $1
          AND operating_room_id = $2
        LIMIT 1
        `,
            [surgery_date, operating_room_id]
        );

        return result.rowCount > 0;
    }

    static async usersHaveSurgeryAtDate(userIds, surgery_date, client = pool) {
        const result = await client.query(
            `
        SELECT DISTINCT su.user_id
        FROM surgery_users su
        INNER JOIN surgery s
            ON s.id = su.surgery_id
        WHERE su.user_id = ANY($1)
          AND s.surgery_date = $2
        `,
            [userIds, surgery_date]
        );

        return result.rows.map(row => row.user_id);
    }

    static hasDuplicateUserIds({ patient_id, surgeon_id, anesthesiologist_id, assistant_ids }) {
        const userIds = [
            patient_id,
            surgeon_id,
            anesthesiologist_id,
            ...assistant_ids
        ];

        const uniqueUserIds = new Set(userIds);

        return uniqueUserIds.size !== userIds.length;
    }

    static async isOperatingRoomOccupiedAtDate(surgery_date, operating_room_id, client = pool) {
        const result = await client.query(
            `
        SELECT 1
        FROM surgery
        WHERE surgery_date = $1
          AND operating_room_id = $2
        LIMIT 1
        `,
            [surgery_date, operating_room_id]
        );

        return result.rowCount > 0;
    }

    static async getUsersWithSurgeryAtDate(userIds, surgery_date, client = pool) {
        const result = await client.query(
            `
        SELECT DISTINCT su.user_id
        FROM surgery_users su
        INNER JOIN surgery s
            ON s.id = su.surgery_id
        WHERE su.user_id = ANY($1)
          AND s.surgery_date = $2
        `,
            [userIds, surgery_date]
        );

        return result.rows.map(row => row.user_id);
    }
}   