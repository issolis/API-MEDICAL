import { Router } from "express";
import { PatientController } from "./patient.controller.js";
import { PatientValidator } from "./patient.validator.js";
import { requireRole } from "../../shared/role.middleware.js";

const router = Router();

router.post(
    "/",
    requireRole([1, 2, 3]),
    PatientValidator.validateCreate,
    PatientController.create
);

export default router;