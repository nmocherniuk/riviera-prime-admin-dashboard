import {
  Typography,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { Booking } from "./BookingsCalendar/data/dummyBookings";
import { sectionLabelSx, modalTextFieldSx } from "../../../components/ui/modalStyles";
import DetailField from "../../../components/DetailField";
import BaseModal from "../../../components/BaseModal";

export type BookingFormValues = {
  date: string;
  startTime: string;
  duration: string;
  clientName: string;
  route: string;
};

const defaultFormValues: BookingFormValues = {
  date: "",
  startTime: "",
  duration: "",
  clientName: "",
  route: "",
};

function bookingToFormValues(booking: Booking | null): BookingFormValues {
  if (!booking) return defaultFormValues;
  return {
    date: booking.date || "",
    startTime: booking.startTime || "",
    duration: booking.duration || "",
    clientName: booking.clientName || "",
    route: booking.route || "",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSave?: (bookingId: string | null, values: BookingFormValues) => void;
};

export default function BookingManagementModal({
  open,
  onClose,
  booking,
  onSave,
}: Props) {
  const [formValues, setFormValues] = useState<BookingFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(bookingToFormValues(booking));
  }, [booking, open]);

  const handleChange = (field: keyof BookingFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave?.(booking?.id ?? null, formValues);
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            {booking ? "Edit Booking" : "New Booking"}
          </Typography>
        </>
      }
      actions={
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleSave}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 2,
            }}
          >
            {booking ? "Save Booking" : "Create Booking"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.dark",
                bgcolor: "rgba(212, 175, 53, 0.08)",
              },
            }}
          >
            Cancel
          </Button>
        </>
      }
    >
      <DetailField label="Booking ID" value={booking ? `#${booking.id}` : "—"} emptyAsDash={false} />

      <Typography sx={sectionLabelSx}>Booking Details</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Date"
            placeholder="YYYY-MM-DD"
            type="date"
            value={formValues.date}
            onChange={handleChange("date")}
            InputLabelProps={{ shrink: true }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Start time"
            placeholder="HH:mm"
            type="time"
            value={formValues.startTime}
            onChange={handleChange("startTime")}
            InputLabelProps={{ shrink: true }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            label="Duration"
            placeholder="e.g. 1hr, 1hr 30min"
            value={formValues.duration}
            onChange={handleChange("duration")}
            sx={modalTextFieldSx}
          />
        </Grid>
      </Grid>

      <Typography sx={sectionLabelSx}>Client & Route</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Client name"
            placeholder="Enter client name"
            value={formValues.clientName}
            onChange={handleChange("clientName")}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Route"
            placeholder="Enter pickup and destination"
            value={formValues.route}
            onChange={handleChange("route")}
            sx={modalTextFieldSx}
          />
        </Grid>
      </Grid>
    </BaseModal>
  );
}
