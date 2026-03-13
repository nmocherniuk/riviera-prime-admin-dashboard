import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Grid,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { Booking } from "../data/dummyBookings";

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const sectionLabelSx = {
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: 1,
    color: "text.secondary",
    textTransform: "uppercase" as const,
    mb: 1.5,
    mt: 2,
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "rgba(255,255,255,0.04)",
      "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
      "&.Mui-focused": { bgcolor: "rgba(255,255,255,0.06)" },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: fullScreen ? 0 : 3,
          maxHeight: fullScreen ? "100%" : "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
          py: 1.5,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            {booking ? "Edit Booking" : "New Booking"}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2, overflowY: "auto" }}>
        <Typography sx={sectionLabelSx}>Booking ID</Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            py: 1.25,
            px: 1.5,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: "rgba(255,255,255,0.04)",
          }}
        >
          #{booking?.id ?? "—"}
        </Typography>

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
              sx={textFieldSx}
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
              sx={textFieldSx}
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
              sx={textFieldSx}
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
              sx={textFieldSx}
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
              sx={textFieldSx}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
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
        </Box>
      </DialogContent>
    </Dialog>
  );
}
