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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
class AuthController {
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'kiranaquick_secret', { expiresIn: '7d' });
    }
    register = async (req, res) => {
        try {
            const { name, email, password, phone, role, address } = req.body;
            const existing = await User_1.default.findOne({ email });
            if (existing) {
                res.status(400).json({ message: 'User already exists with this email' });
                return;
            }
            const hashed = await bcrypt_1.default.hash(password, 10);
            const user = await User_1.default.create({ name, email, password: hashed, phone, role, address });
            const token = this.generateToken(user);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                token,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            const token = this.generateToken(user);
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                token,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getMe = async (req, res) => {
        try {
            const user = await User_1.default.findById(req.user.id).select('-password');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    updateProfile = async (req, res) => {
        try {
            const user = await User_1.default.findByIdAndUpdate(req.user.id, { name: req.body.name, phone: req.body.phone, address: req.body.address }, { new: true, runValidators: true }).select('-password');
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map