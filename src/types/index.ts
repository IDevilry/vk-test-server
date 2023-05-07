import mongoose from "mongoose";

export interface IUser {
  _id: string | mongoose.Types.ObjectId;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  password: string;
  age?: number;
  profile_photo?: string;
  city?: string;
  institution?: string;
  description?: string;
}

export interface IUserWithSocket extends IUser {
  socketId: string;
}

export interface IPost {
  user: string;
  title?: string;
  content: string;
  image?: string;
  likes?: IUser[];
}

export interface IMessage {
  chatId: string;
  senderId: string;
  text: string;
  companion?: IUser;
}
