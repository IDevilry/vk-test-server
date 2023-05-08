"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = __importDefault(require("../../controllers/userController"));
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.get("/", userController_1.default.getAllUsers);
userRouter.get("/me", userController_1.default.getMe);
userRouter.get("/id/:id", userController_1.default.getUser);
userRouter.get("/friends", userController_1.default.getFriends);
userRouter.patch("/update/:id", userController_1.default.updateUser);
userRouter.post("/togglefriend", userController_1.default.toggleFriend);
userRouter.delete("/delete/:id", userController_1.default.deleteUser);
