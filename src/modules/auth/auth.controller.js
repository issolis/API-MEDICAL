import { AuthService } from "./auth.service.js";

export class AuthController {

    static async login(req, res) {
        try {
            const { id, password } = req.body;

            const token = await AuthService.login(id, password);

            res.json({ token });

        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}