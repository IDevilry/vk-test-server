import { NextFunction, Request, Response } from "express";
import Chat from "../models/chat";
import mongoose from "mongoose";

class ChatController {
  public newChat = async (
    req: Request<{}, {}, { senderId: string; receiverId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { senderId, receiverId } = req.body;

      const chat = await Chat.create({
        members: [senderId, receiverId],
      });

      const chatWithMembers = await chat.populate("members");

      res.status(201).send(chatWithMembers);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };

  public getUserChats = async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.userId;
      const chat = await Chat.find({
        members: { $in: userId },
      }).populate("members");
      res.status(200).send(chat);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };

  public findChat = async (
    req: Request<{ firstId: string; secondId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { firstId, secondId } = req.params;

      const chat = await Chat.findOne({
        members: { $all: [firstId, secondId] },
      }).populate("members");
      res.status(200).send(chat);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
}

export default new ChatController();
