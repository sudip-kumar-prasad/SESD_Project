import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'customer' | 'shop_owner' | 'delivery_partner' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  address: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'shop_owner', 'delivery_partner', 'admin'],
      default: 'customer',
    },
    address: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

export default mongoose.model<IUser>('User', UserSchema);
