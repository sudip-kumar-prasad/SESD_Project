import mongoose, { Schema, Document } from 'mongoose';
export interface IDelivery extends Document {
  rider: mongoose.Types.ObjectId; order: mongoose.Types.ObjectId;
  status: string; location?: { lat: number; lng: number };
}
const DeliverySchema = new Schema<IDelivery>({
  rider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['ASSIGNED','PICKED_UP','DELIVERED'], default: 'ASSIGNED' },
  location: { lat: Number, lng: Number },
}, { timestamps: true });
export default mongoose.model<IDelivery>('Delivery', DeliverySchema);
