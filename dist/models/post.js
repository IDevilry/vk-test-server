"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
        },
    ],
    image: {
        type: String,
    },
}, {
    timestamps: true,
});
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
