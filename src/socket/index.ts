import { type Socket } from "socket.io";
import { type IMessage, type IUserWithSocket } from "../types";

import type App from "../app";

export function subOnAddNewUser(
  this: typeof App,
  socket: Socket,
  activeUsers: IUserWithSocket[]
) {
  socket.on("addNewUser", (newUser: IUserWithSocket) => {
    if (!activeUsers.some((user) => user._id === newUser._id)) {
      activeUsers.push({ ...newUser, socketId: socket.id });
    }

    this.io.emit("getUsers", activeUsers);
  });
}

export function subOnSendMessage(
  this: typeof App,
  socket: Socket,
  activeUsers: IUserWithSocket[]
) {
  socket.on("sendMessage", (message: IMessage) => {
    const receiver = activeUsers.find(
      (user) => user._id === message.companion?._id
    );
    if (receiver) {
      this.io.to(receiver.socketId).emit("takeMessage", message);
    }
  });
}

export function subOnDisconnect(
  this: typeof App,
  socket: Socket,
  activeUsers: IUserWithSocket[]
) {
  socket.on("userDisconnected", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

    this.io.emit("getUsers", activeUsers);
  });
}
