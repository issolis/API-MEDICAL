import bcrypt from "bcrypt";
import { UserModel as user } from "../users/user.model.js";
import { UserRole as user_role } from "../user_role/user_role.model.js";
import { Patient } from "./patient.model.js";
import pool from "../../config/db.js";
export class PatientService {

    static async create(data, client) {
        const hashedPassword = await bcrypt.hash(
            data.password || "temp123",
            10
        );

        const newUser = await user.create({
            fName: data.fName,
            lName: data.lName,
            password: hashedPassword
        }, client);

        await user_role.assign({
            user_id: newUser.id,
            role_id: 5
        }, client);

        return newUser;
    }

    static async getSurgeriesByPatientId(userId, client = pool) {
        return await Patient.getByUserId(userId,  client);
    }

    static async getPatientSurgeryById(userId, surgeryId) {
        return await Patient.getSurgeryById(userId, surgeryId);
    }

}