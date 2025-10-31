import { model, Schema, Types } from 'mongoose';

const sizeSchema = new Schema({
  clothesId: {
    type: Types.ObjectId,
    ref: 'clothes',
    required: true
  },
  description: {
    type: String, // e.g., "S", "M", "L", "XL"
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

sizeSchema.index({ clothesId: 1, description: 1 }, { unique: true });

const Size = model('size', sizeSchema);
export default Size;
