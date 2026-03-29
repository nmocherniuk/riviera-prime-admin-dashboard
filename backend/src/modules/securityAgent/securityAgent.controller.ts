import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import {
  createSecurityAgent,
  deleteSecurityAgent,
  getSecurityAgentById,
  listSecurityAgents,
  updateSecurityAgent,
} from "./securityAgent.service.js";
import { isPrismaKnownError } from "./securityAgent.utils.js";
import type { Prisma } from "../../generated/prisma/client.js";

export async function listSecurityAgentsController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { organizationId } = req.query as { organizationId?: string };

    const agents = await listSecurityAgents(organizationId);

    return res.json({ agents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List failed";
    return res.status(500).json({ message });
  }
}

export async function getSecurityAgentByIdController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };

    const agent = await getSecurityAgentById(id)

    if (!agent) {
      return res.status(404).json({ message: "Security agent not found" });
    }

    return res.json({ agent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get failed";
    return res.status(500).json({ message });
  }
}

export async function createSecurityAgentController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const data = req.body as Prisma.SecurityAgentsUncheckedCreateInput;

    const agent = await createSecurityAgent(data);

    return res.status(201).json({ agent });
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2003") {
      return res.status(400).json({ message: "Invalid organizationId" });
    }
    const message = error instanceof Error ? error.message : "Create failed";
    return res.status(500).json({ message });
  }
}

export async function updateSecurityAgentController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };

    const data = req.body as Prisma.SecurityAgentsUncheckedUpdateInput;

    const agent = await updateSecurityAgent(id, data);

    if (!agent) {
      return res.status(404).json({ message: "Security agent not found" });
    }
    return res.json({ agent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return res.status(500).json({ message });
  }
}

export async function deleteSecurityAgentController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };

    const deleted = await deleteSecurityAgent(id);

    if (!deleted) {
      return res.status(404).json({ message: "Security agent not found" });
    }
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return res.status(500).json({ message });
  }
}
