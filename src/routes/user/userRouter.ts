import { Router } from "express";
import userController from "../../controllers/userController";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", userController.getUser);
userRouter.patch("/update/:id", userController.updateUser);
userRouter.post("/togglefriend", userController.toggleFriend);
userRouter.delete("/delete/:id");

export { userRouter };
