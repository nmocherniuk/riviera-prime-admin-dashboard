import { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import {
  bookingRouteLabel,
  isHourlyTrip,
  type Booking,
  type BookingStatus,
  type PaymentStatus,
} from "../data/dummyBookings";
import { STATUS_LABELS } from "../constants";
import { parseDurationToMinutes, addMinutesToTime } from "../../../utils/dateUtils";
import BaseModal from "../../../../../components/BaseModal";
import ConfirmDeleteDialog from "../../../../../components/ConfirmDeleteDialog";
import { bookingContent } from "../../../../../content/booking";
import { commonContent } from "../../../../../content/common";
import { vehicleClassLabelFr } from "../../../../../api/bookings";

type BookingDetailModalProps = {
  open: boolean;
  booking?: Booking | null;
  onClose: () => void;
  onCancel?: (booking: Booking) => Promise<void>;
  cancelling?: boolean;
};

function formatDateFromBooking(b: Booking): string {
  const [y, m, d] = b.date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPriceEur(price: number | null | undefined): string {
  if (price == null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function paymentStatusLabel(status: PaymentStatus | undefined): string {
  if (status === "paid") return commonContent.paymentStatus.paid;
  if (status === "unpaid") return commonContent.paymentStatus.unpaid;
  return "—";
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}

export function BookingDetailModal({
  open,
  booking = null,
  onClose,
  onCancel,
  cancelling = false,
}: BookingDetailModalProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const hourly = booking ? isHourlyTrip(booking.tripType) : false;
  const endTime =
    booking && hourly
      ? addMinutesToTime(
          booking.startTime,
          booking.durationMin ?? parseDurationToMinutes(booking.duration),
        )
      : null;
  const timeStr = booking
    ? hourly && endTime
      ? `${booking.startTime} – ${endTime}`
      : booking.startTime
    : "";
  const canCancel =
    Boolean(onCancel && booking) &&
    booking?.status !== "cancelled" &&
    booking?.status !== "completed";

  const handleConfirmCancel = async () => {
    if (!booking || !onCancel) return;
    await onCancel(booking);
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <BaseModal
        open={open}
        onClose={onClose}
        maxWidth="sm"
        disableAutoFocus
        title={
          <Typography component="span" variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
            {bookingContent.detailModal.title}
          </Typography>
        }
        actions={
          <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%">
            {canCancel ? (
              <Button
                onClick={() => setConfirmOpen(true)}
                variant="outlined"
                color="error"
                disabled={cancelling}
              >
                {bookingContent.detailModal.cancelTrip}
              </Button>
            ) : null}
            <Button onClick={onClose} variant="contained" color="primary">
              {bookingContent.detailModal.close}
            </Button>
          </Stack>
        }
      >
        {booking ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <DetailRow label={bookingContent.detailModal.date} value={formatDateFromBooking(booking)} />
            <DetailRow label={bookingContent.detailModal.time} value={timeStr} />
            {hourly && booking.duration ? (
              <DetailRow label={bookingContent.detailModal.duration} value={booking.duration} />
            ) : null}
            <DetailRow label={bookingContent.detailModal.client} value={booking.clientName} />
            {booking.clientPhone ? (
              <DetailRow label={bookingContent.detailModal.phone} value={booking.clientPhone} />
            ) : null}
            {booking.clientEmail ? (
              <DetailRow label={bookingContent.detailModal.email} value={booking.clientEmail} />
            ) : null}
            <DetailRow
              label={bookingContent.detailModal.route}
              value={bookingRouteLabel(booking)}
            />
            <DetailRow label={bookingContent.detailModal.vehicle} value={booking.car || "—"} />
            {booking.vehicleClass ? (
              <DetailRow
                label={bookingContent.detailModal.vehicleClass}
                value={vehicleClassLabelFr(booking.vehicleClass)}
              />
            ) : null}
            <DetailRow
              label={bookingContent.detailModal.price}
              value={formatPriceEur(booking.totalPrice)}
            />
            {booking.notesForDriver ? (
              <DetailRow label={bookingContent.detailModal.notes} value={booking.notesForDriver} />
            ) : null}
            <DetailRow
              label={bookingContent.detailModal.paymentStatus}
              value={paymentStatusLabel(booking.paymentStatus)}
            />
            <DetailRow
              label={bookingContent.detailModal.driver}
              value={booking.driverName || bookingContent.detailModal.noDriver}
            />
            <DetailRow
              label={bookingContent.detailModal.status}
              value={STATUS_LABELS[(booking.status ?? "assigned") as BookingStatus] ?? booking.status ?? "—"}
            />
          </Box>
        ) : null}
      </BaseModal>

      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title={bookingContent.detailModal.cancelConfirmTitle}
        message={bookingContent.detailModal.cancelConfirmMessage}
        confirmLabel={bookingContent.detailModal.cancelConfirmAction}
        cancelLabel={bookingContent.detailModal.cancelDismiss}
      />
    </>
  );
}
