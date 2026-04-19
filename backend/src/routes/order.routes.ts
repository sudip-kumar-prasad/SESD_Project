import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Customer
router.post('/', protect, authorize('customer'), orderController.placeOrder);
router.get('/my', protect, authorize('customer'), orderController.getMyOrders);

// Shop Owner
router.get('/shop', protect, authorize('shop_owner'), orderController.getShopOrders);
router.get('/shop/stats', protect, authorize('shop_owner'), orderController.getShopStats);
router.put('/:id/accept', protect, authorize('shop_owner'), orderController.acceptOrder);
router.put('/:id/reject', protect, authorize('shop_owner'), orderController.rejectOrder);

// Delivery Partner
router.get('/available', protect, authorize('delivery_partner'), orderController.getAvailableDeliveries);
router.get('/active-delivery', protect, authorize('delivery_partner'), orderController.getActiveDelivery);
router.put('/:id/accept-delivery', protect, authorize('delivery_partner'), orderController.acceptDelivery);
router.put('/:id/delivery-status', protect, authorize('delivery_partner'), orderController.updateDeliveryStatus);

// Admin
router.get('/admin/stats', protect, authorize('admin'), orderController.getGlobalStats);

// Any authenticated user can view order detail
router.get('/:id', protect, orderController.getOrderById);

export default router;
