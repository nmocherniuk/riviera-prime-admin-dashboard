import React, { memo, type ChangeEvent } from "react";
import {
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";
import DetailField from "../../../../../../../components/DetailField";
import { LANGUAGE_OPTIONS, SERVICE_TYPES } from "../constants";
import type { DriverOrganization } from "../../../../data/types";

type Props = {
  readOnly: boolean;
  formValues: DriverOrganization;
  handleChange: (
    field: keyof DriverOrganization,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const OperationsSection = ({ readOnly, formValues, handleChange }: Props) => {
  return (
    <>
      <Typography sx={sectionLabelSx}>Operations</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Service areas"
              value={formValues.serviceAreas}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Service areas"
              value={formValues.serviceAreas}
              onChange={handleChange("serviceAreas")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Service types"
              value={(formValues.serviceTypes ?? []).join(", ")}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Service types"
              value={formValues.serviceTypes ?? []}
              SelectProps={{ multiple: true }}
              onChange={(e) =>
                handleChange("serviceTypes")(e as ChangeEvent<HTMLInputElement>)
              }
              sx={modalTextFieldSx}
            >
              {SERVICE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Working hours"
              value={formValues.workingHours}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Working hours"
              value={formValues.workingHours}
              onChange={handleChange("workingHours")}
              helperText="Example: 08:00-22:00"
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Languages spoken"
              value={(formValues.languagesSpoken ?? []).join(", ")}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Languages spoken"
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
            </TextField>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Max concurrent bookings"
              value={formValues.maxConcurrentBookings}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Max concurrent bookings"
              value={formValues.maxConcurrentBookings}
              onChange={handleChange("maxConcurrentBookings")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Min advance booking (hours)"
              value={formValues.minAdvanceBookingHours}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Min advance booking (hours)"
              value={formValues.minAdvanceBookingHours}
              onChange={handleChange("minAdvanceBookingHours")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Accept urgent bookings"
              value={formValues.acceptsUrgentBookings ? "Yes" : "No"}
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
              label="Accept urgent bookings"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Support 24/7"
              value={formValues.support24_7 ? "Yes" : "No"}
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
              label="Support 24/7"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Cancellation policy"
              value={formValues.cancellationPolicy}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Cancellation policy"
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
              label="Special conditions notes"
              value={formValues.specialConditionsNotes}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Special conditions notes"
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
