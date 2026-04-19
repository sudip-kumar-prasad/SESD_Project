import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
declare class OrderController {
    private generateOTP;
    placeOrder: (req: AuthRequest, res: Response) => Promise<void>;
    getMyOrders: (req: AuthRequest, res: Response) => Promise<void>;
    getShopOrders: (req: AuthRequest, res: Response) => Promise<void>;
    acceptOrder: (req: AuthRequest, res: Response) => Promise<void>;
    rejectOrder: (req: AuthRequest, res: Response) => Promise<void>;
    acceptDelivery: (req: AuthRequest, res: Response) => Promise<void>;
    updateDeliveryStatus: (req: AuthRequest, res: Response) => Promise<void>;
    getAvailableDeliveries: (req: AuthRequest, res: Response) => Promise<void>;
    getOrderById: (req: AuthRequest, res: Response) => Promise<void>;
}
export declare const orderController: OrderController;
export {};
//# sourceMappingURL=order.controller.d.ts.map