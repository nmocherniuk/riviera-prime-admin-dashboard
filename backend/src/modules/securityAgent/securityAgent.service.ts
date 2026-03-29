import type { Prisma } from "../../generated/prisma/client.js";
import {
  createSecurityAgent as createRepo,
  deleteSecurityAgentById,
  findSecurityAgentById,
  findSecurityAgentsByOrganizationId,
  updateSecurityAgent as updateRepo,
} from "./securityAgent.repository.js";

export async function listSecurityAgents(organizationId?: string) {
  const data = await findSecurityAgentsByOrganizationId(organizationId);
  return data;
}

export async function getSecurityAgentById(id: string) {
  const data = await findSecurityAgentById(id);
  if (!data) return null;

  return data;
}

export async function createSecurityAgent(
  body: Prisma.SecurityAgentsUncheckedCreateInput,
) {
  const data = await createRepo(body);

  return data;
}

export async function updateSecurityAgent(
  id: string,
  body: Prisma.SecurityAgentsUncheckedUpdateInput,
) {
  const data = await findSecurityAgentById(id);

  if (!data) return null;

  const updated = await updateRepo(id, body);

  return updated;
}

export async function deleteSecurityAgent(id: string) {
  const data = await findSecurityAgentById(id);

  if (!data) return null;

  await deleteSecurityAgentById(id);

  return true;
}
