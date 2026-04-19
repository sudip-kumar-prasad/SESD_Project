import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  priceAtTime: number;
}

export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  shop: mongoose.Types.ObjectId;
  deliveryPartner?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtTime: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    deliveryPartner: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    deliveryAddress: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
