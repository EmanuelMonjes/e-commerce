import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const cartsRouter = Router();

const cartManager = new CartManager();

cartsRouter.post("/", (req, res) => cartManager.createCart(req, res));
cartsRouter.get("/:cid", (req, res) => cartManager.listCartProducts(req, res));
cartsRouter.post("/:cid/product/:pid", (req, res) => cartManager.addProductToCart(req, res));

export default cartsRouter;