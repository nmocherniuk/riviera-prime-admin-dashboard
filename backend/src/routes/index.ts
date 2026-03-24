import { Router } from "express";
import authRoutes from "./auth.routes.js";
import driverRoutes from "./driver.routes.js";
import organizationRoutes from "./organization.routes.js";
import pricingRoutes from "./pricing.routes.js";
import vehicleRoutes from "./vehicle.routes.js";

const routes = Router();

routes.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

routes.use("/auth", authRoutes);
routes.use("/organizations", organizationRoutes);
routes.use("/drivers", driverRoutes);
routes.use("/vehicles", vehicleRoutes);
routes.use("/pricing", pricingRoutes);

export default routes;
