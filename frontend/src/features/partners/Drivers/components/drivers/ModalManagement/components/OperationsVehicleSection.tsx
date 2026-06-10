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
import { commonContent } from "../../../../../../../content/common";
import { driverAgentsContent } from "../../../../../../../content/driverAgents";

const o = driverAgentsContent.modal.operations;

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
      <Typography sx={sectionLabelSx}>{o.sectionTitle}</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.vehicleId.label} value={vehicleIdValue} />
          ) : (
            <FormTextField
              field="vehicle"
              fullWidth
              size="small"
              label={o.vehicleIdOptional.label}
              placeholder={o.vehicleIdOptional.placeholder}
              value={formValues.vehicle}
              onChange={onChange("vehicle")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.vehicle.label} value={vehicleNameValue} />
          ) : (
            <FormTextField
              field="vehicle"
              fullWidth
              size="small"
              label={o.vehicle.label}
              placeholder={o.vehicle.placeholder}
              value={formValues.vehicle}
              onChange={onChange("vehicle")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.vehiclePlate.label} value={formValues.vehiclePlate} />
          ) : (
            <FormTextField
              field="vehiclePlate"
              fullWidth
              size="small"
              label={o.vehiclePlate.label}
              value={formValues.vehiclePlate}
              onChange={onChange("vehiclePlate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.vehicleColor.label} value={formValues.vehicleColor} />
          ) : (
            <FormTextField
              field="vehicleColor"
              fullWidth
              size="small"
              label={o.vehicleColor.label}
              value={formValues.vehicleColor}
              onChange={onChange("vehicleColor")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.baseCity.label} value={formValues.baseCity} />
          ) : (
            <FormTextField
              field="baseCity"
              fullWidth
              size="small"
              label={o.baseCity.label}
              value={formValues.baseCity}
              onChange={onChange("baseCity")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.workingRadiusKm.label} value={formValues.workingRadiusKm} />
          ) : (
            <FormTextField
              field="workingRadiusKm"
              fullWidth
              size="small"
              type="number"
              label={o.workingRadiusKm.label}
              value={formValues.workingRadiusKm}
              onChange={onChange("workingRadiusKm")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={o.availabilityDays.label}
              value={formValues.availabilityDays}
            />
          ) : (
            <FormTextField
              field="availabilityDays"
              fullWidth
              size="small"
              label={o.availabilityDays.label}
              value={formValues.availabilityDays}
              onChange={onChange("availabilityDays")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.availabilityHours.label} value={formValues.availabilityHours} />
          ) : (
            <FormTextField
              field="availabilityHours"
              fullWidth
              size="small"
              label={o.availabilityHours.label}
              value={formValues.availabilityHours}
              onChange={onChange("availabilityHours")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={o.status.label}
              value={formValues.status ? commonContent.status.active : commonContent.status.inactive}
            />
          ) : (
            <FormTextField
              field="status"
              select
              fullWidth
              size="small"
              label={o.status.label}
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
              <MenuItem value="active">{commonContent.status.active}</MenuItem>
              <MenuItem value="inactive">{commonContent.status.inactive}</MenuItem>
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.rides.label} value={formValues.rides} />
          ) : (
            <FormTextField
              field="rides"
              fullWidth
              size="small"
              type="number"
              label={o.rides.label}
              value={formValues.rides}
              onChange={onChange("rides")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={o.todayShift.label} value={formValues.todayShift} />
          ) : (
            <FormTextField
              field="todayShift"
              fullWidth
              size="small"
              label={o.todayShift.label}
              value={formValues.todayShift}
              onChange={onChange("todayShift")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {OPERATION_BOOLEAN_FIELDS.map((f) => (
          <Grid key={f.key} size={{ xs: 12, md: 4 }}>
            {readOnly ? (
              <DetailField
                label={f.label}
                value={formValues[f.key] ? commonContent.boolean.yes : commonContent.boolean.no}
              />
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
