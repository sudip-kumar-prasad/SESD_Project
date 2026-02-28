import mongoose, { Schema, Document } from 'mongoose';
export interface IShop extends Document {
  owner: mongoose.Types.ObjectId;
  name: string; address: string; isOpen: boolean; imageUrl?: string;
}
const ShopSchema = new Schema<IShop>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  isOpen: { type: Boolean, default: true },
  imageUrl: String,
}, { timestamps: true });
export default mongoose.model<IShop>('Shop', ShopSchema);
