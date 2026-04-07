import { Router } from "express";
import { SurgeryRoleController } from "./surgeryRole.controller.js";
import { SurgeryRoleValidator } from "./surgeryRole.validator.js";
import { requireRole } from "../../shared/auth.middleware.js";

const router = Router();

router.get("/", requireRole(1), SurgeryRoleController.getAll);
router.get("/:id", requireRole(1), SurgeryRoleValidator.validateId, SurgeryRoleController.getById);
router.post("/", requireRole(1), SurgeryRoleValidator.validateCreate, SurgeryRoleController.create);
router.put(
    "/:id",
    requireRole(1),
    SurgeryRoleValidator.validateId,
    SurgeryRoleValidator.validateUpdate,
    SurgeryRoleController.update
);
router.delete(
    "/:id",
    requireRole(1),
    SurgeryRoleValidator.validateId,
    SurgeryRoleController.delete
);

export default router;