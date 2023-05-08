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
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const uuid_1 = require("uuid");
dotenv.config();
const JWT_KEY = (_a = process.env.JWT_KEY) !== null && _a !== void 0 ? _a : "";
class UserController {
    constructor() {
        this.getUser = async (req, res, next) => {
            var _a;
            try {
                if (!((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new Error("ID передан некорректно");
                }
                const user = await user_1.default.findById(req.params.id, { password: 0 }).populate("posts");
                if (!user) {
                    throw new Error(`Пользователь с ${req.params.id} не существует`);
                }
                res.status(200).send({ user, totalCount: user.posts.length });
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.getAllUsers = async (req, res, next) => {
            try {
                const user = await user_1.default.find({}, {
                    password: 0,
                });
                res.status(200).send(user);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.updateUser = async (req, res, next) => {
            var _a;
            const { id } = req.params;
            if (!id) {
                throw new Error();
            }
            try {
                console.log(req.files);
                const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.profile_photo;
                const imageName = `${(0, uuid_1.v4)()}.jpg`;
                image === null || image === void 0 ? void 0 : image.mv(path_1.default.resolve(__dirname, "..", "..", "build", imageName));
                const userToUpdate = req.body;
                userToUpdate.profile_photo = imageName || "";
                const user = await user_1.default.findByIdAndUpdate(id, userToUpdate, {
                    fields: {
                        password: 0,
                    },
                    new: true,
                });
                if (!user) {
                    throw new Error(`Пользователь с ID ${id} не существует`);
                }
                res.status(201).send(user);
            }
            catch (error) {
                res.status(404).send(error.message);
            }
        };
        this.toggleFriend = async (req, res, next) => {
            try {
                const { userId, targetId } = req.body;
                if (!userId || !targetId || userId === targetId) {
                    throw new Error("");
                }
                const targetUser = await user_1.default.findById(targetId, { password: 0 });
                const user = await user_1.default.findById(userId, { password: 0 });
                if (!targetUser || !user) {
                    throw new Error();
                }
                if (!(user === null || user === void 0 ? void 0 : user.friends.includes(targetUser === null || targetUser === void 0 ? void 0 : targetUser._id))) {
                    await user_1.default.findByIdAndUpdate(userId, {
                        $push: { friends: new mongoose_1.default.Types.ObjectId(targetId) },
                    }, { new: true });
                    await user_1.default.findByIdAndUpdate(targetId, {
                        $push: { friends: new mongoose_1.default.Types.ObjectId(userId) },
                    }, { new: true });
                }
                else {
                    await user_1.default.findByIdAndUpdate(userId, {
                        $pull: { friends: new mongoose_1.default.Types.ObjectId(targetId) },
                    }, { new: true });
                    await user_1.default.findByIdAndUpdate(targetId, {
                        $pull: { friends: new mongoose_1.default.Types.ObjectId(userId) },
                    }, { new: true });
                }
                res.status(200).send({ targetUser, currentUser: user });
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const { id } = req.params;
                const user = await user_1.default.findByIdAndDelete(id);
                if (!user) {
                    throw new Error("User not found");
                }
                res.status(200).send(user === null || user === void 0 ? void 0 : user._id);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.getMe = async (req, res, next) => {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                const userId = jsonwebtoken_1.default.verify(token || "", JWT_KEY, (err, decoded) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                    return decoded;
                });
                const user = await user_1.default.findById(userId === null || userId === void 0 ? void 0 : userId.id, { password: 0 });
                res.status(200).send(user);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.getFriends = async (req, res, next) => {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                const userId = jsonwebtoken_1.default.verify(token || "", JWT_KEY, (err, decoded) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                    return decoded;
                });
                const user = await user_1.default.findById(userId === null || userId === void 0 ? void 0 : userId.id, {
                    friends: 1,
                }).populate({ path: "friends", populate: { path: "posts" } });
                res.status(200).send({ user, totalCount: user === null || user === void 0 ? void 0 : user.friends.length });
            }
            catch (error) {
                res.send(400).send(error.message);
            }
        };
    }
}
exports.default = new UserController();
