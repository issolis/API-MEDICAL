import { Router } from "express";
import { RoleController } from "./role.controller.js";
import { RoleValidator } from "./role.validator.js";

const router = Router();

router.get("/", RoleController.getAll);

router.get(
    "/:description",
    RoleValidator.validateDescription,
    RoleController.getByDescription
);

export default router;