"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
    description: {
        type: String,
    },
    posts: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Post",
        },
    ],
    likes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Post",
        },
    ],
    friends: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
