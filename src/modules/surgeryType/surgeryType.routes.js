import { Router } from "express";
import { SurgeryTypeController } from "./surgery-type.controller.js";
import { SurgeryTypeValidator } from "./surgery-type.validator.js";
import { requireRole } from "../../shared/auth.middleware.js";

const router = Router();

router.get(
    "/",
    requireRole(1),
    SurgeryTypeController.getAll
);

router.get(
    "/:id",
    requireRole(1),
    SurgeryTypeValidator.validateId,
    SurgeryTypeController.getById
);

router.get(
    "/description/:description",
    requireRole(1),
    SurgeryTypeValidator.validateDescription,
    SurgeryTypeController.getByDescription
);

router.post(
    "/",
    requireRole(1),
    SurgeryTypeValidator.validateBody,
    SurgeryTypeController.create
);

router.put(
    "/:id",
    requireRole(1),
    SurgeryTypeValidator.validateId,
    SurgeryTypeValidator.validateBody,
    SurgeryTypeController.update
);

router.delete(
    "/:id",
    requireRole(1),
    SurgeryTypeValidator.validateId,
    SurgeryTypeController.delete
);

export default router;