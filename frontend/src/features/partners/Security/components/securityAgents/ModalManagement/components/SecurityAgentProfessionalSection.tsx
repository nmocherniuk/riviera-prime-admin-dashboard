import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import DetailField from "../../../../../../../components/DetailField";
import FormTextField from "../../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";
import { memo } from "react";
import type { SecurityAgentFormValues } from "../securityAgentForm.types";
import { EMPLOYMENT_STATUS_OPTIONS, PHYSICAL_LEVEL_OPTIONS } from "../constants";
import { securityAgentContent } from "../../../../../../../content/securityAgent";
import { commonContent } from "../../../../../../../content/common";

const pr = securityAgentContent.modal.professional;

const PRO_FLAG_KEYS = [
  "hasVipExperience",
  "hasEventExperience",
  "hasDriverLicenseB",
  "hasFirstAidTraining",
  "weaponExperience",
  "readyForTravel",
  "readyForNightShifts",
] as const satisfies readonly (keyof SecurityAgentFormValues)[];

type Props = {
  readOnly: boolean;
  formValues: SecurityAgentFormValues;
  onChange: <K extends keyof SecurityAgentFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SecurityAgentProfessionalSection({
  readOnly,
  formValues,
  onChange,
}: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>{pr.sectionTitle}</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={pr.employmentStatus.label}
              value={
                EMPLOYMENT_STATUS_OPTIONS.find(
                  (o) => o.value === formValues.employmentStatus,
                )?.label ?? "—"
              }
            />
          ) : (
            <FormTextField
              field="employmentStatus"
              fullWidth
              size="small"
              select
              label={pr.employmentStatus.label}
              value={formValues.employmentStatus}
              onChange={onChange("employmentStatus")}
              sx={modalTextFieldSx}
            >
              {EMPLOYMENT_STATUS_OPTIONS.map((o) => (
                <MenuItem key={o.value || "empty"} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={pr.physicalLevel.label}
              value={
                PHYSICAL_LEVEL_OPTIONS.find(
                  (o) => o.value === formValues.physicalLevel,
                )?.label ?? "—"
              }
            />
          ) : (
            <FormTextField
              field="physicalLevel"
              fullWidth
              size="small"
              select
              label={pr.physicalLevel.label}
              value={formValues.physicalLevel}
              onChange={onChange("physicalLevel")}
              sx={modalTextFieldSx}
            >
              {PHYSICAL_LEVEL_OPTIONS.map((o) => (
                <MenuItem key={o.value || "empty"} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={pr.professionalCardNumber.label}
              value={formValues.professionalCardNumber}
            />
          ) : (
            <FormTextField
              field="professionalCardNumber"
              fullWidth
              size="small"
              label={pr.professionalCardNumber.label}
              value={formValues.professionalCardNumber}
              onChange={onChange("professionalCardNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={pr.cnapsNumber.label} value={formValues.cnapsNumber} />
          ) : (
            <FormTextField
              field="cnapsNumber"
              fullWidth
              size="small"
              label={pr.cnapsNumber.label}
              value={formValues.cnapsNumber}
              onChange={onChange("cnapsNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={pr.cardIssuedAt.label} value={formValues.cardIssuedAt} />
          ) : (
            <FormTextField
              field="cardIssuedAt"
              fullWidth
              size="small"
              label={pr.cardIssuedAt.label}
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formValues.cardIssuedAt}
              onChange={onChange("cardIssuedAt")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={pr.cardExpiresAt.label}
              value={formValues.cardExpiresAt}
            />
          ) : (
            <FormTextField
              field="cardExpiresAt"
              fullWidth
              size="small"
              label={pr.cardExpiresAt.label}
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formValues.cardExpiresAt}
              onChange={onChange("cardExpiresAt")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={pr.specializations.label}
              value={formValues.specializations}
            />
          ) : (
            <FormTextField
              field="specializations"
              fullWidth
              size="small"
              label={pr.specializations.label}
              placeholder={pr.specializations.placeholder}
              value={formValues.specializations}
              onChange={onChange("specializations")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={pr.experienceYears.label}
              value={formValues.experienceYears}
            />
          ) : (
            <FormTextField
              field="experienceYears"
              fullWidth
              size="small"
              label={pr.experienceYears.label}
              value={formValues.experienceYears}
              onChange={onChange("experienceYears")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={pr.additionalLicenses.label}
              value={formValues.additionalLicenses}
            />
          ) : (
            <FormTextField
              field="additionalLicenses"
              fullWidth
              size="small"
              label={pr.additionalLicenses.label}
              value={formValues.additionalLicenses}
              onChange={onChange("additionalLicenses")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {PRO_FLAG_KEYS.map((key) => {
          const label = (pr.flags as Record<string, string>)[key];
          return (
          <Grid key={key} size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField
                label={label}
                value={formValues[key] ? commonContent.boolean.yes : commonContent.boolean.no}
              />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues[key]}
                    onChange={onChange(key)}
                  />
                }
                label={label}
              />
            )}
          </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default memo(SecurityAgentProfessionalSection);
