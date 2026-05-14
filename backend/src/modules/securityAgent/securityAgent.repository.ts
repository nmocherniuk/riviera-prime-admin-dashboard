import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export async function createSecurityAgent(
  data: Prisma.SecurityAgentsUncheckedCreateInput,
) {
  return prisma.securityAgents.create({ data });
}

export async function findSecurityAgentsByOrganizationId(
  organizationId?: string,
) {
  if (organizationId) {
    return prisma.securityAgents.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
  return prisma.securityAgents.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findSecurityAgentById(id: string) {
  return prisma.securityAgents.findUnique({ where: { id } });
}

export async function updateSecurityAgent(
  id: string,
  data: Prisma.SecurityAgentsUncheckedUpdateInput,
) {
  return prisma.securityAgents.update({
    where: { id },
    data,
  });
}

export async function deleteSecurityAgentById(id: string) {
  return prisma.securityAgents.delete({ where: { id } });
}
