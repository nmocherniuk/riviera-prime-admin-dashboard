import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { validateParams } from "../../middleware/validateParams.js";
import { validateQuery } from "../../middleware/validateQuery.js";
import {
  createDriverSchema,
  driverByIdQuerySchema,
  driverIdParamsSchema,
  driverListQuerySchema,
  updateDriverSchema,
} from "./driver.schemas.js";
import {
  createDriverController,
  deleteDriverController,
  getDriverByIdController,
  getDriverEarningsController,
  listDriversController,
  updateDriverController,
} from "./driver.controller.js";

const router = Router();

router.get("/", requireAuth, validateQuery(driverListQuerySchema), listDriversController);
router.get(
  "/:id",
  requireAuth,
  validateParams(driverIdParamsSchema),
  validateQuery(driverByIdQuerySchema),
  getDriverByIdController,
);
router.get(
  "/:id/earnings",
  requireAuth,
  validateParams(driverIdParamsSchema),
  validateQuery(driverByIdQuerySchema),
  getDriverEarningsController,
);
router.post("/", requireAuth, validateBody(createDriverSchema), createDriverController);
router.patch(
  "/:id",
  requireAuth,
  validateParams(driverIdParamsSchema),
  validateQuery(driverByIdQuerySchema),
  validateBody(updateDriverSchema),
  updateDriverController,
);
router.delete(
  "/:id",
  requireAuth,
  validateParams(driverIdParamsSchema),
  validateQuery(driverByIdQuerySchema),
  deleteDriverController,
);

export default router;
