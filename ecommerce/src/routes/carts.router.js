import { Router } from "express";
import CartController from "../controllers/cartController.js";

const cartsRouter = Router();

const cartController = new CartController();

cartsRouter.post("/", (req, res) => cartController.createCart(req, res));
cartsRouter.get("/:cid", (req, res) => cartController.listCartProducts(req, res));
cartsRouter.post("/:cid/products/:pid", (req, res) => cartController.addProductToCart(req, res));
cartsRouter.delete("/:cid/products/:pid", (req, res) => cartController.deleteProductFromCart(req, res));
cartsRouter.put("/:cid", (req, res) => cartController.updateCart(req, res));
cartsRouter.put("/:cid/products/:pid", (req, res) => cartController.updateProductQuantityInCart(req, res));
cartsRouter.delete("/:cid", (req, res) => cartController.deleteAllProductsFromCart(req, res));

export default cartsRouter;
