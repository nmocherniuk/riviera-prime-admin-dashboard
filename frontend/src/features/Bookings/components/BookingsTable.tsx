import { Typography } from "@mui/material";
import type { Booking } from "./BookingsCalendar/data/dummyBookings";
import { GenericTable } from "../../../components/GenericTable";

type Props = {
  bookings: Booking[];
};

function formatDateTime(date: string, time: string): string {
  const dateObj = new Date(`${date}T${time}:00`);
  if (Number.isNaN(dateObj.getTime())) return `${date} ${time}`;
  return dateObj.toLocaleString();
}

function getTripState(booking: Booking): {
  label: string;
  color: string;
} {
  if (booking.status === "assigned" && booking.paymentStatus === "paid") {
    return { label: "Confirmed", color: "#22C55E" };
  }
  if (booking.status === "assigned" && booking.paymentStatus !== "paid") {
    return { label: "Waiting for payment", color: "#F59E0B" };
  }
  if (booking.status === "pending") {
    return { label: "Awaiting driver action", color: "#6B7280" };
  }
  return { label: booking.status ?? "Unknown", color: "#6B7280" };
}

export default function BookingsTable({ bookings }: Props) {
  const columns = [
    {
      key: "clientName",
      label: "Client Name",
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
          {booking.clientName}
        </Typography>
      ),
    },
    {
      key: "vehicleId",
      label: "Vehicle ID",
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {booking.vehicleId ?? "N/A"}
        </Typography>
      ),
    },
    {
      key: "driver",
      label: "Driver",
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {booking.driverName ?? booking.driverId ?? "Unassigned"}
        </Typography>
      ),
    },
    {
      key: "dateTime",
      label: "Date & Time",
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {formatDateTime(booking.date, booking.startTime)}
        </Typography>
      ),
    },
    {
      key: "tripState",
      label: "Trip State",
      render: (booking: Booking) => {
        const state = getTripState(booking);
        return (
          <Typography variant="body2" sx={{ color: state.color, fontWeight: 700 }}>
            {state.label}
          </Typography>
        );
      },
    },
  ];

  return (
    <GenericTable
      title="Bookings"
      columns={columns}
      data={bookings}
      withPagination={{ pageSize: 6 }}
    />
  );
}
