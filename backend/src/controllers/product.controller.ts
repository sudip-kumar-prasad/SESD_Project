import { Request, Response } from 'express';
import Product from '../models/Product';
import Shop from '../models/Shop';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getProductsByShop = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ shop: req.params.shopId, isAvailable: true });
    res.json(products);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const shop = await Shop.findOne({ owner: req.user!.id });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const product = await Product.create({ ...req.body, shop: shop._id });
    res.status(201).json(product);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const toggleProductAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isAvailable = !product.isAvailable;
    await product.save();
    res.json(product);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};
