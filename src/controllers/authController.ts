import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { type IUser } from "../types";

import * as dotenv from "dotenv";
import { v4 } from "uuid";
import path from "path";
import fileUpload from "express-fileupload";
dotenv.config();

const JWT_KEY = process.env.JWT_KEY ?? "";

class AuthController {
  public registerUser = async (
    req: Request<unknown, unknown, IUser>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const isUserExist = await User.findOne({
        user_email: req.body.user_email,
      });
      if (isUserExist) {
        throw new Error(`Пользователь с ${req.body.user_email} уже существует`);
      }
      const image: fileUpload.UploadedFile | any = req.files?.image;
      const imageName = `${v4()}.jpg`;
      image?.mv(path.resolve(__dirname, "..", "..", "build", imageName));

      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        user_email: req.body.user_email,
        user_first_name: req.body.user_first_name,
        user_last_name: req.body.user_last_name,
        profile_photo: imageName,
        password: hashedPass,
      });
      const { password, ...other } = user.toObject();
      res.status(201).send({ other, jwt: jwt.sign({ id: user._id }, JWT_KEY) });
    } catch (err: Error | any) {
      res.status(400).send(err.message);
    }
  };
  public authenticateUser = async (
    req: Request<{}, {}, IUser>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user_email } = req.body;
      const user = await User.findOne({ user_email: user_email });
      if (!user) {
        throw new Error(`Пользователь с ${req.body.user_email} не существует`);
      }
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error(`Неверный пароль`);
      }
      const { password, ...other } = user.toObject();
      res.status(200).send({ other, jwt: jwt.sign({ id: user._id }, JWT_KEY) });
    } catch (err: Error | any) {
      res.status(400).send(err.message);
    }
  };
}

export default new AuthController();
