import {
  Typography,
  TextField,
  Grid,
  Box,
  Button,
  MenuItem,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { FleetVehicle, FleetClass, FleetStatus } from "../data/dummyFleet";
import { sectionLabelSx, valueBoxSx, modalTextFieldSx } from "../../../components/ui/modalStyles";
import DetailField from "../../../components/DetailField";
import BaseModal from "../../../components/BaseModal";

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
  readOnly?: boolean;
  onSave?: (vehicleId: string | null, values: FleetFormValues) => void;
};

const FLEET_CLASSES: FleetClass[] = ["Comfort", "Business", "Van"];
const FLEET_STATUSES: FleetStatus[] = ["AVAILABLE", "ON TRIP"];

export default function FleetManagementModal({
  open,
  onClose,
  vehicle,
  readOnly = false,
  onSave,
}: Props) {
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

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            {readOnly ? "Fleet details" : vehicle ? "Edit Fleet" : "Add New Fleet"}
          </Typography>
        </>
      }
      actions={
        !readOnly ? (
          <>
            <Button variant="outlined" startIcon={<CloseIcon />} onClick={onClose} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "primary.main", color: "primary.main", "&:hover": { borderColor: "primary.dark", bgcolor: "rgba(212, 175, 53, 0.08)" } }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleSave} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, px: 2 }}>
              {vehicle ? "Save Fleet" : "Add Fleet"}
            </Button>
          </>
        ) : undefined
      }
    >
      <Typography sx={sectionLabelSx}>Vehicle ID</Typography>
      <Typography variant="body1" sx={valueBoxSx}>
        #{vehicle?.id ?? "—"}
      </Typography>

      <Typography sx={sectionLabelSx}>Vehicle Information</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Vehicle name" value={formValues.vehicleName} />
          ) : (
            <TextField fullWidth size="small" label="Vehicle name" placeholder="Enter vehicle name" value={formValues.vehicleName} onChange={handleChange("vehicleName")} sx={modalTextFieldSx} />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Year & color" value={formValues.yearColor} />
          ) : (
            <TextField fullWidth size="small" label="Year & color" placeholder="e.g. 2024 Black Metallic" value={formValues.yearColor} onChange={handleChange("yearColor")} sx={modalTextFieldSx} />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="License plate" value={formValues.licensePlate} />
          ) : (
            <TextField fullWidth size="small" label="License plate" placeholder="Enter license plate" value={formValues.licensePlate} onChange={handleChange("licensePlate")} sx={modalTextFieldSx} />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Class" value={formValues.class} emptyAsDash={false} />
          ) : (
            <TextField fullWidth size="small" select label="Class" value={formValues.class} onChange={handleChange("class")} sx={modalTextFieldSx}>
              {FLEET_CLASSES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Status" value={formValues.status} emptyAsDash={false} />
          ) : (
            <TextField fullWidth size="small" select label="Status" value={formValues.status} onChange={handleChange("status")} sx={modalTextFieldSx}>
              {FLEET_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Next service" value={formValues.nextService} />
          ) : (
            <TextField fullWidth size="small" label="Next service" placeholder="e.g. Oct 12, 2026" value={formValues.nextService} onChange={handleChange("nextService")} sx={modalTextFieldSx} />
          )}
        </Grid>
      </Grid>
    </BaseModal>
  );
}
