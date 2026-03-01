import { Router } from 'express';
import { getProductsByShop, createProduct, toggleProductAvailability, deleteProduct } from '../controllers/product.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
router.get('/shop/:shopId', getProductsByShop);
router.post('/', protect, createProduct);
router.patch('/:id/toggle', protect, toggleProductAvailability);
router.delete('/:id', protect, deleteProduct);

export default router;
