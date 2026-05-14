import { Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";

import { PROFESSIONAL_BOOLEAN_FIELDS } from "../constants";
import type { DriverFormValues } from "../../types";

type Props = {
  readOnly: boolean;
  formValues: DriverFormValues;
  onChange: <K extends keyof DriverFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function ProfessionalSection({ readOnly, formValues, onChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Professional</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Employment status"
              value={formValues.employmentStatus || "—"}
            />
          ) : (
            <TextField
              select
              fullWidth
              size="small"
              label="Employment status"
              value={formValues.employmentStatus}
              onChange={onChange("employmentStatus")}
              sx={modalTextFieldSx}
            >
              <MenuItem value="">Not set</MenuItem>
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
              <MenuItem value="FREELANCE">Freelance</MenuItem>
              <MenuItem value="SUBCONTRACTOR">Subcontractor</MenuItem>
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="VTC card number" value={formValues.vtcCardNumber} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="VTC card number"
              value={formValues.vtcCardNumber}
              onChange={onChange("vtcCardNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="License number" value={formValues.driverLicenseNumber} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="License number"
              value={formValues.driverLicenseNumber}
              onChange={onChange("driverLicenseNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="License category" value={formValues.licenseCategory} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="License category"
              value={formValues.licenseCategory}
              onChange={onChange("licenseCategory")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Experience years" value={formValues.drivingExperienceYears} />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Experience years"
              value={formValues.drivingExperienceYears}
              onChange={onChange("drivingExperienceYears")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Language level" value={formValues.languageLevel} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Language level"
              value={formValues.languageLevel}
              onChange={onChange("languageLevel")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {PROFESSIONAL_BOOLEAN_FIELDS.map((f) => (
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

export default memo(ProfessionalSection);

