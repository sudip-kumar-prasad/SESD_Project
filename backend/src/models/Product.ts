import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  shop: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  category: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' },
    stockQuantity: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
    category: { type: String, default: 'General' },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
