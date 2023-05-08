"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __importDefault(require("../models/message"));
class MessageController {
    constructor() {
        this.newMessage = async (req, res, next) => {
            try {
                const message = await message_1.default.create(req.body);
                res.status(201).send(message);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
        this.getMessages = async (req, res, next) => {
            try {
                const chatId = req.params.chatId;
                const messages = await message_1.default.find({ chatId })
                    .sort({ createdAt: -1 })
                    .limit(15);
                res.status(200).send(messages);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        };
    }
}
exports.default = new MessageController();
