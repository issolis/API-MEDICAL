import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../users/user.model.js";
import { UserRole } from "../user_role/user_role.model.js";


export class AuthService{

    static normalizeRole(description = "") {
        const value = String(description).trim().toLowerCase();

        if (value.includes("admin")) return "admin";
        if (value.includes("surgeon") || value.includes("doctor") || value.includes("medic") || value.includes("médic")) {
            return "doctor";
        }
        if (value.includes("patient") || value.includes("pacient")) return "patient";

        return null;
    }

    static buildRoleInfo(roles = []) {
        const rolesDetail = roles.map((role) => ({
            id: Number(role.id),
            description: role.description,
            normalized: this.normalizeRole(role.description)
        }));

        const normalizedRoles = rolesDetail
            .map((role) => role.normalized)
            .filter(Boolean);

        const fallbackRoles = rolesDetail
            .map((role) => String(role.description).trim())
            .filter(Boolean);

        const roleNames = [...new Set(normalizedRoles.length ? normalizedRoles : fallbackRoles)];
        const roleIds = rolesDetail.map((role) => role.id);

        return {
            role: roleNames[0] || null,
            roleId: roleIds[0] || null,
            roles: roleNames,
            roleIds,
            rolesDetail
        };
    }

    static sanitizeUser(user = {}) {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    static async getMePayload(userId) {
        const foundUser = await UserModel.getUserById(userId);

        if (!foundUser) {
            throw new Error("User not found");
        }

        const roles = await UserRole.getRolesByUser(userId);

        if (!roles.length) {
            throw new Error("User has no assigned roles");
        }

        return {
            user: this.sanitizeUser(foundUser),
            ...this.buildRoleInfo(roles)
        };
    }

    static async login(id, password){
        const foundUser = await UserModel.getUserById(id); 

        if(!foundUser) throw new Error("User not found"); 

        const isValid = await bcrypt.compare(password, foundUser.password); 
        
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const roles = await UserRole.getRolesByUser(id);

        if (!roles.length) {
            throw new Error("User has no assigned roles");
        }

        const roleInfo = this.buildRoleInfo(roles);

        const token = jwt.sign(
            {
                id: foundUser.id,
                roles: roles.map(r => r.id),
                role: roleInfo.role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        return {
            token,
            user: this.sanitizeUser(foundUser),
            ...roleInfo
        };

    }
}