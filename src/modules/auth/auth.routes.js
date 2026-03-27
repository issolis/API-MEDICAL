import express from "express";
import { AuthController } from "./auth.controller.js";
import { AuthValidator } from "./auth.validator.js";

const router = express.Router();

router.post(
    "/login",
    AuthValidator.validateLogin, 
    AuthController.login
);

export default router;