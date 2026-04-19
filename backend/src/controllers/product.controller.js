"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const express_1 = require("express");
const Product_1 = __importDefault(require("../models/Product"));
const Shop_1 = __importDefault(require("../models/Shop"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ProductController {
    addProduct = async (req, res) => {
        try {
            const shop = await Shop_1.default.findOne({ owner: req.user.id });
            if (!shop) {
                res.status(404).json({ message: 'Shop not found. Create a shop first.' });
                return;
            }
            const product = await Product_1.default.create({ ...req.body, shop: shop._id });
            res.status(201).json(product);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getProductsByShop = async (req, res) => {
        try {
            const products = await Product_1.default.find({ shop: req.params.shopId });
            res.status(200).json(products);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    updateProduct = async (req, res) => {
        try {
            const shop = await Shop_1.default.findOne({ owner: req.user.id });
            if (!shop) {
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
            const product = await Product_1.default.findOneAndUpdate({ _id: req.params.id, shop: shop._id }, req.body, { new: true, runValidators: true });
            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }
            res.status(200).json(product);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    deleteProduct = async (req, res) => {
        try {
            const shop = await Shop_1.default.findOne({ owner: req.user.id });
            if (!shop) {
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
            await Product_1.default.findOneAndDelete({ _id: req.params.id, shop: shop._id });
            res.status(200).json({ message: 'Product removed' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    toggleAvailability = async (req, res) => {
        try {
            const shop = await Shop_1.default.findOne({ owner: req.user.id });
            if (!shop) {
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
            const product = await Product_1.default.findOne({ _id: req.params.id, shop: shop._id });
            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }
            product.isAvailable = !product.isAvailable;
            await product.save();
            res.status(200).json(product);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}
exports.productController = new ProductController();
//# sourceMappingURL=product.controller.js.map