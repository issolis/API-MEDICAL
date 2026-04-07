import { Router } from "express";
import { UserRoleController } from "./user_role.controller.js";
import { UserRoleValidator } from "./user_role.validator.js";
import { requireRole } from "../../shared/auth.middleware.js";

const router = Router();


router.get(
    "/",
    requireRole(1),
    UserRoleController.getAll
);

router.post(
    "/",
    requireRole(1),
    UserRoleValidator.validateAssign,
    UserRoleController.assign
);

router.get(
    "/:user_id",
    requireRole(1),
    UserRoleValidator.validateUserIdParam,
    UserRoleController.getByUser
);

router.delete(
    "/:user_id/:role_id",
    requireRole(1),
    UserRoleValidator.validateRemoveParams,
    UserRoleController.remove
);

export default router;