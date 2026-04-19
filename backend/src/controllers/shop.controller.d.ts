import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
declare class ShopController {
    createShop: (req: AuthRequest, res: Response) => Promise<void>;
    getMyShop: (req: AuthRequest, res: Response) => Promise<void>;
    updateShop: (req: AuthRequest, res: Response) => Promise<void>;
    getNearbyShops: (req: AuthRequest, res: Response) => Promise<void>;
    getShopById: (req: AuthRequest, res: Response) => Promise<void>;
}
export declare const shopController: ShopController;
export {};
//# sourceMappingURL=shop.controller.d.ts.map