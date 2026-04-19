"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_controller_1 = require("../controllers/shop.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.protect, shop_controller_1.shopController.getNearbyShops);
router.get('/my', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), shop_controller_1.shopController.getMyShop);
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), shop_controller_1.shopController.createShop);
router.put('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), shop_controller_1.shopController.updateShop);
router.get('/:id', auth_middleware_1.protect, shop_controller_1.shopController.getShopById);
exports.default = router;
//# sourceMappingURL=shop.routes.js.map