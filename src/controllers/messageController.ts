import { type NextFunction, type Request, type Response } from "express";
import { type IMessage } from "../types";

import Message from "../models/message";

class MessageController {
  public newMessage = async (
    req: Request<{}, {}, IMessage>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const message = await Message.create(req.body);

      res.status(201).send(message);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public getMessages = async (
    req: Request<{ chatId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const chatId = req.params.chatId;

      const messages = await Message.find({ chatId })
        .sort({ createdAt: -1 })
        .limit(15);

      res.status(200).send(messages);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
}

export default new MessageController();
