import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import {
  createDriver,
  deleteDriver,
  getDriverById,
  listDrivers,
  updateDriver,
} from "./driver.service.js";

function isPrismaKnownError(
  error: unknown,
): error is { code: string; meta?: { target?: unknown } } {
  return typeof error === "object" && error !== null && "code" in error;
}

export async function listDriversController(req: AuthedRequest, res: Response) {
  try {
    const { organizationId } = req.query as { organizationId?: string };
    const drivers = await listDrivers(organizationId);
    return res.json({ drivers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List failed";
    return res.status(500).json({ message });
  }
}

export async function getDriverByIdController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const { organizationId } = req.query as { organizationId?: string };
    const driver = await getDriverById(id, organizationId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    return res.json({ driver });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get failed";
    return res.status(500).json({ message });
  }
}

export async function createDriverController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const driver = await createDriver(req.body);
    return res.status(201).json({ driver });
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid organizationId",
      });
    }
    const message = error instanceof Error ? error.message : "Create failed";
    return res.status(500).json({ message });
  }
}

export async function updateDriverController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const { organizationId } = req.query as { organizationId?: string };
    const driver = await updateDriver(id, req.body, organizationId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    return res.json({ driver });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return res.status(500).json({ message });
  }
}

export async function deleteDriverController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const { organizationId } = req.query as { organizationId?: string };
    const deleted = await deleteDriver(id, organizationId);
    if (!deleted) {
      return res.status(404).json({ message: "Driver not found" });
    }
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return res.status(500).json({ message });
  }
}
