import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description: string;
  category: string;
  pricePerDay: number;
  deposit: number;
  images: string[];
  ownerId: mongoose.Types.ObjectId;
  location: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  availability: boolean;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  pricePerDay: { type: Number, required: true, min: 0 },
  deposit: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  availability: { type: Boolean, default: true },
  condition: { 
    type: String, 
    enum: ['new', 'like-new', 'good', 'fair'],
    required: true 
  },
  tags: [{ type: String }]
}, { timestamps: true });

// Index for search and filtering
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1, availability: 1 });

export default mongoose.model<IItem>('Item', itemSchema);
