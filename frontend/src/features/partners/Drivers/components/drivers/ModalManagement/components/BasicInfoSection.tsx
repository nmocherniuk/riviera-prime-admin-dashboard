import { Grid, TextField, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
  valueBoxSx,
} from "../../../../../../../components/ui/modalStyles";
import type {
  DriverFormValues,
  DriverModalFormOnChange,
} from "../driverManagementForm.types";

type Props = {
  readOnly: boolean;
  driverId?: string;
  formValues: DriverFormValues;
  onChange: DriverModalFormOnChange;
};

function BasicInfoSection({ readOnly, driverId, formValues, onChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Driver ID</Typography>
      <Typography variant="body1" sx={valueBoxSx}>
        #{driverId ?? "—"}
      </Typography>

      <Typography sx={sectionLabelSx}>Basic Information</Typography>
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
              onChange={onChange("name")}
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
              onChange={onChange("phone")}
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
              onChange={onChange("email")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Address" value={formValues.address} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Address"
              value={formValues.address}
              onChange={onChange("address")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Nationality" value={formValues.nationality} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Nationality"
              value={formValues.nationality}
              onChange={onChange("nationality")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Birth Date" value={formValues.birthDate} />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Birth date"
              InputLabelProps={{ shrink: true }}
              value={formValues.birthDate}
              onChange={onChange("birthDate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Languages (comma separated)"
              value={formValues.languages}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Languages (comma separated)"
              value={formValues.languages}
              onChange={onChange("languages")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Emergency contact"
              value={formValues.emergencyContact}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Emergency contact"
              value={formValues.emergencyContact}
              onChange={onChange("emergencyContact")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(BasicInfoSection);

