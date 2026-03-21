import {
  Typography,
  TextField,
  Grid,
  Box,
  Button,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { Driver } from "../../data/dummyDrivers";
import BaseModal from "../../../../../components/BaseModal";
import {
  modalTextFieldSx,
  sectionLabelSx,
  valueBoxSx,
} from "../../../../../components/ui/modalStyles";
import DetailField from "../../../../../components/DetailField";

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
  readOnly?: boolean;
  onSave?: (driverId: string, values: DriverFormValues) => void;
};

export default function DriverManagementModal({
  open,
  onClose,
  driver,
  readOnly = false,
  onSave,
}: Props) {
  const [formValues, setFormValues] =
    useState<DriverFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(driverToFormValues(driver));
  }, [driver, open]);

  const handleChange =
    (field: keyof DriverFormValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const handleSave = () => {
    if (driver) {
      onSave?.(driver.id, formValues);
      onClose();
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {readOnly ? "Driver details" : "Driver Management"}
          </Typography>
        </>
      }
      actions={
        !readOnly ? (
          <>
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
              Save changes
            </Button>
          </>
        ) : undefined
      }
    >
      <Typography sx={sectionLabelSx}>Driver ID</Typography>
      <Typography variant="body1" sx={valueBoxSx}>
        #{driver?.id ?? "—"}
      </Typography>

      <Typography sx={sectionLabelSx}>
        Driver (Personal Information)
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Name" value={formValues.name} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Name"
              placeholder="Enter name"
              value={formValues.name}
              onChange={handleChange("name")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Surname" value={formValues.surname} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Surname"
              placeholder="Enter surname"
              value={formValues.surname}
              onChange={handleChange("surname")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Phone" value={formValues.phone} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Phone"
              placeholder="Enter phone number"
              value={formValues.phone}
              onChange={handleChange("phone")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Email" value={formValues.email} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Email"
              placeholder="Enter email address"
              value={formValues.email}
              onChange={handleChange("email")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>

      <Typography sx={sectionLabelSx}>
        Vehicle (Vehicle Information)
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Type" value={formValues.vehicleType} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Type"
              placeholder="Enter vehicle type"
              value={formValues.vehicleType}
              onChange={handleChange("vehicleType")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Vehicle" value={formValues.vehicle} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Vehicle"
              placeholder="Enter vehicle model"
              value={formValues.vehicle}
              onChange={handleChange("vehicle")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>

      <Typography sx={sectionLabelSx}>Earning (Earning Rates)</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Per hour" value={formValues.perHour} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Per hour"
              placeholder="Enter rate per hour"
              value={formValues.perHour}
              onChange={handleChange("perHour")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Per KM" value={formValues.perKm} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Per KM"
              placeholder="Enter rate per KM"
              value={formValues.perKm}
              onChange={handleChange("perKm")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </BaseModal>
  );
}
