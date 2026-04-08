import { Router } from "express";
import { PatientController } from "./patient.controller.js";
import { PatientValidator } from "./patient.validator.js";
import { requireRole, requireSelfOrAdmin } from "../../shared/auth.middleware.js";

const router = Router();

router.get("/", PatientController.getAll);

router.post(
    "/",
    requireRole(1, 2, 3),
    PatientValidator.validateCreate,
    PatientController.create
);

router.get(
    "/:userId/surgeries",
    requireSelfOrAdmin("userId"), 
    PatientValidator.validateUserId,
    PatientController.getSurgeries
);

router.get(
    "/:userId/surgeries/:surgeryId",
    requireSelfOrAdmin("userId"), 
    PatientValidator.validateUserIdAndSurgeryId,
    PatientController.getSurgeryById
);


export default router;