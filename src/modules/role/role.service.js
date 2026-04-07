import { Role } from "./role.model.js";

export class RoleService {

    static async getAllRoles() {
        return await Role.getAllRoles();
    }

    static async getRoleByDescription(description) {
        const role = await Role.getRoleByDescription(description);

        if (!role) {
            throw new Error("Role not found");
        }

        return role;
    }
}