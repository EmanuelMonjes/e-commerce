import path from "path";
import { __dirname, readFile, writeFile, generateUniqueId } from "../utils/fileUtils.js";

const data_path = path.join(__dirname, "../data/carts.json");

class CartController {
  constructor() {
    this.filePath = data_path;
  }

  async _readFile() {
    return await readFile(this.filePath);
  }

  async _writeFile(data) {
    await writeFile(this.filePath, data);
  }

  async createCart(req, res) {
    const carts = await this._readFile();
    const newCart = {
      id: generateUniqueId(),
      products: [],
    };
    carts.push(newCart);
    await this._writeFile(carts);
    res.status(201).json(newCart);
  }

  async listCartProducts(req, res) {
    const carts = await this._readFile();
    const cart = carts.find((cart) => cart.id === req.params.cid);
    cart ? res.json(cart.products) : res.status(404).send("Cart Not found");
  }

  async addProductToCart(req, res) {
    const carts = await this._readFile();
    const cart = carts.find((cart) => cart.id === req.params.cid);

    if (cart) {
      const productId = req.params.pid;
      const productIndex = cart.products.findIndex(
        (p) => p.product === productId
      );

      productIndex !== -1
        ? cart.products[productIndex].quantity++
        : cart.products.push({ product: productId, quantity: 1 });

      await this._writeFile(carts);
      res.json(cart.products);
    } else {
        res.status(404).json({"Error": "Cart Not Found"});
    }
  }
}

export default CartController;
