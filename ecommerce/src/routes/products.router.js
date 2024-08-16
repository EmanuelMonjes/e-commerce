import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const productsRouter = Router();

const productManager = new ProductManager();

productsRouter.get("/", (req, res) => productManager.listProducts(req, res));
productsRouter.get("/:pid", (req, res) => productManager.listProduct(req, res));
productsRouter.post("/", (req, res) => productManager.addProduct(req, res));
productsRouter.put("/:pid", (req, res) => productManager.updateProduct(req, res));
productsRouter.delete("/:pid", (req, res) => productManager.deleteProduct(req, res));

export default productsRouter;