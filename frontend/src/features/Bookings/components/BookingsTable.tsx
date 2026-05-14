import { Typography } from "@mui/material";
import type { Booking } from "./BookingsCalendar/data/dummyBookings";
import { GenericTable } from "../../../components/GenericTable";
import { bookingContent } from "../../../content/booking";
import { commonContent } from "../../../content/common";

type Props = {
  bookings: Booking[];
};

function formatDateTime(date: string, time: string): string {
  const dateObj = new Date(`${date}T${time}:00`);
  if (Number.isNaN(dateObj.getTime())) return `${date} ${time}`;
  return dateObj.toLocaleString("fr-FR");
}

function getTripState(booking: Booking): {
  label: string;
  color: string;
} {
  if (booking.status === "assigned" && booking.paymentStatus === "paid") {
    return { label: bookingContent.tripState.confirmed, color: "#22C55E" };
  }
  if (booking.status === "assigned" && booking.paymentStatus !== "paid") {
    return {
      label: bookingContent.tripState.waitingForPayment,
      color: "#F59E0B",
    };
  }
  if (booking.status === "pending") {
    return {
      label: bookingContent.tripState.awaitingDriverAction,
      color: "#6B7280",
    };
  }
  return {
    label: booking.status ?? bookingContent.tripState.unknown,
    color: "#6B7280",
  };
}

export default function BookingsTable({ bookings }: Props) {
  const columns = [
    {
      key: "clientName",
      label: bookingContent.table.clientName,
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
          {booking.clientName}
        </Typography>
      ),
    },
    {
      key: "vehicleId",
      label: bookingContent.table.vehicleId,
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {booking.vehicleId ?? commonContent.notApplicable}
        </Typography>
      ),
    },
    {
      key: "driver",
      label: bookingContent.table.driver,
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {booking.driverName ?? booking.driverId ?? commonContent.unassigned}
        </Typography>
      ),
    },
    {
      key: "dateTime",
      label: bookingContent.table.dateTime,
      render: (booking: Booking) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {formatDateTime(booking.date, booking.startTime)}
        </Typography>
      ),
    },
    {
      key: "tripState",
      label: bookingContent.table.tripState,
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
      title={bookingContent.table.title}
      columns={columns}
      data={bookings}
      withPagination={{ pageSize: 6 }}
    />
  );
}
