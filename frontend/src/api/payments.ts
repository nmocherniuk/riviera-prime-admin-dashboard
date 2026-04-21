import { api } from "./api";

export type PaymentStatus = "paid" | "unpaid";

export type Payment = {
  id: string;
  bookingId: string;
  clientName: string;
  route: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  date: string;
  updatedAt: string;
  driverName?: string;
  vehicle?: string;
  stripeStatus?: string;
  cardLast4?: string;
  stripePaymentIntentId: string | null;
  timeline: { label: string; date: string }[];
};

export async function listPayments(): Promise<Payment[]> {
  const { data } = await api.get<{ payments: Payment[] }>("/payments");
  return data.payments;
}

export type AdminBalance = {
  availableBalance: number;
  currency: "EUR";
};

export async function getAdminBalance(): Promise<AdminBalance> {
  const { data } = await api.get<AdminBalance>("/payments/admin/balance");
  return data;
}

export async function withdrawAdminBalance(): Promise<{
  amount: number;
  currency: "EUR";
}> {
  const { data } = await api.post<{ amount: number; currency: "EUR" }>(
    "/payments/admin/withdraw",
  );
  return data;
}
