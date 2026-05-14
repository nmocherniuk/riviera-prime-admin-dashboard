import { Router } from "express";
import { requireAuth } from "../../../../middleware/requireAuth.js";
import { validateBody } from "../../../../middleware/validateBody.js";
import { validateParams } from "../../../../middleware/validateParams.js";
import { validateQuery } from "../../../../middleware/validateQuery.js";
import {
  assignDriverSchema,
  createVehicleSchema,
  updateVehicleSchema,
  vehicleIdParamsSchema,
  vehicleListQuerySchema,
} from "../../vehicle.schemas.js";
import {
  assignDriverToVehicleController,
  createVehicleController,
  deleteVehicleController,
  getVehicleByIdController,
  listVehiclesController,
  updateVehicleController,
} from "../../controllers/admin/vehicle.controller.js";

const router = Router();

router.get("/", requireAuth, validateQuery(vehicleListQuerySchema), listVehiclesController);
router.get("/:id", requireAuth, validateParams(vehicleIdParamsSchema), getVehicleByIdController);
router.post("/", requireAuth, validateBody(createVehicleSchema), createVehicleController);
router.patch(
  "/:id",
  requireAuth,
  validateParams(vehicleIdParamsSchema),
  validateBody(updateVehicleSchema),
  updateVehicleController,
);
router.patch(
  "/:id/assign-driver",
  requireAuth,
  validateParams(vehicleIdParamsSchema),
  validateBody(assignDriverSchema),
  assignDriverToVehicleController,
);
router.delete("/:id", requireAuth, validateParams(vehicleIdParamsSchema), deleteVehicleController);

export default router;
