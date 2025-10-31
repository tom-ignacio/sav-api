import { model, Schema } from 'mongoose';

const clothesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  images: {
    type: [String],
    validate: [array => array.length >= 2, 'At least two images required']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const Clothes = model('clothes', clothesSchema);
export default Clothes;
