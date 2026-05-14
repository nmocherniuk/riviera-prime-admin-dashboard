import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { validateParams } from "../../middleware/validateParams.js";
import { validateQuery } from "../../middleware/validateQuery.js";
import {
  createSecurityAgentSchema,
  securityAgentByIdQuerySchema,
  securityAgentIdParamsSchema,
  securityAgentListQuerySchema,
  updateSecurityAgentSchema,
} from "./securityAgent.schemas.js";
import {
  createSecurityAgentController,
  deleteSecurityAgentController,
  getSecurityAgentByIdController,
  listSecurityAgentsController,
  updateSecurityAgentController,
} from "./securityAgent.controller.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  validateQuery(securityAgentListQuerySchema),
  listSecurityAgentsController,
);
router.get(
  "/:id",
  requireAuth,
  validateParams(securityAgentIdParamsSchema),
  validateQuery(securityAgentByIdQuerySchema),
  getSecurityAgentByIdController,
);
router.post(
  "/",
  requireAuth,
  validateBody(createSecurityAgentSchema),
  createSecurityAgentController,
);
router.patch(
  "/:id",
  requireAuth,
  validateParams(securityAgentIdParamsSchema),
  validateQuery(securityAgentByIdQuerySchema),
  validateBody(updateSecurityAgentSchema),
  updateSecurityAgentController,
);
router.delete(
  "/:id",
  requireAuth,
  validateParams(securityAgentIdParamsSchema),
  validateQuery(securityAgentByIdQuerySchema),
  deleteSecurityAgentController,
);

export default router;
