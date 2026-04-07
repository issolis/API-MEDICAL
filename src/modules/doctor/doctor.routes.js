import { Router } from "express";
import { DoctorController } from "./doctor.controller.js";
import { DoctorValidator } from "./doctor.validator.js";
import { requireSelfOrAdmin } from "../../shared/auth.middleware.js";

const router = Router();

router.get(
    "/",
    DoctorController.getAll
);

router.get(
    "/:id/stats",
    DoctorValidator.validateId,
    DoctorController.getDashboardStats
);

router.get(
    "/:userId/surgeries",
    requireSelfOrAdmin("userId"),
    DoctorValidator.validateUserId,
    DoctorController.getSurgeries
);

router.get(
    "/:userId/surgeries/:surgeryId",
    requireSelfOrAdmin("userId"),
    DoctorValidator.validateUserIdAndSurgeryId,
    DoctorController.getSurgeryById
);

export default router;