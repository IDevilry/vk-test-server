import Router from "express";

import ChatController from "../../controllers/chatController";

const chatRouter = Router();

chatRouter.post("/new", ChatController.newChat);
chatRouter.get("/:userId", ChatController.getUserChats);
chatRouter.get("/find/:firstId/:secondId", ChatController.findChat);

export { chatRouter };
