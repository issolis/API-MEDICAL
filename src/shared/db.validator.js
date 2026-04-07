import { UserModel } from "../modules/users/user.model.js";
import { Role } from "../modules/role/role.model.js";

export class DBValidator {

    static async ensureUserExists(user_id) {
        const user = await UserModel.getUserById(user_id);

        if (!user) {
            throw new Error(`User ${user_id} does not exist`);
        }

        return user;
    }

    static async ensureRoleExists(role_id) {
        const roles = await Role.getAllRoles();
        const role = roles.find(r => r.id === role_id);

        if (!role) {
            throw new Error(`Role ${role_id} does not exist`);
        }

        return role;
    }

    static async ensureRolesExist(roles) {
        return await Promise.all(
            roles.map(role => this.ensureRoleExists(role))
        );
    }

}