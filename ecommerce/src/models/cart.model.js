import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Product',
      },
      quantity: {
        type: Number,
        min: 1,
        default: 1,
      },
    },
  ],
}, {
  timestamps: true,  
});

const Cart = mongoose.model('Cart', cartSchema, 'carts');

export default Cart;
