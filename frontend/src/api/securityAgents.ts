import type { SecurityAgent } from "../features/partners/Security/components/securityAgents/ModalManagement/securityAgentForm.types";
import { api } from "./api";

export async function listSecurityAgents(organizationId?: string) {
  const { data } = await api.get<{ agents: SecurityAgent[] }>(
    "/security-agents",
    {
      params: organizationId ? { organizationId } : {},
    },
  );
  return data.agents;
}

export async function getSecurityAgent(id: string) {
  const { data } = await api.get<{ agent: SecurityAgent }>(
    `/security-agents/${id}`,
  );
  return data.agent;
}

export async function createSecurityAgent(body: SecurityAgent) {
  const { data } = await api.post<{ agent: SecurityAgent }>(
    "/security-agents",
    body,
  );
  return data.agent;
}

export async function updateSecurityAgent(
  id: string,
  body: Record<string, unknown>,
) {
  const { data } = await api.patch<{ agent: SecurityAgent }>(
    `/security-agents/${id}`,
    body,
  );
  return data.agent;
}

export async function deleteSecurityAgent(
  id: string,
) {
  await api.delete(`/security-agents/${id}`);
}
