import { Router } from "express";
import { UserRoleController } from "./user_role.controller.js";
import { UserRoleValidator } from "./user_role.validator.js";

const router = Router();

router.get("/", UserRoleController.getAll); 

router.post(
    "/",
    UserRoleValidator.validateAssign,
    UserRoleController.assign
);

router.get(
    "/:user_id",
    UserRoleValidator.validateUserIdParam,
    UserRoleController.getByUser
);

router.delete(
    "/:user_id/:role_id",
    UserRoleValidator.validateRemoveParams,
    UserRoleController.remove
);

export default router;