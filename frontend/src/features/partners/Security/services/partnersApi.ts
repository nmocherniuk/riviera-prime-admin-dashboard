/**
 * Placeholder for Security Partners API integration.
 * Replace with real API calls when backend is ready.
 */

import type { Partner, Bodyguard } from "../data/types";

export async function fetchPartners(): Promise<Partner[]> {
  // TODO: replace with actual API call, e.g. GET /api/security-partners
  return [];
}

export async function fetchPartnerById(id: string): Promise<Partner | null> {
  // TODO: GET /api/security-partners/:id
  return null;
}

export async function createPartner(data: Omit<Partner, "id">): Promise<Partner> {
  // TODO: POST /api/security-partners
  return { ...data, id: "" };
}

export async function updatePartner(id: string, data: Partial<Partner>): Promise<Partner> {
  // TODO: PATCH /api/security-partners/:id
  return { id, ...data } as Partner;
}

export async function deletePartner(id: string): Promise<void> {
  // TODO: DELETE /api/security-partners/:id
}

export async function fetchBodyguardsByPartnerId(partnerId: string): Promise<Bodyguard[]> {
  // TODO: GET /api/security-partners/:partnerId/bodyguards
  return [];
}

export async function createBodyguard(partnerId: string, data: Omit<Bodyguard, "id" | "partnerId">): Promise<Bodyguard> {
  // TODO: POST /api/security-partners/:partnerId/bodyguards
  return { ...data, id: "", partnerId };
}

export async function updateBodyguard(id: string, data: Partial<Bodyguard>): Promise<Bodyguard> {
  // TODO: PATCH /api/security-partners/bodyguards/:id
  return { id, ...data } as Bodyguard;
}

export async function deleteBodyguard(id: string): Promise<void> {
  // TODO: DELETE /api/security-partners/bodyguards/:id
}
