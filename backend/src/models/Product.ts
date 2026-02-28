import mongoose, { Schema, Document } from 'mongoose';
export interface IProduct extends Document {
  shop: mongoose.Types.ObjectId;
  name: string; price: number; stockQuantity: number;
  category: string; unit: string; imageUrl?: string; isAvailable: boolean;
}
const ProductSchema = new Schema<IProduct>({
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  unit: { type: String, default: '1 unit' },
  imageUrl: String,
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model<IProduct>('Product', ProductSchema);
