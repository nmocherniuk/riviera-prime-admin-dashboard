import { Router } from "express";
import { validateBody } from "../../middleware/validateBody.js";
import { validateQuery } from "../../middleware/validateQuery.js";
import { validateParams } from "../../middleware/validateParams.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationListQuerySchema,
  organizationByIdQuerySchema,
  organizationIdParamsSchema,
} from "./organization.schemas.js";
import {
  createOrganizationController,
  listOrganizationsController,
  getOrganizationByIdController,
  updateOrganizationController,
  deleteOrganizationController,
} from "./organization.controller.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  validateBody(createOrganizationSchema),
  createOrganizationController,
);

router.get(
  "/",
  requireAuth,
  validateQuery(organizationListQuerySchema),
  listOrganizationsController,
);

router.get(
  "/:id",
  requireAuth,
  validateParams(organizationIdParamsSchema),
  validateQuery(organizationByIdQuerySchema),
  getOrganizationByIdController,
);

router.patch(
  "/:id",
  requireAuth,
  validateParams(organizationIdParamsSchema),
  validateQuery(organizationByIdQuerySchema),
  validateBody(updateOrganizationSchema),
  updateOrganizationController,
);

router.delete(
  "/:id",
  requireAuth,
  validateParams(organizationIdParamsSchema),
  validateQuery(organizationByIdQuerySchema),
  deleteOrganizationController,
);

export default router;
