"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv.config();
const JWT_KEY = (_a = process.env.JWT_KEY) !== null && _a !== void 0 ? _a : "";
class PostController {
    constructor() {
        this.getAllPosts = async (req, res, next) => {
            try {
                const { limit = 20, page = 1 } = req.query;
                let offset = (Number(page) - 1) * Number(limit);
                const posts = await post_1.default.find({})
                    .skip(offset)
                    .limit(Number(limit))
                    .sort({ createdAt: -1 })
                    .populate("user", { password: 0 });
                const totalCount = await post_1.default.count({});
                res.status(200).send({ totalCount, countOnPage: posts.length, posts });
            }
            catch (error) {
                res.status(500).send();
            }
        };
        this.getPost = async (req, res, next) => {
            const { id } = req.params;
            try {
                const post = await post_1.default.findById(id);
                if (!post) {
                    throw new Error(`Пост с ID ${id} не существует`);
                }
                res.status(200).send(post);
            }
            catch (error) {
                res.status(404).send(error.message);
            }
        };
        this.getMyPosts = async (req, res, next) => {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                const userId = jsonwebtoken_1.default.verify(token || "", JWT_KEY, (err, decoded) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                    return decoded;
                });
                const posts = await post_1.default.find({ user: userId === null || userId === void 0 ? void 0 : userId.id }).sort({
                    createdAt: -1,
                });
                res.status(200).send({ posts, totalCount: posts.length });
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.updatePost = async (req, res, next) => {
            const { id } = req.params;
            if (!id) {
                throw new Error();
            }
            try {
                const post = await post_1.default.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                if (!post) {
                    throw new Error(`Пост с ID ${id} не существует`);
                }
                res.status(201).send(post);
            }
            catch (error) {
                res.status(404).send(error.message);
            }
        };
        this.newPost = async (req, res, next) => {
            var _a;
            try {
                const { content, title, user: author } = req.body;
                const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
                const imageName = `${(0, uuid_1.v4)()}.jpg`;
                image === null || image === void 0 ? void 0 : image.mv(node_path_1.default.resolve(__dirname, "..", "..", "build", imageName));
                const post = await post_1.default.create({
                    content,
                    user: author,
                    title,
                    image: imageName || "",
                });
                const user = await user_1.default.findByIdAndUpdate(req.body.user, {
                    $push: { posts: new mongoose_1.default.Types.ObjectId(post.id) },
                }, { new: true, fields: { password: 0 } });
                res.status(201).send({ post, user });
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.toggleLike = async (req, res, next) => {
            try {
                const { postId, userId } = req.body;
                if (!userId || !postId) {
                    throw new Error(`userId | postId не переданы`);
                }
                const post = await post_1.default.findById(postId);
                const user = await user_1.default.findById(userId);
                if (!user || !post) {
                    throw new Error();
                }
                if (post === null || post === void 0 ? void 0 : post.likes.includes(user === null || user === void 0 ? void 0 : user.id)) {
                    await post_1.default.findByIdAndUpdate(postId, {
                        $pull: { likes: new mongoose_1.default.Types.ObjectId(userId) },
                    });
                    await user_1.default.findByIdAndUpdate(userId, {
                        $pull: { likes: new mongoose_1.default.Types.ObjectId(postId) },
                    });
                }
                else {
                    await post_1.default.findByIdAndUpdate(postId, {
                        $push: { likes: new mongoose_1.default.Types.ObjectId(userId) },
                    });
                    await user_1.default.findByIdAndUpdate(userId, {
                        $push: { likes: new mongoose_1.default.Types.ObjectId(postId) },
                    });
                }
                res.status(200).send("success");
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
    }
}
exports.default = new PostController();
