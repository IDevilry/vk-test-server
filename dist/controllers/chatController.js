"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = __importDefault(require("../models/chat"));
class ChatController {
    constructor() {
        this.newChat = async (req, res, next) => {
            try {
                const { senderId, receiverId } = req.body;
                const chat = await chat_1.default.create({
                    members: [senderId, receiverId],
                });
                const chatWithMembers = await chat.populate("members");
                res.status(201).send(chatWithMembers);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.getUserChats = async (req, res, next) => {
            try {
                const userId = req.params.userId;
                const chat = await chat_1.default.find({
                    members: { $in: userId },
                }).populate("members");
                res.status(200).send(chat);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.findChat = async (req, res, next) => {
            try {
                const { firstId, secondId } = req.params;
                const chat = await chat_1.default.findOne({
                    members: { $all: [firstId, secondId] },
                }).populate("members");
                res.status(200).send(chat);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
    }
}
exports.default = new ChatController();
