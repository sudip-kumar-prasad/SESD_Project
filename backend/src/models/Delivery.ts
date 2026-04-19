import mongoose, { Document, Schema } from 'mongoose';

export type DeliveryStatus = 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';

export interface IDelivery extends Document {
  order: mongoose.Types.ObjectId;
  partner: mongoose.Types.ObjectId;
  status: DeliveryStatus;
  pickupTime?: Date;
  deliveryTime?: Date;
  otp: string;
  createdAt: Date;
}

const DeliverySchema = new Schema<IDelivery>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    partner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['ASSIGNED', 'PICKED_UP', 'DELIVERED'],
      default: 'ASSIGNED',
    },
    pickupTime: { type: Date },
    deliveryTime: { type: Date },
    otp: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

export default mongoose.model<IDelivery>('Delivery', DeliverySchema);
