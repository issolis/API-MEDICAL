

import { Router } from "express";
import { SurgeryController } from "./surgery.controller.js";
import { SurgeryValidator } from "./surgery.validator.js";
import { requireRole, requireSelfOrAdmin } from "../../shared/auth.middleware.js";

const router = Router();

router.get(
    "/",
    requireRole(1),
    SurgeryController.getAll
);

router.get(
    "/:id",
    requireRole(1,2,3),
    SurgeryValidator.validateId,
    SurgeryController.getById
);

router.get(
    "/state/:stateId",
    requireRole(1,2,3),
    SurgeryValidator.validateStateId,
    SurgeryController.getByState
);

router.get(
    "/type/:typeId",
    requireRole(1,2,3),
    SurgeryValidator.validateTypeId,
    SurgeryController.getByType
);

router.get(
    "/user/:userId",
    requireSelfOrAdmin("userId"),
    SurgeryValidator.validateUserId,
    SurgeryController.getByUserId
);

router.post(
    "/",
    requireRole(1),
    SurgeryValidator.validateBody,
    SurgeryController.create
);

router.put(
    "/:id",
    requireRole(1,2,3),
    SurgeryValidator.validateId,
    SurgeryValidator.validateBody,
    SurgeryController.update
);

router.delete(
    "/:id",
    requireRole(1,2,3),
    SurgeryValidator.validateId,
    SurgeryController.delete
);

// NEW [edited by issolis]

router.get(
    "/user/:id/day/:date",
    requireSelfOrAdmin("id"), 
    SurgeryValidator.validateGetSurgeriesByDayAndUserId,
    SurgeryController.getSurgeriesByDayAndUserId
);

export default router;