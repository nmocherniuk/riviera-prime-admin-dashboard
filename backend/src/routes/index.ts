import { Router } from "express";
import authRoutes from "./auth.routes.js";
import bookingRoutes from "./booking.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import driverRoutes from "./driver.routes.js";
import organizationRoutes from "./organization.routes.js";
import pricingRoutes from "./pricing.routes.js";
import vehicleRoutes from "./vehicle.routes.js";
import securityAgentRoutes from "./securityAgent.routes.js";
import whatsappRoutes from "./whatsapp.routes.js";
import publicBookingRoutes from "./publicBooking.routes.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { driverBookingsGroupedQuerySchema } from "../modules/booking/booking.schemas.js";
import { listDriverBookingsGroupedController } from "../modules/booking/booking.controller.js";

const routes = Router();

routes.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

routes.use("/public", publicBookingRoutes);
routes.use("/auth", authRoutes);
routes.use("/organizations", organizationRoutes);
routes.use("/drivers", driverRoutes);
routes.use("/security-agents", securityAgentRoutes);
routes.use("/vehicles", vehicleRoutes);
routes.use("/pricing", pricingRoutes);
routes.use("/bookings", bookingRoutes);
routes.get(
  "/driver/bookings",
  requireAuth,
  validateQuery(driverBookingsGroupedQuerySchema),
  listDriverBookingsGroupedController,
);
routes.use("/dashboard", dashboardRoutes);
routes.use("/webhook/whatsapp", whatsappRoutes);

export default routes;
