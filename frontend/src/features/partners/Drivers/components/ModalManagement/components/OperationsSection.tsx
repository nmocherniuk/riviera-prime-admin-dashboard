import React, { memo, type ChangeEvent } from "react";
import {
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import DetailField from "../../../../../../components/DetailField";
import FormTextField from "../../../../../../components/form/FormTextField";
import { LANGUAGE_OPTIONS, SERVICE_TYPES } from "../constants";
import type { DriverOrganizationFormValues } from "../../../data/types";
import { commonContent } from "../../../../../../content/common";
import { driversContent, driverServiceTypeLabel } from "../../../../../../content/drivers";

const om = driversContent.organizationModal;
const op = om.operations;

type Props = {
  readOnly: boolean;
  formValues: DriverOrganizationFormValues;
  handleChange: (
    field: keyof DriverOrganizationFormValues,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const OperationsSection = ({ readOnly, formValues, handleChange }: Props) => {
  return (
    <>
      <Typography sx={sectionLabelSx}>{om.sections.operations}</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.serviceTypes.label}
              value={(formValues.serviceTypes ?? [])
                .map(driverServiceTypeLabel)
                .join(", ")}
            />
          ) : (
            <FormTextField
              field="serviceTypes"
              fullWidth
              size="small"
              select
              label={op.serviceTypes.label}
              value={formValues.serviceTypes ?? []}
              SelectProps={{ multiple: true }}
              onChange={(e) =>
                handleChange("serviceTypes")(e as ChangeEvent<HTMLInputElement>)
              }
              sx={modalTextFieldSx}
            >
              {SERVICE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {driverServiceTypeLabel(t)}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.workingHours.label}
              value={formValues.workingHours}
            />
          ) : (
            <FormTextField
              field="workingHours"
              fullWidth
              size="small"
              label={op.workingHours.label}
              value={formValues.workingHours}
              onChange={handleChange("workingHours")}
              hint={op.workingHours.helperEdit}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.languagesSpoken.label}
              value={(formValues.languagesSpoken ?? []).join(", ")}
            />
          ) : (
            <FormTextField
              field="languagesSpoken"
              fullWidth
              size="small"
              select
              label={op.languagesSpoken.label}
              value={formValues.languagesSpoken ?? []}
              SelectProps={{ multiple: true }}
              onChange={(e) =>
                handleChange("languagesSpoken")(
                  e as ChangeEvent<HTMLInputElement>,
                )
              }
              sx={modalTextFieldSx}
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={op.maxConcurrentBookings.label}
              value={formValues.maxConcurrentBookings}
            />
          ) : (
            <FormTextField
              field="maxConcurrentBookings"
              fullWidth
              size="small"
              type="number"
              label={op.maxConcurrentBookings.label}
              value={formValues.maxConcurrentBookings}
              onChange={handleChange("maxConcurrentBookings")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={op.minAdvanceBookingHours.label}
              value={formValues.minAdvanceBookingHours}
            />
          ) : (
            <FormTextField
              field="minAdvanceBookingHours"
              fullWidth
              size="small"
              type="number"
              label={op.minAdvanceBookingHours.label}
              value={formValues.minAdvanceBookingHours}
              onChange={handleChange("minAdvanceBookingHours")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={op.acceptsUrgentBookings}
              value={formValues.acceptsUrgentBookings ? commonContent.boolean.yes : commonContent.boolean.no}
            />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={formValues.acceptsUrgentBookings}
                  onChange={(e) =>
                    handleChange("acceptsUrgentBookings")(
                      e as ChangeEvent<HTMLInputElement>,
                    )
                  }
                />
              }
              label={op.acceptsUrgentBookings}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={op.support247}
              value={formValues.support24_7 ? commonContent.boolean.yes : commonContent.boolean.no}
            />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={formValues.support24_7}
                  onChange={(e) =>
                    handleChange("support24_7")(
                      e as ChangeEvent<HTMLInputElement>,
                    )
                  }
                />
              }
              label={op.support247}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.cancellationPolicy.label}
              value={formValues.cancellationPolicy}
            />
          ) : (
            <FormTextField
              field="cancellationPolicy"
              fullWidth
              size="small"
              label={op.cancellationPolicy.label}
              value={formValues.cancellationPolicy}
              onChange={handleChange("cancellationPolicy")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.specialConditionsNotes.label}
              value={formValues.specialConditionsNotes}
            />
          ) : (
            <FormTextField
              field="specialConditionsNotes"
              fullWidth
              size="small"
              label={op.specialConditionsNotes.label}
              value={formValues.specialConditionsNotes}
              onChange={handleChange("specialConditionsNotes")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default memo(OperationsSection);
