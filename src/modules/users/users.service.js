import { UserModel } from "./users.model.js";

export class UserService {
    static async getUserById(id) {
        if (!Number.isInteger(Number(id))) {
            throw new Error("Invalid ID");
        }

        const user = await UserModel.getUserById(id);

        if (!user)
            throw new Error("User not found");

        return user;
    };

    static async getAllUsers() {
        return await UserModel.getAllUsers();
    }

    static async createUser(data) {
        const { id, fName, lName, password } = data; 

        if (!id || !fName || !lName || !password)
            throw new Error("Missing requiered fields");

        if (!Number.isInteger(Number(id)))
            throw new Error("Invalid ID");

        fName = fName.trim();
        lName = lName.trim();

        if (!fName || !lName)
            throw new Error("Names cannot be empty");

        if (password.length < 6)
            throw new Error("Password must be at least 6 characters");

        const existing = await UserModel.getUserById(id);
        if (existing)
            throw new Error("User already exists")

        const hashedPassword = await bcrypt.hash(password, 10);

        return await UserModel.createUser({
            id,
            fName,
            lName,
            password: hashedPassword
        });
    }

    static async deleteUser(id) {
        if(!Number.isInteger(Number(id)))
            throw new Error("Invalid Id"); 

        const user = await UserModel.deleteUser(id);

        if (!user)
            throw new Error("User not found");

        return user;
    }
}