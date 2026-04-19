"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/shop/:shopId', auth_middleware_1.protect, product_controller_1.productController.getProductsByShop);
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), product_controller_1.productController.addProduct);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), product_controller_1.productController.updateProduct);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), product_controller_1.productController.deleteProduct);
router.patch('/:id/toggle', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('shop_owner'), product_controller_1.productController.toggleAvailability);
exports.default = router;
//# sourceMappingURL=product.routes.js.map