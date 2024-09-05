import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { generateUniqueId } from "../utils/fileUtils.js";

class CartManager {
  async createCart() {
    const newCart = new Cart({id: generateUniqueId(), products: []});
    return await newCart.save();
  }

  async listCartProducts(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) throw new Error('Product not found');
    
    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return await cart.save();
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');
    
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    return await cart.save();
  }

  async updateCart(cartId, products) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    cart.products = products.map(p => ({ product: p.product, quantity: p.quantity }));
    return await cart.save();
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const product = cart.products.find(p => p.product.toString() === productId);
    if (!product) throw new Error('Product not found in cart');
    product.quantity = quantity;

    return await cart.save();
  }

  async deleteAllProductsFromCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    cart.products = [];
    return await cart.save();
  }
}

export default new CartManager();
