import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/shop/:shopId', productController.getProductsByShop);
router.post('/', protect, authorize('shop_owner'), productController.addProduct);
router.put('/:id', protect, authorize('shop_owner'), productController.updateProduct);
router.delete('/:id', protect, authorize('shop_owner'), productController.deleteProduct);
router.patch('/:id/toggle', protect, authorize('shop_owner'), productController.toggleAvailability);

export default router;
