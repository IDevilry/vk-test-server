import { Router } from "express";
import { UserController } from "../../controllers";
import dbClient from "../../database";

const controller = new UserController(dbClient);

const userRouter = Router();

userRouter.get("/", controller.getAllUsers);
userRouter.get("/:id", controller.getUser);
userRouter.post("/new", controller.newUser);
userRouter.delete("/delete/:id", controller.deleteUser);

export { userRouter };
