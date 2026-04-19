"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopController = void 0;
const express_1 = require("express");
const Shop_1 = __importDefault(require("../models/Shop"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ShopController {
    createShop = async (req, res) => {
        try {
            const { shopName, address, lat, lng, description, phone, imageUrl } = req.body;
            const existing = await Shop_1.default.findOne({ owner: req.user.id });
            if (existing) {
                res.status(400).json({ message: 'You already have a shop registered' });
                return;
            }
            const shop = await Shop_1.default.create({
                owner: req.user.id,
                shopName, address, lat, lng, description, phone, imageUrl,
            });
            res.status(201).json(shop);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getMyShop = async (req, res) => {
        try {
            const shop = await Shop_1.default.findOne({ owner: req.user.id }).populate('owner', 'name email phone');
            if (!shop) {
                res.status(404).json({ message: 'Shop not found' });
                return;
            }
            res.status(200).json(shop);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    updateShop = async (req, res) => {
        try {
            const shop = await Shop_1.default.findOneAndUpdate({ owner: req.user.id }, req.body, { new: true, runValidators: true });
            if (!shop) {
                res.status(404).json({ message: 'Shop not found' });
                return;
            }
            res.status(200).json(shop);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getNearbyShops = async (req, res) => {
        try {
            const { lat, lng, radius = 5 } = req.query;
            const shops = await Shop_1.default.find({ isOpen: true }).populate('owner', 'name phone');
            const nearby = shops.filter((shop) => {
                if (!lat || !lng)
                    return true;
                const dlat = shop.lat - Number(lat);
                const dlng = shop.lng - Number(lng);
                const dist = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
                return dist <= Number(radius);
            });
            res.status(200).json(nearby);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getShopById = async (req, res) => {
        try {
            const shop = await Shop_1.default.findById(req.params.id).populate('owner', 'name phone email');
            if (!shop) {
                res.status(404).json({ message: 'Shop not found' });
                return;
            }
            res.status(200).json(shop);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}
exports.shopController = new ShopController();
//# sourceMappingURL=shop.controller.js.map