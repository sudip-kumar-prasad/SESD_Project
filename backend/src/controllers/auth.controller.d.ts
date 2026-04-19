import { Request, Response } from 'express';
declare class AuthController {
    private generateToken;
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    getMe: (req: any, res: Response) => Promise<void>;
    updateProfile: (req: any, res: Response) => Promise<void>;
}
export declare const authController: AuthController;
export {};
//# sourceMappingURL=auth.controller.d.ts.map