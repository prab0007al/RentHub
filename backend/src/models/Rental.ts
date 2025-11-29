import mongoose, { Document, Schema } from 'mongoose';

export interface IRental extends Document {
  itemId: mongoose.Types.ObjectId;
  renterId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  depositAmount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const rentalSchema = new Schema<IRental>({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  renterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, { timestamps: true });

// Prevent double booking
rentalSchema.index({ itemId: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IRental>('Rental', rentalSchema);
