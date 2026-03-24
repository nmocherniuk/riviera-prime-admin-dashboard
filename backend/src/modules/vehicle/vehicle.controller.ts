import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import {
  assignDriverToVehicleService,
  createVehicleService,
  deleteVehicleService,
  getVehicleByIdService,
  listVehiclesService,
  updateVehicleService,
} from "./vehicle.service.js";

function isPrismaUniqueError(
  error: unknown,
): error is { code: string; meta?: { target?: unknown } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

export async function listVehiclesController(req: AuthedRequest, res: Response) {
  try {
    const { organizationId, driverId } = req.query as {
      organizationId?: string;
      driverId?: string;
    };
    const filters: { organizationId?: string; driverId?: string } = {};
    if (organizationId !== undefined) filters.organizationId = organizationId;
    if (driverId !== undefined) filters.driverId = driverId;
    const vehicles = await listVehiclesService(filters);
    return res.json({ vehicles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List failed";
    return res.status(500).json({ message });
  }
}

export async function getVehicleByIdController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const vehicle = await getVehicleByIdService(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ vehicle });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get failed";
    return res.status(500).json({ message });
  }
}

export async function createVehicleController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const vehicle = await createVehicleService(req.body);
    return res.status(201).json({ vehicle });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return res.status(409).json({ message: "Vehicle already exists" });
    }
    const message = error instanceof Error ? error.message : "Create failed";
    const code =
      message === "Organization not found" ||
      message === "Driver not found" ||
      message === "Driver does not belong to organization"
        ? 400
        : 500;
    return res.status(code).json({ message });
  }
}

export async function updateVehicleController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const vehicle = await updateVehicleService(id, req.body);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ vehicle });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return res.status(409).json({ message: "Vehicle already exists" });
    }
    const message = error instanceof Error ? error.message : "Update failed";
    const code =
      message === "Organization not found" ||
      message === "Driver not found" ||
      message === "Driver does not belong to organization"
        ? 400
        : 500;
    return res.status(code).json({ message });
  }
}

export async function assignDriverToVehicleController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const { driverId } = req.body as { driverId: string | null };
    const vehicle = await assignDriverToVehicleService(id, driverId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ vehicle });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Assign failed";
    const code =
      message === "Organization not found" ||
      message === "Driver not found" ||
      message === "Driver does not belong to organization"
        ? 400
        : 500;
    return res.status(code).json({ message });
  }
}

export async function deleteVehicleController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const deleted = await deleteVehicleService(id);
    if (!deleted) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return res.status(500).json({ message });
  }
}
