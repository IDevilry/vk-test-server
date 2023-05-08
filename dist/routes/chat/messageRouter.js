"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = __importDefault(require("express"));
const messageController_1 = __importDefault(require("../../controllers/messageController"));
const messageRouter = (0, express_1.default)();
exports.messageRouter = messageRouter;
messageRouter.post("/new", messageController_1.default.newMessage);
messageRouter.get("/:chatId", messageController_1.default.getMessages);
