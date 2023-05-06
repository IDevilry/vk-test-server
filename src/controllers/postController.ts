import { NextFunction, Request, Response } from "express";
import { IPost } from "../types";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Post from "../models/post";
import User from "../models/user";
import mongoose from "mongoose";

dotenv.config();

const JWT_KEY = process.env.JWT_KEY ?? "";

class PostController {
  public getAllPosts = async (
    req: Request<{}, {}, {}, { page: string; limit: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { limit = 20, page = 1 } = req.query;
      let offset = (Number(page) - 1) * Number(limit);
      const posts = await Post.find({})
        .skip(offset)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .populate("user", { password: 0 });

      const totalCount = await Post.count({});
      res.status(200).send({ totalCount, countOnPage: posts.length, posts });
    } catch (error) {
      res.status(500).send();
    }
  };
  public getPost = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id);
      if (!post) {
        throw new Error(`Пост с ID ${id} не существует`);
      }
      res.status(200).send(post);
    } catch (error: Error | any) {
      res.status(404).send(error.message);
    }
  };
  public getMyPosts = async (
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
      const posts = await Post.find({ user: userId?.id }).sort({
        createdAt: -1,
      });
      res.status(200).send({ posts, totalCount: posts.length });
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public updatePost = async (
    req: Request<{ id: string }, {}, IPost>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new Error();
    }
    try {
      const post = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!post) {
        throw new Error(`Пост с ID ${id} не существует`);
      }
      res.status(201).send(post);
    } catch (error: Error | any) {
      res.status(404).send(error.message);
    }
  };
  public newPost = async (
    req: Request<{}, {}, IPost>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const post = await Post.create(req.body);
      const user = await User.findByIdAndUpdate(
        req.body.user,
        {
          $push: { posts: new mongoose.Types.ObjectId(post.id) },
        },
        { new: true, fields: { password: 0 } }
      );
      res.status(201).send({ post, user });
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
  public toggleLike = async (
    req: Request<{}, {}, { postId: string; userId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { postId, userId } = req.body;

      if (!userId || !postId) {
        throw new Error(`userId | postId не переданы`);
      }

      const post = await Post.findById(postId);
      const user = await User.findById(userId);

      if (!user || !post) {
        throw new Error();
      }

      if (post?.likes.includes(user?.id)) {
        await Post.findByIdAndUpdate(postId, {
          $pull: { likes: new mongoose.Types.ObjectId(userId) },
        });
        await User.findByIdAndUpdate(userId, {
          $pull: { likes: new mongoose.Types.ObjectId(postId) },
        });
      } else {
        await Post.findByIdAndUpdate(postId, {
          $push: { likes: new mongoose.Types.ObjectId(userId) },
        });
        await User.findByIdAndUpdate(userId, {
          $push: { likes: new mongoose.Types.ObjectId(postId) },
        });
      }
      res.status(200).send("success");
    } catch (error: Error | any) {
      res.status(400).send(error.message);
    }
  };
}

export default new PostController();
