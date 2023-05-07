import Router from "express";
import messageController from "../../controllers/messageController";

const messageRouter = Router();

messageRouter.post("/new", messageController.newMessage)
messageRouter.get("/:chatId", messageController.getMessages)


export { messageRouter };
