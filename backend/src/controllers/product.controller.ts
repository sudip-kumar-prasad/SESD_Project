import { Response } from 'express';
import Product from '../models/Product';
import Shop from '../models/Shop';
import { AuthRequest } from '../middlewares/auth.middleware';

class ProductController {
  public addProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOne({ owner: req.user!.id });
      if (!shop) {
        res.status(404).json({ message: 'Shop not found. Create a shop first.' });
        return;
      }
      const product = await Product.create({ ...req.body, shop: shop._id });
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getProductsByShop = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const products = await Product.find({ shop: req.params.shopId });
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOne({ owner: req.user!.id });
      if (!shop) {
        res.status(403).json({ message: 'Not authorized' });
        return;
      }
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, shop: shop._id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOne({ owner: req.user!.id });
      if (!shop) {
        res.status(403).json({ message: 'Not authorized' });
        return;
      }
      await Product.findOneAndDelete({ _id: req.params.id, shop: shop._id });
      res.status(200).json({ message: 'Product removed' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public toggleAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOne({ owner: req.user!.id });
      if (!shop) {
        res.status(403).json({ message: 'Not authorized' });
        return;
      }
      const product = await Product.findOne({ _id: req.params.id, shop: shop._id });
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      product.isAvailable = !product.isAvailable;
      await product.save();
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const productController = new ProductController();
