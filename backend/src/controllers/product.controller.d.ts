import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
declare class ProductController {
    addProduct: (req: AuthRequest, res: Response) => Promise<void>;
    getProductsByShop: (req: AuthRequest, res: Response) => Promise<void>;
    updateProduct: (req: AuthRequest, res: Response) => Promise<void>;
    deleteProduct: (req: AuthRequest, res: Response) => Promise<void>;
    toggleAvailability: (req: AuthRequest, res: Response) => Promise<void>;
}
export declare const productController: ProductController;
export {};
//# sourceMappingURL=product.controller.d.ts.map