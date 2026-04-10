import { Router } from 'express';
import { placeOrder, getMyOrders, getShopOrders, acceptOrder, rejectOrder } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/shop', protect, getShopOrders);
router.put('/:id/accept', protect, acceptOrder);
router.put('/:id/reject', protect, rejectOrder);

export default router;
// real-time order flow endpoints
// admin dispute resolution route placeholder
