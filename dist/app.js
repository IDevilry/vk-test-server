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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const dotenv = __importStar(require("dotenv"));
const authRouter_1 = require("./routes/auth/authRouter");
const userRouter_1 = require("./routes/user/userRouter");
const postRouter_1 = require("./routes/post/postRouter");
const chatRouter_1 = require("./routes/chat/chatRouter");
const messageRouter_1 = require("./routes/chat/messageRouter");
const socket_1 = require("./socket");
dotenv.config();
const DB_HOST = (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : "";
const CLIENT_HOST = (_b = process.env.CLIENT_HOST) !== null && _b !== void 0 ? _b : "";
const PORT = (_c = process.env.PORT) !== null && _c !== void 0 ? _c : 1337;
const SOCKET_PORT = (_d = process.env.SOCKET_PORT) !== null && _d !== void 0 ? _d : 4000;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.httpServer = (0, node_http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: CLIENT_HOST,
                methods: ["GET", "POST", "PATCH", "DELETE"],
            },
        });
        this.middleware();
        this.routes();
        this.socket();
    }
    start() {
        this.httpServer.listen(SOCKET_PORT, () => {
            console.log(`Socket IO started on port ${SOCKET_PORT}`);
        });
        this.app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    }
    middleware() {
        this.app.use(express_1.default.static("dist"));
        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", CLIENT_HOST);
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
            next();
        });
        this.app.options("/*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", CLIENT_HOST);
            res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
            res.sendStatus(200);
        });
        this.app.use((0, cors_1.default)({
            origin: CLIENT_HOST,
            methods: ["GET", "POST", "PATCH", "DELETE"],
            allowedHeaders: ["Authorization", "Content-Type"],
        }));
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use((0, express_fileupload_1.default)({
            headers: {
                "access-control-allow-origin": CLIENT_HOST,
            },
        }));
    }
    routes() {
        this.app.use("/auth", authRouter_1.authRouter);
        this.app.use("/users", userRouter_1.userRouter);
        this.app.use("/posts", postRouter_1.postRouter);
        this.app.use("/chats", chatRouter_1.chatRouter);
        this.app.use("/messages", messageRouter_1.messageRouter);
    }
    socket() {
        let activeUsers = [];
        this.io.on("connection", (socket) => {
            socket_1.subOnAddNewUser.call(this, socket, activeUsers);
            socket_1.subOnSendMessage.call(this, socket, activeUsers);
            socket_1.subOnDisconnect.call(this, socket, activeUsers);
        });
    }
}
mongoose_1.default.connect(DB_HOST).then(() => {
    console.log("Connected to database");
});
exports.default = new App();
