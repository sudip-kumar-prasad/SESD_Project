"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Customer
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('customer'), order_controller_1.orderController.placeOrder);
router.get('/my', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('customer'), order_controller_1.orderController.getMyOrders);
// Shop Owner
router.get('/shop', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), order_controller_1.orderController.getShopOrders);
router.put('/:id/accept', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), order_controller_1.orderController.acceptOrder);
router.put('/:id/reject', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), order_controller_1.orderController.rejectOrder);
// Delivery Partner
router.get('/available', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('delivery_partner'), order_controller_1.orderController.getAvailableDeliveries);
router.put('/:id/accept-delivery', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('delivery_partner'), order_controller_1.orderController.acceptDelivery);
router.put('/:id/delivery-status', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('delivery_partner'), order_controller_1.orderController.updateDeliveryStatus);
// Any authenticated user can view order detail
router.get('/:id', auth_middleware_1.protect, order_controller_1.orderController.getOrderById);
exports.default = router;
//# sourceMappingURL=order.routes.js.map