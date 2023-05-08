import mongoose from "mongoose";
import User from "../models/user";
import jwt from "jsonwebtoken";
import fileUpload from "express-fileupload";
import path from "path";
import * as dotenv from "dotenv";

import { v4 } from "uuid";
import { type IUser } from "../types";
import { type NextFunction, type Request, type Response } from "express";

dotenv.config();

const JWT_KEY = process.env.JWT_KEY ?? "";

class UserController {
  public getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.params?.id) {
        throw new Error("ID передан некорректно");
      }
      const user = await User.findById(req.params.id, { password: 0 }).populate(
        "posts"
      );
      if (!user) {
        throw new Error(`Пользователь с ${req.params.id} не существует`);
      }

      res.status(200).send({ user, totalCount: user.posts.length });
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public getAllUsers = async (
    req: Request,
    res: Response<IUser[]>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await User.find(
        {},
        {
          password: 0,
        }
      );
      res.status(200).send(user);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public updateUser = async (
    req: Request<{ id: string }, {}, IUser>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new Error();
    }
    try {
      console.log(req.files);
      const image: fileUpload.UploadedFile | any = req.files?.profile_photo;
      const imageName = `${v4()}.jpg`;
      image?.mv(path.resolve(__dirname, "..", "..", "public", imageName));

      const userToUpdate = req.body;
      userToUpdate.profile_photo = imageName || "";

      const user = await User.findByIdAndUpdate(id, userToUpdate, {
        fields: {
          password: 0,
        },
        new: true,
      });
      if (!user) {
        throw new Error(`Пользователь с ID ${id} не существует`);
      }
      res.status(201).send(user);
    } catch (error: Error | any) {
      res.status(404).send(error.message);
    }
  };
  public toggleFriend = async (
    req: Request<{}, {}, { userId: string; targetId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, targetId } = req.body;
      if (!userId || !targetId || userId === targetId) {
        throw new Error("");
      }
      const targetUser = await User.findById(targetId, { password: 0 });
      const user = await User.findById(userId, { password: 0 });
      if (!targetUser || !user) {
        throw new Error();
      }
      if (!user?.friends.includes(targetUser?._id)) {
        await User.findByIdAndUpdate(
          userId,
          {
            $push: { friends: new mongoose.Types.ObjectId(targetId) },
          },
          { new: true }
        );
        await User.findByIdAndUpdate(
          targetId,
          {
            $push: { friends: new mongoose.Types.ObjectId(userId) },
          },
          { new: true }
        );
      } else {
        await User.findByIdAndUpdate(
          userId,
          {
            $pull: { friends: new mongoose.Types.ObjectId(targetId) },
          },
          { new: true }
        );
        await User.findByIdAndUpdate(
          targetId,
          {
            $pull: { friends: new mongoose.Types.ObjectId(userId) },
          },
          { new: true }
        );
      }
      res.status(200).send({ targetUser, currentUser: user });
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public deleteUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error("User not found");
      }
      res.status(200).send(user?._id);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const userId = jwt.verify(token || "", JWT_KEY, (err, decoded) => {
        if (err) {
          throw new Error(err.message);
        }
        return decoded;
      }) as unknown as unknown as { id: string };
      const user = await User.findById(userId?.id, { password: 0 });
      res.status(200).send(user);
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public getFriends = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const userId = jwt.verify(token || "", JWT_KEY, (err, decoded) => {
        if (err) {
          throw new Error(err.message);
        }
        return decoded;
      }) as unknown as unknown as { id: string };

      const user = await User.findById(userId?.id, {
        friends: 1,
      }).populate({ path: "friends", populate: { path: "posts" } });

      res.status(200).send({ user, totalCount: user?.friends.length });
    } catch (error: Error | any) {
      res.send(400).send(error.message);
    }
  };
}

export default new UserController();
