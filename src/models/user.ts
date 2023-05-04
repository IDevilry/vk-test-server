import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
    },
    user_first_name: {
      type: String,
      required: true,
    },
    user_last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_photo: {
      type: String,
    },
    age: {
      type: Number,
    },
    city: {
      type: String,
    },
    institution: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
