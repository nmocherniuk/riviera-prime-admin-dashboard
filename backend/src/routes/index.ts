import { Router } from "express";
import authRoutes from "./auth.routes.js";

const routes = Router();

routes.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

routes.use("/auth", authRoutes);

export default routes;
