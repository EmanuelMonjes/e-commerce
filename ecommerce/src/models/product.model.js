import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
 
const productSchema = new mongoose.Schema({ 
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
  },
  thumbnails: {
    type: [String], 
  },
}, {
  timestamps: true, 
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);

export default Product;
