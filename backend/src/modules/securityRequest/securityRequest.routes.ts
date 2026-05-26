import { Router } from "express";
import { validateBody } from "../../middleware/validateBody.js";
import { securityRequestBodySchema } from "./securityRequest.schemas.js";
import { submitSecurityRequestController } from "./securityRequest.controller.js";

const router = Router();

router.post(
  "/",
  validateBody(securityRequestBodySchema),
  submitSecurityRequestController,
);

export default router;
