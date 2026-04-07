import { Router } from "express";
import { SurgeryStateController } from "./surgery-state.controller.js";
import { SurgeryStateValidator } from "./surgery-state.validator.js";
import { requireRole } from "../../shared/auth.middleware.js";

const router = Router();

// GET /api/surgery-state         listar todos los estados
router.get(
    "/",
    requireRole(1),
    SurgeryStateController.getAll
);

// GET /api/surgery-state/:id     obtener por ID
router.get(
    "/:id",
    requireRole(1),
    SurgeryStateValidator.validateId,
    SurgeryStateController.getById
);

// GET /api/surgery-state/description/:description   obtener por descripción
router.get(
    "/description/:description",
    requireRole(1),
    SurgeryStateValidator.validateDescription,
    SurgeryStateController.getByDescription
);

// POST /api/surgery-state        crear nuevo estado
router.post(
    "/",
    requireRole(1),
    SurgeryStateValidator.validateBody,
    SurgeryStateController.create
);

// PUT /api/surgery-state/:id     actualizar estado
router.put(
    "/:id",
    requireRole(1),
    SurgeryStateValidator.validateId,
    SurgeryStateValidator.validateBody,
    SurgeryStateController.update
);

// DELETE /api/surgery-state/:id  eliminar estado
router.delete(
    "/:id",
    requireRole(1),
    SurgeryStateValidator.validateId,
    SurgeryStateController.delete
);

export default router;