import {
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState, useEffect } from "react";
import {
  sectionLabelSx,
  valueBoxSx,
  modalTextFieldSx,
} from "../../../../components/ui/modalStyles";
import DetailField from "../../../../components/DetailField";
import BaseModal from "../../../../components/BaseModal";
import {
  defaultFormValues,
  FLEET_CLASSES,
  FLEET_STATUSES,
  type FleetFormValues,
  type FleetVehicle,
} from "./fleetManagementForm.types";
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

  const handleBindingOrgSelect =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const organizationId = e.target.value;
      setFormValues((prev) => {
        const next = [...prev.driverBindings];
        const row = next[index];
        let driverId = row.driverId;
        if (
          driverId &&
          !drivers.some(
            (d) => d.id === driverId && d.organizationId === organizationId,
          )
        ) {
          driverId = "";
        }
        next[index] = { ...row, organizationId, driverId };
        return { ...prev, driverBindings: next };
      });
    };

  const handleBindingDriverSelect =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const driverId = e.target.value;
      setFormValues((prev) => {
        const next = [...prev.driverBindings];
        if (!driverId) {
          next[index] = { ...next[index], driverId: "" };
          return { ...prev, driverBindings: next };
        }
        const taken = new Set<string>();
        prev.driverBindings.forEach((b, i) => {
          if (i !== index && b.driverId) taken.add(b.driverId);
        });
        const org = next[index].organizationId;
        const d = drivers.find((x) => x.id === driverId);
        if (!d || (org && d.organizationId !== org) || taken.has(driverId)) {
          return prev;
        }
        next[index] = { ...next[index], driverId };
        return { ...prev, driverBindings: next };
      });
    };

  const addBindingRow = () => {
    setFormValues((prev) => ({
      ...prev,
      driverBindings: [
        ...prev.driverBindings,
        { organizationId: "", driverId: "" },
      ],
    }));
  };

  const removeBindingRow = (index: number) => {
    setFormValues((prev) => {
      if (prev.driverBindings.length <= 1) return prev;
      return {
        ...prev,
        driverBindings: prev.driverBindings.filter((_, i) => i !== index),
      };
    });
  };

  const renderDriverMenuItems = (rowIndex: number) => {
    const row = formValues.driverBindings[rowIndex];
    const taken = new Set<string>();
    formValues.driverBindings.forEach((b, i) => {
      if (i !== rowIndex && b.driverId) taken.add(b.driverId);
    });
    return drivers
      .filter(
        (d) => !row.organizationId || d.organizationId === row.organizationId,
      )
      .filter((d) => d.id === row.driverId || !taken.has(d.id))
      .map((driver) => (
        <MenuItem key={driver.id} value={driver.id}>
          {driver.name}
        </MenuItem>
      ));
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
              onClick={() =>
                void Promise.resolve(onSave?.(vehicle?.id ?? null, formValues))
              }
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
      {readOnly ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {formValues.driverBindings.map((row, index) => (
            <Box key={`binding-row-${index}`}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DetailField
                    label="Organization (optional)"
                    value={
                      organizations.find((o) => o.id === row.organizationId)
                        ?.name ??
                      (row.organizationId || "—")
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DetailField
                    label="Driver (optional)"
                    value={
                      row.driverId
                        ? (drivers.find((d) => d.id === row.driverId)?.name ??
                          row.driverId)
                        : "—"
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {formValues.driverBindings.map((row, index) => (
            <Box key={`binding-${index}`}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="Organization (optional)"
                    value={row.organizationId}
                    onChange={handleBindingOrgSelect(index)}
                    helperText={
                      index === 0 && !organizations.length
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
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="Driver (optional)"
                    value={row.driverId}
                    onChange={handleBindingDriverSelect(index)}
                    sx={modalTextFieldSx}
                  >
                    <MenuItem value="">
                      <em>Not assigned</em>
                    </MenuItem>
                    {renderDriverMenuItems(index)}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
            onClick={addBindingRow}
          >
            Add organization &amp; driver
          </Button>
        </Box>
      )}
    </BaseModal>
  );
}
