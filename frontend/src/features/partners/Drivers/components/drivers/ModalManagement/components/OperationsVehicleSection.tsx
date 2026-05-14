import { Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../../components/DetailField";
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
            <TextField
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
        {/* <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Type" value={vehicleTypeValue} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Type"
              placeholder="Enter vehicle type"
              value={formValues.vehicleType}
              onChange={onChange("vehicleType")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid> */}
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Vehicle" value={vehicleNameValue} />
          ) : (
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Rides" value={formValues.rides} />
          ) : (
            <TextField
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
            <TextField
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

