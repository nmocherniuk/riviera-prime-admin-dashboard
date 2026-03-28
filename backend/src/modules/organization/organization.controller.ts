import type { Response } from "express";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  listOrganizations,
  updateOrganization,
} from "./organization.service.js";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import { isPrismaUniqueViolation } from "./organization.utils.js";


export async function createOrganizationController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const org = await createOrganization(req.body);
    return res.status(201).json({ organization: org });
  } catch (error) {
    if (isPrismaUniqueViolation(error)) {
      const target = error.meta?.target;
      const field =
        Array.isArray(target) && target.length > 0
          ? String(target[0])
          : "field";
      return res.status(409).json({
        message: `Organization with this ${field} already exists`,
      });
    }
    const message = error instanceof Error ? error.message : "Create failed";
    return res.status(500).json({ message });
  }
}

export async function listOrganizationsController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { type } = req.query as { type: "CHAUFFEUR" | "SECURITY" };
    const organizations = await listOrganizations(type);
    return res.json({ organizations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List failed";
    console.error("listOrganizationsController error", error);
    return res.status(500).json({ message });
  }
}

export async function getOrganizationByIdController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };

    const organization = await getOrganizationById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    return res.json({ organization });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get failed";
    return res.status(500).json({ message });
  }
}

export async function updateOrganizationController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const organization = await updateOrganization(id, req.body);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    return res.json({ organization });
  } catch (error) {
    if (isPrismaUniqueViolation(error)) {
      const target = error.meta?.target;
      const field =
        Array.isArray(target) && target.length > 0
          ? String(target[0])
          : "field";
      return res.status(409).json({
        message: `Organization with this ${field} already exists`,
      });
    }
    const message = error instanceof Error ? error.message : "Update failed";
    return res.status(500).json({ message });
  }
}

export async function deleteOrganizationController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };

    const deleted = await deleteOrganization(id);

    if (!deleted) {
      return res.status(404).json({ message: "Organization not found" });
    }

    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return res.status(500).json({ message });
  }
}
