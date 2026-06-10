import { Checkbox, FormControlLabel, Grid, MenuItem, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../../components/DetailField";
import FormTextField from "../../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";

import { PROFESSIONAL_BOOLEAN_FIELDS } from "../constants";
import type { DriverFormValues } from "../../types";
import { commonContent } from "../../../../../../../content/common";
import { driverAgentsContent } from "../../../../../../../content/driverAgents";

const m = driverAgentsContent.modal;
const p = m.professional;
const emp = driverAgentsContent.employmentStatus;

type Props = {
  readOnly: boolean;
  formValues: DriverFormValues;
  onChange: <K extends keyof DriverFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function employmentLabel(value: string | null | undefined): string {
  if (!value) return p.notSet;
  return emp[value as keyof typeof emp] ?? value;
}

function ProfessionalSection({ readOnly, formValues, onChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>{p.sectionTitle}</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={p.employmentStatus.label}
              value={employmentLabel(formValues.employmentStatus)}
            />
          ) : (
            <FormTextField
              field="employmentStatus"
              select
              fullWidth
              size="small"
              label={p.employmentStatus.label}
              value={formValues.employmentStatus}
              onChange={onChange("employmentStatus")}
              sx={modalTextFieldSx}
            >
              <MenuItem value="">{p.notSet}</MenuItem>
              <MenuItem value="EMPLOYEE">{emp.EMPLOYEE}</MenuItem>
              <MenuItem value="FREELANCE">{emp.FREELANCE}</MenuItem>
              <MenuItem value="SUBCONTRACTOR">{emp.SUBCONTRACTOR}</MenuItem>
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={p.vtcCardNumber.label} value={formValues.vtcCardNumber} />
          ) : (
            <FormTextField
              field="vtcCardNumber"
              fullWidth
              size="small"
              label={p.vtcCardNumber.label}
              value={formValues.vtcCardNumber}
              onChange={onChange("vtcCardNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={p.licenseNumber.label} value={formValues.driverLicenseNumber} />
          ) : (
            <FormTextField
              field="driverLicenseNumber"
              fullWidth
              size="small"
              label={p.licenseNumber.label}
              value={formValues.driverLicenseNumber}
              onChange={onChange("driverLicenseNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={p.licenseCategory.label} value={formValues.licenseCategory} />
          ) : (
            <FormTextField
              field="licenseCategory"
              fullWidth
              size="small"
              label={p.licenseCategory.label}
              value={formValues.licenseCategory}
              onChange={onChange("licenseCategory")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={p.experienceYears.label} value={formValues.drivingExperienceYears} />
          ) : (
            <FormTextField
              field="drivingExperienceYears"
              fullWidth
              size="small"
              type="number"
              label={p.experienceYears.label}
              value={formValues.drivingExperienceYears}
              onChange={onChange("drivingExperienceYears")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={p.languageLevel.label} value={formValues.languageLevel} />
          ) : (
            <FormTextField
              field="languageLevel"
              fullWidth
              size="small"
              label={p.languageLevel.label}
              value={formValues.languageLevel}
              onChange={onChange("languageLevel")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {PROFESSIONAL_BOOLEAN_FIELDS.map((f) => (
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

export default memo(ProfessionalSection);
