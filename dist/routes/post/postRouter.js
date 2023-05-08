"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const postController_1 = __importDefault(require("../../controllers/postController"));
const postRouter = (0, express_1.Router)();
exports.postRouter = postRouter;
postRouter.get("/", postController_1.default.getAllPosts);
postRouter.get("/my", postController_1.default.getMyPosts);
postRouter.get("/:id", postController_1.default.getPost);
postRouter.post("/new", postController_1.default.newPost);
postRouter.post("/update/:id", postController_1.default.updatePost);
postRouter.post("/like", postController_1.default.toggleLike);
