import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { signupSchema, loginSchema } from "../validation/authSchemas";

const router = Router();

router.post("/signup", validateRequest(signupSchema), AuthController.signup);
router.post("/login", validateRequest(loginSchema), AuthController.login);

export default router;

