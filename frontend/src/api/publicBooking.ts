import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/** No cookies — for separate landing / static sites calling the public booking API. */
const publicApi = axios.create({
  baseURL,
  withCredentials: false,
});

export type PublicVehicleClass = "comfort" | "business" | "van";

export type PublicCreateBookingBody = {
  clientName: string;
  /** Either a concrete vehicle or a class-only request (API requires at least one). */
  vehicleId?: string;
  vehicleClass?: PublicVehicleClass;
  bookingAt: string;
  clientEmail?: string;
  clientPhone?: string;
  tripType?: string;
  notesForDriver?: string;
  from?: string;
  to?: string;
  durationMin?: number;
};

export type PublicBookingDto = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  tripType: string;
  notesForDriver: string;
  vehicleId: string | null;
  vehicleName: string | null;
  vehicleClass: PublicVehicleClass | null;
  driverId: string | null;
  driverName: string | null;
  bookingAt: string;
  from: string;
  to: string;
  durationMin: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * POST /api/public/bookings — no dashboard login.
 * If backend has PUBLIC_BOOKING_API_KEY, pass the same value (e.g. via VITE_PUBLIC_BOOKING_API_KEY only for dev; production landing should call from a server or use a separate secret strategy).
 */
export async function createPublicBooking(
  body: PublicCreateBookingBody,
  options?: { publicBookingKey?: string },
): Promise<PublicBookingDto> {
  const key =
    options?.publicBookingKey ?? import.meta.env.VITE_PUBLIC_BOOKING_API_KEY;
  const headers: Record<string, string> = {};
  if (key) headers["x-public-booking-key"] = key;

  const { data } = await publicApi.post<{ booking: PublicBookingDto }>(
    "/public/bookings",
    body,
    { headers },
  );
  return data.booking;
}
