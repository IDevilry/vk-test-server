import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";

import * as dotenv from "dotenv";
import { authRouter } from "./routes/auth/authRouter";
import { userRouter } from "./routes/user/userRouter";
import { postRouter } from "./routes/post/postRouter";

dotenv.config();

const DB_HOST = process.env.DB_HOST ?? "";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  public start(): void {
    const PORT = process.env.PORT || 1337;
    this.app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  }

  private middleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/auth", authRouter);
    this.app.use("/users", userRouter);
    this.app.use("/posts", postRouter);
  }
}

mongoose.connect(DB_HOST).then(() => {
  console.log("Connected to database");
});

export default new App();
