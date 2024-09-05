import { Router } from "express";

const viewsRouter = Router();

viewsRouter.get("/realtimeproducts", (req, res) => res.render("realTimeProducts"));
viewsRouter.get("/", (req, res) => res.render("home"));

export default viewsRouter;
