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
import type { Driver } from "../data/dummyDrivers";

export type DriverFormValues = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicle: string;
  perHour: string;
  perKm: string;
};

const defaultFormValues: DriverFormValues = {
  name: "",
  surname: "",
  phone: "",
  email: "",
  vehicleType: "",
  vehicle: "",
  perHour: "",
  perKm: "",
};

function driverToFormValues(driver: Driver | null): DriverFormValues {
  if (!driver) return defaultFormValues;
  const [name = "", ...surnameParts] = (driver.name || "").split(" ");
  return {
    name,
    surname: surnameParts.join(" ") || "",
    phone: "",
    email: "",
    vehicleType: "",
    vehicle: driver.vehicle || "",
    perHour: "",
    perKm: "",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  driver: Driver | null;
  onSave?: (driverId: string, values: DriverFormValues) => void;
};

export default function DriverManagementModal({
  open,
  onClose,
  driver,
  onSave,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formValues, setFormValues] = useState<DriverFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(driverToFormValues(driver));
  }, [driver, open]);

  const handleChange = (field: keyof DriverFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    if (driver) {
      onSave?.(driver.id, formValues);
      onClose();
    }
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
            Driver Management
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
        {/* DRIVER ID */}
        <Typography sx={sectionLabelSx}>Driver ID</Typography>
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
          #{driver?.id ?? "—"}
        </Typography>

        {/* DRIVER (Personal Information) */}
        <Typography sx={sectionLabelSx}>Driver (Personal Information)</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              placeholder="Enter name"
              value={formValues.name}
              onChange={handleChange("name")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Surname"
              placeholder="Enter surname"
              value={formValues.surname}
              onChange={handleChange("surname")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              placeholder="Enter phone number"
              value={formValues.phone}
              onChange={handleChange("phone")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              placeholder="Enter email address"
              value={formValues.email}
              onChange={handleChange("email")}
              sx={textFieldSx}
            />
          </Grid>
        </Grid>

        {/* VEHICLE */}
        <Typography sx={sectionLabelSx}>Vehicle (Vehicle Information)</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Type"
              placeholder="Enter vehicle type"
              value={formValues.vehicleType}
              onChange={handleChange("vehicleType")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Vehicle"
              placeholder="Enter vehicle model"
              value={formValues.vehicle}
              onChange={handleChange("vehicle")}
              sx={textFieldSx}
            />
          </Grid>
        </Grid>

        {/* EARNING */}
        <Typography sx={sectionLabelSx}>Earning (Earning Rates)</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Per hour"
              placeholder="Enter rate per hour"
              value={formValues.perHour}
              onChange={handleChange("perHour")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Per KM"
              placeholder="Enter rate per KM"
              value={formValues.perKm}
              onChange={handleChange("perKm")}
              sx={textFieldSx}
            />
          </Grid>
        </Grid>

        {/* Actions */}
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
            Edit Booking
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
