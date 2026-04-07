import { AuthService } from "./auth.service.js";

export class AuthController {

    static async login(req, res) {
        try {
            const { id, password } = req.body;

            const loginResult = await AuthService.login(id, password);

            res.cookie("authToken", loginResult.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });

            res.json(loginResult);

        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static logout(req, res) {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.json({ message: "Logged out" });
    }

    static async me(req, res) {
        try {
            const payload = await AuthService.getMePayload(req.user.id);
            res.json(payload);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}