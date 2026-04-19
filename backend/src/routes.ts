import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import adminBookingRoutes from "./modules/booking/routes/admin/booking.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import driverRoutes from "./modules/driver/driver.routes.js";
import organizationRoutes from "./modules/organization/organization.routes.js";
import pricingRoutes from "./modules/pricing/pricing.routes.js";
import vehicleRoutes from "./modules/vehicle/vehicle.routes.js";
import securityAgentRoutes from "./modules/securityAgent/securityAgent.routes.js";
import whatsappRoutes from "./modules/whatsapp/whatsapp.routes.js";
import publicBookingRoutes from "./modules/booking/routes/public/publicBooking.routes.js";
import publicPaymentRoutes from "./modules/payments/routes/public/publicPayment.routes.js";
import paymentsRoutes from "./modules/payments/routes/admin/payments.routes.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { validateQuery } from "./middleware/validateQuery.js";
import { driverBookingsGroupedQuerySchema } from "./modules/booking/booking.validation.js";
import { listDriverBookingsGroupedController } from "./modules/booking/controllers/admin/booking.controller.js";

const routes = Router();

routes.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

routes.use("/public", publicBookingRoutes);
routes.use("/public", publicPaymentRoutes);
routes.use("/auth", authRoutes);
routes.use("/organizations", organizationRoutes);
routes.use("/drivers", driverRoutes);
routes.use("/security-agents", securityAgentRoutes);
routes.use("/vehicles", vehicleRoutes);
routes.use("/pricing", pricingRoutes);
routes.use("/payments", paymentsRoutes);
routes.use("/bookings", adminBookingRoutes);
routes.get(
  "/driver/bookings",
  requireAuth,
  validateQuery(driverBookingsGroupedQuerySchema),
  listDriverBookingsGroupedController,
);
routes.use("/dashboard", dashboardRoutes);
routes.use("/webhook/whatsapp", whatsappRoutes);

export default routes;
