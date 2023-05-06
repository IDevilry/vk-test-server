import { Router } from "express";

import userController from "../../controllers/userController";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/me", userController.getMe);
userRouter.get("/id/:id", userController.getUser);
userRouter.get("/friends", userController.getFriends);
userRouter.patch("/update/:id", userController.updateUser);
userRouter.post("/togglefriend", userController.toggleFriend);
userRouter.delete("/delete/:id", userController.deleteUser);

export { userRouter };
