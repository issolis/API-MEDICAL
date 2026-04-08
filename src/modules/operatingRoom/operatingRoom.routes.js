import { Router } from "express";
import { OperatingRoomController } from "./operatingRoom.controller.js";

const router = Router();

router.get("/", OperatingRoomController.getAll);
router.get("/:id", OperatingRoomController.getById);

export default router;