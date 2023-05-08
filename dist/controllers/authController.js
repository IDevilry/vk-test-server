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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const JWT_KEY = (_a = process.env.JWT_KEY) !== null && _a !== void 0 ? _a : "";
class AuthController {
    constructor() {
        this.registerUser = async (req, res, next) => {
            try {
                const isUserExist = await user_1.default.findOne({
                    user_email: req.body.user_email,
                });
                if (isUserExist) {
                    throw new Error(`Пользователь с ${req.body.user_email} уже существует`);
                }
                const hashedPass = await bcrypt_1.default.hash(req.body.password, 10);
                const user = await user_1.default.create({
                    user_email: req.body.user_email,
                    user_first_name: req.body.user_first_name,
                    user_last_name: req.body.user_last_name,
                    password: hashedPass,
                });
                const _a = user.toObject(), { password } = _a, other = __rest(_a, ["password"]);
                res.status(201).send({ other, jwt: jsonwebtoken_1.default.sign({ id: user._id }, JWT_KEY) });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        };
        this.authenticateUser = async (req, res, next) => {
            try {
                const { user_email } = req.body;
                const user = await user_1.default.findOne({ user_email: user_email });
                if (!user) {
                    throw new Error(`Пользователь с ${req.body.user_email} не существует`);
                }
                const isPasswordValid = await bcrypt_1.default.compare(req.body.password, user.password);
                if (!isPasswordValid) {
                    throw new Error(`Неверный пароль`);
                }
                const _a = user.toObject(), { password } = _a, other = __rest(_a, ["password"]);
                res.status(200).send({ other, jwt: jsonwebtoken_1.default.sign({ id: user._id }, JWT_KEY) });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        };
    }
}
exports.default = new AuthController();
