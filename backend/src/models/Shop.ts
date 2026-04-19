import mongoose, { Document, Schema } from 'mongoose';

export interface IShop extends Document {
  owner: mongoose.Types.ObjectId;
  shopName: string;
  address: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  description: string;
  phone: string;
  imageUrl: string;
  createdAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    isOpen: { type: Boolean, default: true },
    description: { type: String, default: '' },
    phone: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

export default mongoose.model<IShop>('Shop', ShopSchema);
