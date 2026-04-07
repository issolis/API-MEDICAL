import { Router } from "express";
import { SurgeryUsersController } from "./surgeryUsers.controller.js";
import { SurgeryUsersValidator } from "./surgeryUsers.validator.js";

const router = Router();

router.get("/", SurgeryUsersController.getAll);

router.get(
    "/surgery/:surgery_id",
    requireRole(1),
    SurgeryUsersValidator.validateSurgeryId,
    SurgeryUsersController.getBySurgeryId
);

router.get(
    "/user/:user_id",
    requireRole(1),
    SurgeryUsersValidator.validateUserId,
    SurgeryUsersController.getByUserId
);

router.post(
    "/",
    requireRole(1),
    SurgeryUsersValidator.validateCreate,
    SurgeryUsersController.create
);

router.put(
    "/:surgery_id/:user_id/role",
    requireRole(1),
    SurgeryUsersValidator.validateIds,
    SurgeryUsersValidator.validateUpdateRole,
    SurgeryUsersController.updateRole
);

router.delete(
    "/:surgery_id/:user_id",
    requireRole(1),
    SurgeryUsersValidator.validateIds,
    SurgeryUsersController.delete
);

export default router;