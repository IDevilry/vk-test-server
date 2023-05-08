import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import fileupload from "express-fileupload";

import { createServer } from "node:http";
import { Server } from "socket.io";

import * as dotenv from "dotenv";
import path from "node:path";

import { authRouter } from "./routes/auth/authRouter";
import { userRouter } from "./routes/user/userRouter";
import { postRouter } from "./routes/post/postRouter";
import { chatRouter } from "./routes/chat/chatRouter";
import { messageRouter } from "./routes/chat/messageRouter";
import { IUserWithSocket } from "./types";
import { subOnAddNewUser, subOnDisconnect, subOnSendMessage } from "./socket";

dotenv.config();

const DB_HOST = process.env.DB_HOST ?? "";
const CLIENT_HOST = process.env.CLIENT_HOST ?? "";

const PORT = process.env.PORT ?? 1337;
const SOCKET_PORT = process.env.SOCKET_PORT ?? 4000;

class App {
  public app: express.Application;
  httpServer: import("http").Server<
    typeof import("http").IncomingMessage,
    typeof import("http").ServerResponse
  >;
  public io: Server;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: CLIENT_HOST,
        methods: ["GET", "POST", "PATCH", "DELETE"],
      },
    });
    this.middleware();
    this.routes();
    this.socket();
  }

  public start(): void {
    this.httpServer.listen(SOCKET_PORT, () => {
      console.log(`Socket IO started on port ${SOCKET_PORT}`);
    });
    this.app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  }

  private middleware(): void {
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", CLIENT_HOST);
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
      );
      next();
    });

    this.app.options("/*", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", CLIENT_HOST);
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
      );
      res.sendStatus(200);
    });
    this.app.use(
      cors({
        origin: CLIENT_HOST,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
      })
    );
    this.app.use(express.static(path.resolve(__dirname, "public")));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(fileupload());
  }

  private routes(): void {
    this.app.use("/auth", authRouter);
    this.app.use("/users", userRouter);
    this.app.use("/posts", postRouter);
    this.app.use("/chats", chatRouter);
    this.app.use("/messages", messageRouter);
  }

  public socket(): void {
    let activeUsers: IUserWithSocket[] = [];
    this.io.on("connection", (socket) => {
      subOnAddNewUser.call(this, socket, activeUsers);
      subOnSendMessage.call(this, socket, activeUsers);
      subOnDisconnect.call(this, socket, activeUsers);
    });
  }
}

mongoose.connect(DB_HOST).then(() => {
  console.log("Connected to database");
});

export default new App();
