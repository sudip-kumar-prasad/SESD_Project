import { Request, Response } from 'express';
import Shop from '../models/Shop';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getAllShops = async (_req: Request, res: Response) => {
  try {
    const shops = await Shop.find({ isOpen: true });
    res.json(shops);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const getShopById = async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const getMyShop = async (req: AuthRequest, res: Response) => {
  try {
    const shop = await Shop.findOne({ owner: req.user!.id });
    if (!shop) return res.status(404).json({ message: 'No shop found for this owner' });
    res.json(shop);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const createShop = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await Shop.findOne({ owner: req.user!.id });
    if (existing) return res.status(400).json({ message: 'Shop already exists for this owner' });
    const shop = await Shop.create({ ...req.body, owner: req.user!.id });
    res.status(201).json(shop);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};
