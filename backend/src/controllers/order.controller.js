"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const express_1 = require("express");
const Order_1 = __importDefault(require("../models/Order"));
const Shop_1 = __importDefault(require("../models/Shop"));
const Delivery_1 = __importDefault(require("../models/Delivery"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const socket_1 = require("../utils/socket");
class OrderController {
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    placeOrder = async (req, res) => {
        try {
            const { shopId, items, deliveryAddress } = req.body;
            const totalAmount = items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);
            const order = await Order_1.default.create({
                customer: req.user.id,
                shop: shopId,
                items,
                totalAmount,
                deliveryAddress,
            });
            const populated = await order.populate(['customer', 'shop']);
            const shop = await Shop_1.default.findById(shopId);
            if (shop) {
                (0, socket_1.getIO)().to(`shop_${shop.owner}`).emit('new_order', populated);
            }
            res.status(201).json(populated);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getMyOrders = async (req, res) => {
        try {
            const orders = await Order_1.default.find({ customer: req.user.id })
                .populate('shop', 'shopName address')
                .populate('deliveryPartner', 'name phone')
                .sort({ createdAt: -1 });
            res.status(200).json(orders);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getShopOrders = async (req, res) => {
        try {
            const shop = await Shop_1.default.findOne({ owner: req.user.id });
            if (!shop) {
                res.status(404).json({ message: 'Shop not found' });
                return;
            }
            const orders = await Order_1.default.find({ shop: shop._id })
                .populate('customer', 'name phone address')
                .sort({ createdAt: -1 });
            res.status(200).json(orders);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    acceptOrder = async (req, res) => {
        try {
            const order = await Order_1.default.findById(req.params.id);
            if (!order) {
                res.status(404).json({ message: 'Order not found' });
                return;
            }
            order.status = 'ACCEPTED';
            await order.save();
            (0, socket_1.getIO)().to(`user_${order.customer}`).emit('order_accepted', { orderId: order._id });
            (0, socket_1.getIO)().emit('new_delivery_request', { orderId: order._id, shopId: order.shop });
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    rejectOrder = async (req, res) => {
        try {
            const order = await Order_1.default.findById(req.params.id);
            if (!order) {
                res.status(404).json({ message: 'Order not found' });
                return;
            }
            order.status = 'REJECTED';
            await order.save();
            (0, socket_1.getIO)().to(`user_${order.customer}`).emit('order_rejected', { orderId: order._id });
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    acceptDelivery = async (req, res) => {
        try {
            const order = await Order_1.default.findById(req.params.id);
            if (!order || order.status !== 'ACCEPTED') {
                res.status(400).json({ message: 'Order not available for delivery' });
                return;
            }
            order.deliveryPartner = req.user.id;
            await order.save();
            const delivery = await Delivery_1.default.create({
                order: order._id,
                partner: req.user.id,
                otp: this.generateOTP(),
            });
            (0, socket_1.getIO)().to(`user_${order.customer}`).emit('driver_assigned', {
                orderId: order._id,
                partnerId: req.user.id,
            });
            const shop = await Shop_1.default.findById(order.shop);
            if (shop)
                (0, socket_1.getIO)().to(`shop_${shop.owner}`).emit('driver_assigned', { orderId: order._id });
            res.status(200).json({ order, delivery });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    updateDeliveryStatus = async (req, res) => {
        try {
            const { status } = req.body;
            const delivery = await Delivery_1.default.findOne({ order: req.params.id, partner: req.user.id });
            if (!delivery) {
                res.status(404).json({ message: 'Delivery not found' });
                return;
            }
            delivery.status = status;
            if (status === 'PICKED_UP')
                delivery.pickupTime = new Date();
            if (status === 'DELIVERED')
                delivery.deliveryTime = new Date();
            await delivery.save();
            const order = await Order_1.default.findById(req.params.id);
            if (order) {
                if (status === 'PICKED_UP')
                    order.status = 'OUT_FOR_DELIVERY';
                if (status === 'DELIVERED') {
                    order.status = 'DELIVERED';
                    order.paymentStatus = 'PAID';
                }
                await order.save();
                (0, socket_1.getIO)().to(`user_${order.customer}`).emit('order_status_update', {
                    orderId: order._id,
                    status: order.status,
                });
                const shop = await Shop_1.default.findById(order.shop);
                if (shop)
                    (0, socket_1.getIO)().to(`shop_${shop.owner}`).emit('order_status_update', {
                        orderId: order._id,
                        status: order.status,
                    });
            }
            res.status(200).json(delivery);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getAvailableDeliveries = async (req, res) => {
        try {
            const orders = await Order_1.default.find({ status: 'ACCEPTED', deliveryPartner: null })
                .populate('shop', 'shopName address lat lng')
                .sort({ createdAt: -1 });
            res.status(200).json(orders);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getOrderById = async (req, res) => {
        try {
            const order = await Order_1.default.findById(req.params.id)
                .populate('customer', 'name phone')
                .populate('shop', 'shopName address lat lng phone')
                .populate('deliveryPartner', 'name phone');
            if (!order) {
                res.status(404).json({ message: 'Order not found' });
                return;
            }
            res.status(200).json(order);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}
exports.orderController = new OrderController();
//# sourceMappingURL=order.controller.js.map