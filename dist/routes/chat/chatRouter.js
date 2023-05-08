"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const chatController_1 = __importDefault(require("../../controllers/chatController"));
const chatRouter = (0, express_1.default)();
exports.chatRouter = chatRouter;
chatRouter.post("/new", chatController_1.default.newChat);
chatRouter.get("/:userId", chatController_1.default.getUserChats);
chatRouter.get("/find/:firstId/:secondId", chatController_1.default.findChat);
