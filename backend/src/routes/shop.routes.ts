import { Router } from 'express';
import { shopController } from '../controllers/shop.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', shopController.getNearbyShops);
router.get('/my', protect, authorize('shop_owner'), shopController.getMyShop);
router.post('/', protect, authorize('shop_owner'), shopController.createShop);
router.put('/', protect, authorize('shop_owner'), shopController.updateShop);
router.get('/:id', shopController.getShopById);

export default router;
