import Product from "../models/product.model.js";

class ProductManager {
  async listProducts({ limit = 10, page = 1, sort, query }) {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
    };

    const filter = {};

    if (query) {
      filter.$or = [
        { category: { $regex: query, $options: "i" } },
        { status: query.toLowerCase() === "true" }, 
      ];
    }

    const products = await Product.paginate(filter, options);

    return products;
  }

  async getProductById(pid) {
    try {
      const product = await Product.findById(pid);
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return { status: "success", product: newProduct };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Product code must be unique");
      } else {
        throw new Error(error.message);
      }
    }
  }

  async updateProduct(pid, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, {
        new: true, 
        runValidators: true, 
      });
      return updatedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(pid) {
    try {
      const result = await Product.findByIdAndDelete(pid);
      return result; 
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new ProductManager();
