import { Router } from "express";
import { RoleController } from "./role.controller.js";
import { RoleValidator } from "./role.validator.js";
import { requireRole } from "../../shared/auth.middleware.js";

const router = Router();

router.get(
    "/",
    requireRole(1),
    RoleController.getAll
);

router.get(
    "/:description",
    requireRole(1),
    RoleValidator.validateDescription,
    RoleController.getByDescription
);

export default router;