import { Router } from "express";
import { DoctorController } from "./doctor.controller.js";
import { DoctorValidator } from "./doctor.validator.js";
import {requireRole, requireSelfOrAdmin } from "../../shared/auth.middleware.js";

const router = Router();

router.get(
    "/",
    requireRole(1),
    DoctorController.getAllDoctors
);

router.get(
    "/:id/stats",
    requireSelfOrAdmin("id"), 
    DoctorValidator.validateDoctorId,
    DoctorController.getDoctorDashboardStats
);

export default router;