import type { OrganizationType } from "./organizations";

/**
 * Centralized React Query keys for cache invalidation and prefetching.
 */
export const queryKeys = {
  bookings: {
    all: ["bookings"] as const,
    list: () => [...queryKeys.bookings.all, "list"] as const,
  },
  organizations: {
    all: ["organizations"] as const,
    list: (type: OrganizationType) =>
      [...queryKeys.organizations.all, "list", type] as const,
    detail: (type: OrganizationType, id: string) =>
      [...queryKeys.organizations.all, "detail", type, id] as const,
    byId: (id: string) =>
      [...queryKeys.organizations.all, "byId", id] as const,
  },
  drivers: {
    all: ["drivers"] as const,
    list: () => [...queryKeys.drivers.all, "list"] as const,
    byOrganization: (organizationId: string) =>
      [...queryKeys.drivers.all, "byOrganization", organizationId] as const,
  },
  vehicles: {
    all: ["vehicles"] as const,
    list: (filters?: { organizationId?: string }) =>
      filters?.organizationId
        ? ([...queryKeys.vehicles.all, "list", filters.organizationId] as const)
        : ([...queryKeys.vehicles.all, "list", "all"] as const),
  },
  pricing: {
    all: ["pricing"] as const,
    list: () => [...queryKeys.pricing.all, "list"] as const,
  },
  securityAgents: {
    all: ["securityAgents"] as const,
    byOrganization: (organizationId: string) =>
      [...queryKeys.securityAgents.all, "byOrganization", organizationId] as const,
  },
} as const;
