import { Request, Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/auth.middleware';
import Shop from '../models/Shop';

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.create({ ...req.body, customer: req.user!.id, status: 'PENDING' });
    res.status(201).json(order);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ customer: req.user!.id }).populate('shop', 'name').sort('-createdAt');
    res.json(orders);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const getShopOrders = async (req: AuthRequest, res: Response) => {
  try {
    const shop = await Shop.findOne({ owner: req.user!.id });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const orders = await Order.find({ shop: shop._id }).populate('customer','name').sort('-createdAt');
    res.json(orders);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const acceptOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'ACCEPTED' }, { new: true });
    res.json(order);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const rejectOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'REJECTED' }, { new: true });
    res.json(order);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const getShopStats = async (req: AuthRequest, res: Response) => {
  try {
    const shop = await Shop.findOne({ owner: req.user!.id });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const orders = await Order.find({ shop: shop._id });
    const revenue = orders.filter((o: any) => o.status === 'DELIVERED').reduce((sum: number, o: any) => sum + o.totalAmount, 0);
    const activeOrders = orders.filter((o: any) => ['PENDING','ACCEPTED'].includes(o.status)).length;
    res.json({ revenue, activeOrders, totalOrders: orders.length, lowStockCount: 0 });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validTransitions: Record<string, string[]> = {
      PENDING: ['ACCEPTED', 'REJECTED'],
      ACCEPTED: ['OUT_FOR_DELIVERY'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
    };
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!validTransitions[order.status]?.includes(status))
      return res.status(400).json({ message: `Invalid transition: ${order.status} -> ${status}` });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
};
