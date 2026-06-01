import { Checkbox, FormControlLabel, Grid, MenuItem, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../../components/DetailField";
import FormTextField from "../../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";

import { OPERATION_BOOLEAN_FIELDS } from "../constants";
import type { DriverFormValues } from "../../types";

type Props = {
  readOnly: boolean;
  formValues: DriverFormValues;
  onChange: <K extends keyof DriverFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  vehicleIdValue: string;
  vehicleTypeValue: string;
  vehicleNameValue: string;
};


function OperationsVehicleSection({
  readOnly,
  formValues,
  onChange,
  vehicleIdValue,
  vehicleTypeValue,
  vehicleNameValue,
}: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Operations & Vehicle</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Vehicle ID" value={vehicleIdValue} />
          ) : (
            <FormTextField
              field="vehicle"
              fullWidth
              size="small"
              label="Vehicle ID (optional)"
              placeholder="UUID vehicle id"
              value={formValues.vehicle}
              onChange={onChange("vehicle")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Vehicle" value={vehicleNameValue} />
          ) : (
            <FormTextField
              field="vehicle"
              fullWidth
              size="small"
              label="Vehicle"
              placeholder="Enter vehicle model"
              value={formValues.vehicle}
              onChange={onChange("vehicle")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Vehicle plate" value={formValues.vehiclePlate} />
          ) : (
            <FormTextField
              field="vehiclePlate"
              fullWidth
              size="small"
              label="Vehicle plate"
              value={formValues.vehiclePlate}
              onChange={onChange("vehiclePlate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Vehicle color" value={formValues.vehicleColor} />
          ) : (
            <FormTextField
              field="vehicleColor"
              fullWidth
              size="small"
              label="Vehicle color"
              value={formValues.vehicleColor}
              onChange={onChange("vehicleColor")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Base city" value={formValues.baseCity} />
          ) : (
            <FormTextField
              field="baseCity"
              fullWidth
              size="small"
              label="Base city"
              value={formValues.baseCity}
              onChange={onChange("baseCity")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Working radius (km)" value={formValues.workingRadiusKm} />
          ) : (
            <FormTextField
              field="workingRadiusKm"
              fullWidth
              size="small"
              type="number"
              label="Working radius (km)"
              value={formValues.workingRadiusKm}
              onChange={onChange("workingRadiusKm")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Availability days (comma separated)"
              value={formValues.availabilityDays}
            />
          ) : (
            <FormTextField
              field="availabilityDays"
              fullWidth
              size="small"
              label="Availability days (comma separated)"
              value={formValues.availabilityDays}
              onChange={onChange("availabilityDays")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Availability hours" value={formValues.availabilityHours} />
          ) : (
            <FormTextField
              field="availabilityHours"
              fullWidth
              size="small"
              label="Availability hours"
              value={formValues.availabilityHours}
              onChange={onChange("availabilityHours")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Status"
              value={formValues.status ? "Active" : "Inactive"}
            />
          ) : (
            <FormTextField
              field="status"
              select
              fullWidth
              size="small"
              label="Status"
              value={formValues.status ? "active" : "inactive"}
              onChange={(e) => {
                const active = e.target.value === "active";
                onChange("status")({
                  ...e,
                  target: {
                    ...e.target,
                    type: "checkbox",
                    checked: active,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              sx={modalTextFieldSx}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Rides" value={formValues.rides} />
          ) : (
            <FormTextField
              field="rides"
              fullWidth
              size="small"
              type="number"
              label="Rides"
              value={formValues.rides}
              onChange={onChange("rides")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Today shift" value={formValues.todayShift} />
          ) : (
            <FormTextField
              field="todayShift"
              fullWidth
              size="small"
              label="Today shift"
              value={formValues.todayShift}
              onChange={onChange("todayShift")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {OPERATION_BOOLEAN_FIELDS.map((f) => (
          <Grid key={f.key} size={{ xs: 12, md: 4 }}>
            {readOnly ? (
              <DetailField label={f.label} value={formValues[f.key] ? "Yes" : "No"} />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox checked={formValues[f.key]} onChange={onChange(f.key)} />
                }
                label={f.label}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default memo(OperationsVehicleSection);
