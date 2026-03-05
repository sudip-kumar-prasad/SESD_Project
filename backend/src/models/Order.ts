import mongoose, { Schema, Document } from 'mongoose';
export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId; shop: mongoose.Types.ObjectId;
  items: Array<{ product: mongoose.Types.ObjectId; quantity: number; price: number }>;
  totalAmount: number; status: string; deliveryAddress: string;
}
const OrderSchema = new Schema<IOrder>({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED','OUT_FOR_DELIVERY','DELIVERED'], default: 'PENDING' },
  deliveryAddress: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model<IOrder>('Order', OrderSchema);
