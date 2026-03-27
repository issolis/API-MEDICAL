import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../users/user.model.js";
import { UserRole } from "../user_role/user_role.model.js";


export class AuthService{

    static async login(id, password){
        const foundUser = await UserModel.getUserById(id); 

        if(!foundUser) throw new Error("User not found"); 

        const isValid = await bcrypt.compare(password, foundUser.password); 
        
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const roles = await UserRole.getRolesByUser(id);
        console.log(roles); 

        const token = jwt.sign(
            {
                id: foundUser.id,
                roles: roles.map(r => r.id)
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        return token;

    }
}