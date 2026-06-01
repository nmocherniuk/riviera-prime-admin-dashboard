import {
  Typography,
  Grid,
  Button,
  MenuItem,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import FormTextField from "../../../../components/form/FormTextField";
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
import { fleetClassLabel, vehiclesContent } from "../../../../content/vehicles";
import { FormFieldErrorsProvider } from "../../../../components/form/FormFieldErrorsProvider";
import type { FieldErrors } from "../../../../utils/formErrors";

type Props = {
  open: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
  readOnly?: boolean;
  organizations: Array<{ id: string; name: string }>;
  drivers: Array<{ id: string; name: string; organizationId: string }>;
  fieldErrors?: FieldErrors;
  onClearFieldError?: (field: string) => void;
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
  fieldErrors = {},
  onClearFieldError,
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
      onClearFieldError?.(field);
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleBindingOrgSelect =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onClearFieldError?.(`driverBindings.${index}.organizationId`);
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
      onClearFieldError?.(`driverBindings.${index}.driverId`);
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
              ? vehiclesContent.modal.titles.readOnly
              : vehicle
                ? vehiclesContent.modal.titles.edit
                : vehiclesContent.modal.titles.create}
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
              {vehiclesContent.modal.cancel}
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
              {vehicle
                ? vehiclesContent.modal.submitSave
                : vehiclesContent.modal.submitAdd}
            </Button>
          </>
        ) : undefined
      }
    >
      <FormFieldErrorsProvider
        fieldErrors={fieldErrors}
        onClearField={onClearFieldError}
      >
      <Typography sx={sectionLabelSx}>
        {vehiclesContent.modal.sections.vehicleId}
      </Typography>
      <Typography variant="body1" sx={valueBoxSx}>
        #{vehicle?.id ?? vehiclesContent.table.emptyValue}
      </Typography>

      <Typography sx={sectionLabelSx}>
        {vehiclesContent.modal.sections.vehicleInformation}
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.vehicleName.label}
              value={formValues.vehicleName}
            />
          ) : (
            <FormTextField
              field="vehicleName"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.vehicleName.label}
              placeholder={vehiclesContent.modal.fields.vehicleName.placeholder}
              value={formValues.vehicleName}
              onChange={handleChange("vehicleName")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.year.label}
              value={formValues.year}
            />
          ) : (
            <FormTextField
              field="year"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.year.label}
              placeholder={vehiclesContent.modal.fields.year.placeholder}
              value={formValues.year}
              onChange={handleChange("year")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.color.label}
              value={formValues.color}
            />
          ) : (
            <FormTextField
              field="color"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.color.label}
              placeholder={vehiclesContent.modal.fields.color.placeholder}
              value={formValues.color}
              onChange={handleChange("color")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.licensePlate.label}
              value={formValues.licensePlate}
            />
          ) : (
            <FormTextField
              field="licensePlate"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.licensePlate.label}
              placeholder={vehiclesContent.modal.fields.licensePlate.placeholder}
              value={formValues.licensePlate}
              onChange={handleChange("licensePlate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.imageUrl.label}
              value={formValues.imageUrl}
            />
          ) : (
            <FormTextField
              field="imageUrl"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.imageUrl.label}
              placeholder={vehiclesContent.modal.fields.imageUrl.placeholder}
              value={formValues.imageUrl}
              onChange={handleChange("imageUrl")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.description.label}
              value={formValues.description}
            />
          ) : (
            <FormTextField
              field="description"
              fullWidth
              multiline
              minRows={2}
              size="small"
              label={vehiclesContent.modal.fields.description.label}
              placeholder={vehiclesContent.modal.fields.description.placeholder}
              value={formValues.description}
              onChange={handleChange("description")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.class.label}
              value={fleetClassLabel(formValues.class)}
              emptyAsDash={false}
            />
          ) : (
            <FormTextField
              field="class"
              fullWidth
              size="small"
              select
              label={vehiclesContent.modal.fields.class.label}
              value={formValues.class}
              onChange={handleChange("class")}
              sx={modalTextFieldSx}
            >
              {FLEET_CLASSES.map((c) => (
                <MenuItem key={c} value={c}>
                  {fleetClassLabel(c)}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.status.label}
              value={FLEET_STATUS_LABELS[formValues.status]}
              emptyAsDash={false}
            />
          ) : (
            <FormTextField
              field="status"
              fullWidth
              size="small"
              select
              label={vehiclesContent.modal.fields.status.label}
              value={formValues.status}
              onChange={handleChange("status")}
              sx={modalTextFieldSx}
            >
              {FLEET_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {FLEET_STATUS_LABELS[s]}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.passengers.label}
              value={formValues.passengers}
            />
          ) : (
            <FormTextField
              field="passengers"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.passengers.label}
              type="number"
              inputProps={{ min: 1 }}
              value={formValues.passengers}
              onChange={handleChange("passengers")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.baggageCount.label}
              value={formValues.baggageCount}
            />
          ) : (
            <FormTextField
              field="baggageCount"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.baggageCount.label}
              type="number"
              inputProps={{ min: 0 }}
              value={formValues.baggageCount}
              onChange={handleChange("baggageCount")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.vehicleType.label}
              value={formValues.vehicleType}
            />
          ) : (
            <FormTextField
              field="vehicleType"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.vehicleType.label}
              placeholder={vehiclesContent.modal.fields.vehicleType.placeholder}
              value={formValues.vehicleType}
              onChange={handleChange("vehicleType")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.transmission.label}
              value={formValues.transmission}
            />
          ) : (
            <FormTextField
              field="transmission"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.transmission.label}
              placeholder={vehiclesContent.modal.fields.transmission.placeholder}
              value={formValues.transmission}
              onChange={handleChange("transmission")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.interior.label}
              value={formValues.interior}
            />
          ) : (
            <FormTextField
              field="interior"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.interior.label}
              placeholder={vehiclesContent.modal.fields.interior.placeholder}
              value={formValues.interior}
              onChange={handleChange("interior")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={vehiclesContent.modal.fields.amenitiesText.label}
              value={formValues.amenitiesText}
            />
          ) : (
            <FormTextField
              field="amenitiesText"
              fullWidth
              size="small"
              label={vehiclesContent.modal.fields.amenitiesText.label}
              placeholder={vehiclesContent.modal.fields.amenitiesText.placeholder}
              value={formValues.amenitiesText}
              onChange={handleChange("amenitiesText")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
      <Typography sx={sectionLabelSx}>
        {vehiclesContent.modal.sections.entityBinding}
      </Typography>
      {readOnly ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {formValues.driverBindings.map((row, index) => (
            <Box key={`binding-row-${index}`}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DetailField
                    label={
                      vehiclesContent.modal.fields.organizationOptional.label
                    }
                    value={
                      organizations.find((o) => o.id === row.organizationId)
                        ?.name ??
                      (row.organizationId || "—")
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DetailField
                    label={vehiclesContent.modal.fields.driverOptional.label}
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
                  <FormTextField
                    field={`driverBindings.${index}.organizationId`}
                    fullWidth
                    size="small"
                    select
                    label={
                      vehiclesContent.modal.fields.organizationOptional.label
                    }
                    value={row.organizationId}
                    onChange={handleBindingOrgSelect(index)}
                    helperText={
                      index === 0 && !organizations.length
                        ? vehiclesContent.modal.binding.noOrganizationsHelper
                        : ""
                    }
                    sx={modalTextFieldSx}
                  >
                    <MenuItem value="">
                      <em>{vehiclesContent.modal.binding.none}</em>
                    </MenuItem>
                    {organizations.map((org) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </FormTextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    field={`driverBindings.${index}.driverId`}
                    fullWidth
                    size="small"
                    select
                    label={vehiclesContent.modal.fields.driverOptional.label}
                    value={row.driverId}
                    onChange={handleBindingDriverSelect(index)}
                    sx={modalTextFieldSx}
                  >
                    <MenuItem value="">
                      <em>{vehiclesContent.modal.binding.notAssigned}</em>
                    </MenuItem>
                    {renderDriverMenuItems(index)}
                  </FormTextField>
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
            {vehiclesContent.modal.binding.addOrgAndDriver}
          </Button>
        </Box>
      )}
      </FormFieldErrorsProvider>
    </BaseModal>
  );
}
