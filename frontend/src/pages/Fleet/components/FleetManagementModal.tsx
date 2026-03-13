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
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { FleetVehicle, FleetClass, FleetStatus } from "../data/dummyFleet";

export type FleetFormValues = {
  vehicleName: string;
  yearColor: string;
  licensePlate: string;
  class: FleetClass;
  status: FleetStatus;
  nextService: string;
};

const defaultFormValues: FleetFormValues = {
  vehicleName: "",
  yearColor: "",
  licensePlate: "",
  class: "Business",
  status: "AVAILABLE",
  nextService: "",
};

function fleetToFormValues(vehicle: FleetVehicle | null): FleetFormValues {
  if (!vehicle) return defaultFormValues;
  return {
    vehicleName: vehicle.vehicleName || "",
    yearColor: vehicle.yearColor || "",
    licensePlate: vehicle.licensePlate || "",
    class: vehicle.class,
    status: vehicle.status,
    nextService: vehicle.nextService || "",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
  onSave?: (vehicleId: string | null, values: FleetFormValues) => void;
};

const FLEET_CLASSES: FleetClass[] = ["Comfort", "Business", "Van"];
const FLEET_STATUSES: FleetStatus[] = ["AVAILABLE", "ON TRIP"];

export default function FleetManagementModal({
  open,
  onClose,
  vehicle,
  onSave,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formValues, setFormValues] = useState<FleetFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(fleetToFormValues(vehicle));
  }, [vehicle, open]);

  const handleChange = (field: keyof FleetFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave?.(vehicle?.id ?? null, formValues);
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
            {vehicle ? "Edit Fleet" : "Add New Fleet"}
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
        <Typography sx={sectionLabelSx}>Vehicle ID</Typography>
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
          #{vehicle?.id ?? "—"}
        </Typography>

        <Typography sx={sectionLabelSx}>Vehicle Information</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Vehicle name"
              placeholder="Enter vehicle name"
              value={formValues.vehicleName}
              onChange={handleChange("vehicleName")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Year & color"
              placeholder="e.g. 2024 Black Metallic"
              value={formValues.yearColor}
              onChange={handleChange("yearColor")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="License plate"
              placeholder="Enter license plate"
              value={formValues.licensePlate}
              onChange={handleChange("licensePlate")}
              sx={textFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Class"
              value={formValues.class}
              onChange={handleChange("class")}
              sx={textFieldSx}
            >
              {FLEET_CLASSES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Status"
              value={formValues.status}
              onChange={handleChange("status")}
              sx={textFieldSx}
            >
              {FLEET_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Next service"
              placeholder="e.g. Oct 12, 2026"
              value={formValues.nextService}
              onChange={handleChange("nextService")}
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
            {vehicle ? "Save Fleet" : "Add Fleet"}
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
