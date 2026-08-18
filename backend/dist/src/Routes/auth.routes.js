"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authroutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_js_1 = require("../Controllers/auth.controller.js");
exports.Authroutes = express_1.default.Router();
exports.Authroutes.post('/register', auth_controller_js_1.createUser);
exports.Authroutes.post('/login', auth_controller_js_1.loginUser);
//# sourceMappingURL=auth.routes.js.map