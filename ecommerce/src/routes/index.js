import { Router } from "express";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import viewsRouter from "./views.router.js";

const routes = Router();

routes.use("/products", productsRouter);
routes.use("/carts", cartsRouter);
routes.use("/views", viewsRouter);

export default routes;