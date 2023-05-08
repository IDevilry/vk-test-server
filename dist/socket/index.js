"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subOnDisconnect = exports.subOnSendMessage = exports.subOnAddNewUser = void 0;
function subOnAddNewUser(socket, activeUsers) {
    socket.on("addNewUser", (newUser) => {
        if (!activeUsers.some((user) => user._id === newUser._id)) {
            activeUsers.push(Object.assign(Object.assign({}, newUser), { socketId: socket.id }));
        }
        this.io.emit("getUsers", activeUsers);
    });
}
exports.subOnAddNewUser = subOnAddNewUser;
function subOnSendMessage(socket, activeUsers) {
    socket.on("sendMessage", (message) => {
        const receiver = activeUsers.find((user) => { var _a; return user._id === ((_a = message.companion) === null || _a === void 0 ? void 0 : _a._id); });
        if (receiver) {
            this.io.to(receiver.socketId).emit("takeMessage", message);
        }
    });
}
exports.subOnSendMessage = subOnSendMessage;
function subOnDisconnect(socket, activeUsers) {
    socket.on("userDisconnected", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        this.io.emit("getUsers", activeUsers);
    });
}
exports.subOnDisconnect = subOnDisconnect;
