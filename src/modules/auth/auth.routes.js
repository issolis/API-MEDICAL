import express from "express";
import { AuthController } from "./auth.controller.js";
import { AuthValidator } from "./auth.validator.js";
import { authenticate } from "../../shared/auth.middleware.js";

const router = express.Router();

router.post(
    "/login",
    AuthValidator.validateLogin, 
    AuthController.login
);

router.post(
    "/logout",
    AuthController.logout
);

router.get(
    "/me",
    authenticate,
    AuthController.me
);

export default router;