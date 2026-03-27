import { Router } from "express";
import { UserController } from "./user.controller.js";
import { UserValidator } from "./user.validator.js";

const router = Router();


router.get("/", UserController.getAll);

router.get(
    "/:id",
    UserValidator.validateIdParam,
    UserController.getById
);
router.post(
    "/",
    UserValidator.validateCreate,
    UserController.create
);
router.delete(
    "/:id",
    UserValidator.validateIdParam,
    UserController.remove
);

export default router;