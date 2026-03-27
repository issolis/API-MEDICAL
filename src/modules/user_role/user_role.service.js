import { UserRole } from './user_role.model.js';
import { DBValidator } from '../../shared/db.validator.js';

export class UserRoleService {

    static async assignRole(data) {
        const { user_id, role_id } = data;

        await DBValidator.ensureUserExists(user_id);
        await DBValidator.ensureRoleExists(role_id);

        const existingRoles = await UserRole.getRolesByUser(user_id);
        const alreadyAssigned = existingRoles.some(r => r.id === role_id);

        if (alreadyAssigned) {
            throw new Error("Role already assigned to user");
        }

        return await UserRole.assignRole(user_id, role_id);
    }

    static async getRolesByUser(user_id) {

        await DBValidator.ensureUserExists(user_id);

        return await UserRole.getRolesByUser(user_id);
    }

    static async getAll(){
        return await UserRole.getAll(); 
    }
    
    static async removeRole(data) {
        const { user_id, role_id } = data;

        const deleted = await UserRole.removeRole(user_id, role_id);

        if (!deleted) {
            throw new Error("Role assignment not found");
        }

        return deleted;
    }
}