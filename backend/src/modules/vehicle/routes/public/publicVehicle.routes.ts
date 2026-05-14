import { Router } from "express";
import { validateQuery } from "../../../../middleware/validateQuery.js";
import { publicVehicleListQuerySchema } from "../../../booking/booking.validation.js";
import { listPublicVehiclesController } from "../../controllers/public/publicVehicle.controller.js";

const router = Router();

router.get("/vehicles", validateQuery(publicVehicleListQuerySchema), listPublicVehiclesController);

export default router;
