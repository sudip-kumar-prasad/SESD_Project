import { Response } from 'express';
import Order from '../models/Order';
import Shop from '../models/Shop';
import Product from '../models/Product';
import Delivery from '../models/Delivery';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getIO } from '../utils/socket';

class OrderController {
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { shopId, items, deliveryAddress } = req.body;
      
      if (!items || items.length === 0) {
        res.status(400).json({ message: 'Cart is empty' });
        return;
      }

      const orderItems = [];
      let totalAmount = 0;

      // Securely fetch prices and update inventory
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          res.status(404).json({ message: `Product ${item.productId} not found` });
          return;
        }

        if (product.stockQuantity < item.quantity) {
          res.status(400).json({ message: `Insufficient stock for ${product.name}` });
          return;
        }

        // Add to order calculation
        const price = product.price;
        totalAmount += price * item.quantity;
        
        orderItems.push({
          product: product._id,
          productName: product.name,
          quantity: item.quantity,
          priceAtTime: price
        });

        // Deduct Inventory
        product.stockQuantity -= item.quantity;
        await product.save();
      }

      const order = await Order.create({
        customer: req.user!.id,
        shop: shopId,
        items: orderItems,
        totalAmount,
        deliveryAddress,
      });

      const populated = await order.populate(['customer', 'shop']);
      const shop = await Shop.findById(shopId);
      if (shop) {
        getIO().to(`shop_${shop.owner}`).emit('new_order', populated);
      }
      res.status(201).json(populated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const orders = await Order.find({ customer: req.user!.id })
        .populate('shop', 'shopName address')
        .populate('deliveryPartner', 'name phone')
        .sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getShopOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOne({ owner: req.user!.id });
      if (!shop) {
        res.status(404).json({ message: 'Shop not found' });
        return;
      }
      const orders = await Order.find({ shop: shop._id })
        .populate('customer', 'name phone address')
        .sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public acceptOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      order.status = 'ACCEPTED';
      await order.save();
      getIO().to(`user_${order.customer}`).emit('order_accepted', { orderId: order._id });
      getIO().emit('new_delivery_request', { orderId: order._id, shopId: order.shop });
      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public rejectOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      order.status = 'REJECTED';
      await order.save();
      getIO().to(`user_${order.customer}`).emit('order_rejected', { orderId: order._id });
      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public acceptDelivery = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order || order.status !== 'ACCEPTED') {
        res.status(400).json({ message: 'Order not available for delivery' });
        return;
      }
      order.deliveryPartner = req.user!.id as any;
      await order.save();
      const delivery = await Delivery.create({
        order: order._id,
        partner: req.user!.id,
        otp: this.generateOTP(),
      });
      getIO().to(`user_${order.customer}`).emit('driver_assigned', {
        orderId: order._id,
        partnerId: req.user!.id,
      });
      const shop = await Shop.findById(order.shop);
      if (shop) getIO().to(`shop_${shop.owner}`).emit('driver_assigned', { orderId: order._id });
      res.status(200).json({ order, delivery });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateDeliveryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      const delivery = await Delivery.findOne({ order: req.params.id, partner: req.user!.id });
      if (!delivery) {
        res.status(404).json({ message: 'Delivery not found' });
        return;
      }
      delivery.status = status;
      if (status === 'PICKED_UP') delivery.pickupTime = new Date();
      if (status === 'DELIVERED') delivery.deliveryTime = new Date();
      await delivery.save();

      const order = await Order.findById(req.params.id);
      if (order) {
        if (status === 'PICKED_UP') order.status = 'OUT_FOR_DELIVERY';
        if (status === 'DELIVERED') {
          order.status = 'DELIVERED';
          order.paymentStatus = 'PAID';
        }
        await order.save();
        getIO().to(`user_${order.customer}`).emit('order_status_update', {
          orderId: order._id,
          status: order.status,
        });
        const shop = await Shop.findById(order.shop);
        if (shop)
          getIO().to(`shop_${shop.owner}`).emit('order_status_update', {
            orderId: order._id,
            status: order.status,
          });
      }
      res.status(200).json(delivery);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getAvailableDeliveries = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const orders = await Order.find({ status: 'ACCEPTED', deliveryPartner: null })
        .populate('shop', 'shopName address lat lng')
        .sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('customer', 'name phone')
        .populate('shop', 'shopName address lat lng phone')
        .populate('deliveryPartner', 'name phone');
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getShopStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const shop = await Shop.findOne({ owner: req.user!.id });
      if (!shop) {
        res.status(404).json({ message: 'Shop not found' });
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [revenueData, activeOrders, lowStockCount] = await Promise.all([
        Order.aggregate([
          { $match: { shop: shop._id, createdAt: { $gte: today }, status: { $ne: 'REJECTED' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        Order.countDocuments({ shop: shop._id, status: { $in: ['PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY'] } }),
        Product.countDocuments({ shop: shop._id, stockQuantity: { $lt: 10 } })
      ]);

      const revenue = revenueData.length > 0 ? revenueData[0].total : 0;

      res.status(200).json({
        revenue,
        activeOrders,
        lowStockCount,
        nextPayout: Math.floor(revenue * 0.95) // Example payout calculation
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getGlobalStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Basic global stats for AdminPortal
      const [totalRevenueData, totalOrders, totalShops, totalRiders] = await Promise.all([
        Order.aggregate([
          { $match: { status: 'DELIVERED' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        Order.countDocuments(),
        Shop.countDocuments(),
        Order.distinct('deliveryPartner').then(riders => riders.filter(r => r).length)
      ]);

      const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

      res.status(200).json({
        totalRevenue,
        totalOrders,
        totalShops,
        totalRiders,
        activeRiders: Math.floor(totalRiders * 0.6) // Mock active ratio
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getActiveDelivery = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const order = await Order.findOne({ 
        deliveryPartner: req.user!.id, 
        status: { $in: ['ACCEPTED', 'OUT_FOR_DELIVERY'] } 
      })
      .populate('customer', 'name phone address')
      .populate('shop', 'shopName address lat lng phone');

      if (!order) {
        res.status(200).json(null);
        return;
      }
      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const orderController = new OrderController();
