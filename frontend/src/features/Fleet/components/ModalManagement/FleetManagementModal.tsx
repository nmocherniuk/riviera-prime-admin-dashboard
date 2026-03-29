import { Typography, TextField, Grid, Button, MenuItem } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useMemo } from "react";
import {
  sectionLabelSx,
  valueBoxSx,
  modalTextFieldSx,
} from "../../../../components/ui/modalStyles";
import DetailField from "../../../../components/DetailField";
import BaseModal from "../../../../components/BaseModal";
import { defaultFormValues, FLEET_CLASSES, FLEET_STATUSES, type FleetFormValues, type FleetVehicle } from "./fleetManagementForm.types";
import { fleetToFormValues } from "./fleetManagementForm.mapper";
import { FLEET_STATUS_LABELS } from "../../data/dummyFleet";

type Props = {
  open: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
  readOnly?: boolean;
  organizations: Array<{ id: string; name: string }>;
  drivers: Array<{ id: string; name: string; organizationId: string }>;
  onSave?: (
    vehicleId: string | null,
    values: FleetFormValues,
  ) => void | Promise<void>;
};

export default function FleetManagementModal({
  open,
  onClose,
  vehicle,
  readOnly = false,
  organizations,
  drivers,
  onSave,
}: Props) {
  const [formValues, setFormValues] =
    useState<FleetFormValues>(defaultFormValues);
  useEffect(() => {
    setFormValues(fleetToFormValues(vehicle));
  }, [vehicle, open]);

  const handleChange =
    (field: keyof FleetFormValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const selectedOrganization = useMemo(
    () => organizations.find((o) => o.id === formValues.organizationId) ?? null,
    [organizations, formValues.organizationId],
  );

  const selectedDriver = useMemo(
    () => drivers.find((d) => d.id === formValues.driverId) ?? null,
    [drivers, formValues.driverId],
  );

  const handleOrganizationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const organizationId = e.target.value;
    setFormValues((prev) => {
      const stillValidDriver = drivers.some(
        (d) => d.id === prev.driverId && d.organizationId === organizationId,
      );
      return {
        ...prev,
        organizationId,
        driverId: stillValidDriver ? prev.driverId : "",
      };
    });
  };

  const handleDriverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const driverId = e.target.value;
    const driver = drivers.find((d) => d.id === driverId);
    setFormValues((prev) => ({
      ...prev,
      driverId,
      organizationId: driver ? driver.organizationId : prev.organizationId,
    }));
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
            {readOnly
              ? "Fleet details"
              : vehicle
                ? "Edit Fleet"
                : "Add New Fleet"}
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
              onClick={() => void Promise.resolve(onSave?.(vehicle?.id ?? null, formValues))}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2,
              }}
            >
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
            <TextField
              fullWidth
              size="small"
              label="Vehicle name"
              placeholder="Enter vehicle name"
              value={formValues.vehicleName}
              onChange={handleChange("vehicleName")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Year" value={formValues.year} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Year"
              placeholder="e.g. 2024"
              value={formValues.year}
              onChange={handleChange("year")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Color" value={formValues.color} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Color"
              placeholder="Enter vehicle color"
              value={formValues.color}
              onChange={handleChange("color")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="License plate"
              value={formValues.licensePlate}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="License plate"
              placeholder="Enter license plate"
              value={formValues.licensePlate}
              onChange={handleChange("licensePlate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Class"
              value={formValues.class}
              emptyAsDash={false}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Class"
              value={formValues.class}
              onChange={handleChange("class")}
              sx={modalTextFieldSx}
            >
              {FLEET_CLASSES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Status"
              value={FLEET_STATUS_LABELS[formValues.status]}
              emptyAsDash={false}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Status"
              value={formValues.status}
              onChange={handleChange("status")}
              sx={modalTextFieldSx}
            >
              {FLEET_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {FLEET_STATUS_LABELS[s]}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
      </Grid>
      <Typography sx={sectionLabelSx}>Entity binding</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Organization"
              value={
                selectedOrganization
                  ? selectedOrganization.name
                  : formValues.organizationId
              }
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Organization (optional)"
              value={formValues.organizationId}
              onChange={handleOrganizationSelect}
              helperText={
                !organizations.length && !readOnly
                  ? "No chauffeur organizations yet — create one in Partners first"
                  : ""
              }
              sx={modalTextFieldSx}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Driver"
              value={selectedDriver ? selectedDriver.name : formValues.driverId}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Driver (optional)"
              value={formValues.driverId}
              onChange={handleDriverSelect}
              sx={modalTextFieldSx}
            >
              <MenuItem value="">Not assigned</MenuItem>
              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
      </Grid>
    </BaseModal>
  );
}
