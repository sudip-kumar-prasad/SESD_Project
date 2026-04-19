import { Response } from 'express';
import Shop from '../models/Shop';
import { AuthRequest } from '../middlewares/auth.middleware';

class ShopController {
  public createShop = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { shopName, address, lat, lng, description, phone, imageUrl } = req.body;
      const existing = await Shop.findOne({ owner: req.user!.id });
      if (existing) {
        res.status(400).json({ message: 'You already have a shop registered' });
        return;
      }
      const shop = await Shop.create({
        owner: req.user!.id,
        shopName, address, lat, lng, description, phone, imageUrl,
      });
      res.status(201).json(shop);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getMyShop = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOne({ owner: req.user!.id }).populate('owner', 'name email phone');
      if (!shop) {
        res.status(404).json({ message: 'Shop not found' });
        return;
      }
      res.status(200).json(shop);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateShop = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOneAndUpdate(
        { owner: req.user!.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!shop) {
        res.status(404).json({ message: 'Shop not found' });
        return;
      }
      res.status(200).json(shop);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getNearbyShops = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { lat, lng, radius = 5 } = req.query;
      const shops = await Shop.find({ isOpen: true }).populate('owner', 'name phone');
      const nearby = shops.filter((shop) => {
        if (!lat || !lng) return true;
        const dlat = shop.lat - Number(lat);
        const dlng = shop.lng - Number(lng);
        const dist = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
        return dist <= Number(radius);
      });
      res.status(200).json(nearby);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getShopById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findById(req.params.id).populate('owner', 'name phone email');
      if (!shop) {
        res.status(404).json({ message: 'Shop not found' });
        return;
      }
      res.status(200).json(shop);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const shopController = new ShopController();
