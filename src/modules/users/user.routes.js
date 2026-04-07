import { Router } from "express";
import { UserController } from "./user.controller.js";
import { UserValidator } from "./user.validator.js";

import { requireRole } from "../../shared/auth.middleware.js";
import { requireSelfOrAdmin } from "../../shared/auth.middleware.js";

const router = Router();


router.get(
    "/",
    requireRole(1),
    UserController.getAll
);


router.get(
    "/:id",
    UserValidator.validateIdParam,
    requireSelfOrAdmin("id"),
    UserController.getById
);


router.post(
    "/",
    requireRole(1),
    UserValidator.validateCreate,
    UserController.create
);


router.delete(
    "/:id",
    requireRole(1),
    UserValidator.validateIdParam,
    UserController.remove
);


router.get(
    "/by-role/:role",
    requireRole(1),
    UserController.getByRole
);

export default router;