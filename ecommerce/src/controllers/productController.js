import { generateUniqueId } from "../utils/fileUtils.js";
import ProductManager from "../managers/productManager.js";

class ProductController {

  async listProducts(req, res) {
    try {
      const { limit, page, sort, query } = req.query;

      const result = await ProductManager.listProducts({ limit, page, sort, query });
      const { docs: products, totalProducts, totalPages, page: currentPage, hasPrevPage, hasNextPage } = result;
      
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const buildLink = (pageNum) => {
        const params = [];
        if (limit !== undefined) params.push(`limit=${limit}`);
        if (pageNum !== undefined) params.push(`page=${pageNum}`);
        if (sort !== undefined) params.push(`sort=${sort}`);
        if (query !== undefined) params.push(`query=${query}`);
        return `${baseUrl}?${params.join('&')}`;
      };

      res.json({
        status: 'success',
        payload: products,
        totalProducts,
        totalPages,
        prevPage: hasPrevPage ? currentPage - 1 : null,
        nextPage: hasNextPage ? currentPage + 1 : null,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? buildLink(currentPage - 1) : null,
        nextLink: hasNextPage ? buildLink(currentPage + 1) : null,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async listProduct(req, res) {
    try {
      const { pid } = req.params;
      const product = await ProductManager.getProductById(pid);
      if (!product) {
        return res.status(404).json({ error: "Product Not Found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
  
  async addProduct(req, res) {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send("All fields except thumbnails are required");
    }

    const productData = {
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

    try {
      const result = await ProductManager.addProduct(productData);
      res.status(201).json(result.product);
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { pid } = req.params;
      const updateData = req.body;

      const updatedProduct = await ProductManager.updateProduct(pid, updateData);
  
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product Not Found" });
      }
  
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const result = await ProductManager.deleteProduct(pid);
      console.log(result);
      
      if (!result) {
        return res.status(404).json({ error: "Product Not Found" });
      }
  
      res.json({ success: "Product Deleted" });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default ProductController;
