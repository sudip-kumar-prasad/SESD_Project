import { Router } from 'express';
import { getAllShops, getShopById, getMyShop, createShop } from '../controllers/shop.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', getAllShops);
router.get('/my', protect, getMyShop);
router.get('/:id', getShopById);
router.post('/', protect, createShop);

export default router;
