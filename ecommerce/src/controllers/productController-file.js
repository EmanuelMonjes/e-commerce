import path from "path";
import { __dirname, readFile, writeFile, generateUniqueId } from "../utils/fileUtils.js";

const data_path = path.join(__dirname, "../data/products.json");

class ProductController {
  constructor() {
    this.filePath = data_path;
  }

  async _readFile() {
    return await readFile(this.filePath);
  }

  async _writeFile(data) {
    await writeFile(this.filePath, data);
  }

  async listProducts(req, res) {
    const products = await this._readFile();
    let { limit } = req.query;
 
    if (limit) {
      limit = parseInt(limit);
      if (isNaN(limit) || limit < 1) {
        return res.status(404).json({ Error: "Invalid limit parameter" });
      }
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  }

  async listProduct(req, res) {
    const products = await this._readFile();
    const product = products.find((prod) => prod.id === req.params.pid);

    product
      ? res.json(product)
      : res.status(404).json({ Error: "Product Not Found" });
  }

  async addProduct(req, res) {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send("All fields except thumbnails are required");
    }

    const newProduct = {
      id: generateUniqueId(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };

    const products = await this._readFile();
    products.push(newProduct);

    await this._writeFile(products);
    res.status(201).json(newProduct);
  }

  async updateProduct(req, res) {
    const products = await this._readFile();
    const index = products.findIndex((prod) => prod.id === req.params.pid);

    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      await this._writeFile(products);
      res.json(products[index]);
    } else {
      res.status(404).json({ Error: "Product Not Found" });
    }
  }

  async deleteProduct(req, res) {
    let products = await this._readFile();
    const index = products.findIndex((prod) => prod.id === req.params.pid);

    if (index !== -1) {
      products = products.filter((prod) => prod.id !== req.params.pid);
      await this._writeFile(products);
      res.json({ Success: "Product Deleted" });
    } else {
      res.status(404).json({ Error: "Product Not Found" });
    }
  }

  async addProductSocket(product) {
    const products = await this._readFile();
    const newProduct = {
      ...product,
      id: generateUniqueId(),
      status: true,
    };
    products.push(newProduct);
    await this._writeFile(products);
  }

  async deleteProductSocket(productId) {
    let products = await this._readFile();
    products = products.filter((prod) => prod.id !== productId);
    await this._writeFile(products);
  }
}

export default ProductController;
