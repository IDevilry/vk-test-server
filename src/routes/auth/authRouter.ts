import { Router } from "express";
import authController from "../../controllers/authController";
const authRouter = Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.authenticateUser);

export { authRouter };
