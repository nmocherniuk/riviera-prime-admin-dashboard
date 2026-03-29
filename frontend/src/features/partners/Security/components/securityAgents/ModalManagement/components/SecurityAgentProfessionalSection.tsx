import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DetailField from "../../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";
import { memo } from "react";
import type { SecurityAgentFormValues } from "../securityAgentForm.types";
import { EMPLOYMENT_STATUS_OPTIONS, PHYSICAL_LEVEL_OPTIONS } from "../constants";

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
      <Typography sx={sectionLabelSx}>Professional</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Employment status"
              value={
                EMPLOYMENT_STATUS_OPTIONS.find(
                  (o) => o.value === formValues.employmentStatus,
                )?.label ?? "—"
              }
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Employment status"
              value={formValues.employmentStatus}
              onChange={onChange("employmentStatus")}
              sx={modalTextFieldSx}
            >
              {EMPLOYMENT_STATUS_OPTIONS.map((o) => (
                <MenuItem key={o.value || "empty"} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Physical level"
              value={
                PHYSICAL_LEVEL_OPTIONS.find(
                  (o) => o.value === formValues.physicalLevel,
                )?.label ?? "—"
              }
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Physical level"
              value={formValues.physicalLevel}
              onChange={onChange("physicalLevel")}
              sx={modalTextFieldSx}
            >
              {PHYSICAL_LEVEL_OPTIONS.map((o) => (
                <MenuItem key={o.value || "empty"} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Professional card number"
              value={formValues.professionalCardNumber}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Professional card number"
              value={formValues.professionalCardNumber}
              onChange={onChange("professionalCardNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="CNAPS number" value={formValues.cnapsNumber} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="CNAPS number"
              value={formValues.cnapsNumber}
              onChange={onChange("cnapsNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Card issued" value={formValues.cardIssuedAt} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Card issued"
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
              label="Card expires"
              value={formValues.cardExpiresAt}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Card expires"
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
              label="Specializations"
              value={formValues.specializations}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Specializations"
              placeholder="Comma-separated"
              value={formValues.specializations}
              onChange={onChange("specializations")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Experience (years)"
              value={formValues.experienceYears}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Experience (years)"
              value={formValues.experienceYears}
              onChange={onChange("experienceYears")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Additional licenses"
              value={formValues.additionalLicenses}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Additional licenses"
              value={formValues.additionalLicenses}
              onChange={onChange("additionalLicenses")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {(
          [
            ["hasVipExperience", "VIP experience"],
            ["hasEventExperience", "Event experience"],
            ["hasDriverLicenseB", "Driver license B"],
            ["hasFirstAidTraining", "First aid training"],
            ["weaponExperience", "Weapon experience"],
            ["readyForTravel", "Ready for travel"],
            ["readyForNightShifts", "Ready for night shifts"],
          ] as const
        ).map(([key, label]) => (
          <Grid key={key} size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField
                label={label}
                value={formValues[key] ? "Yes" : "No"}
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
        ))}
      </Grid>
    </>
  );
}

export default memo(SecurityAgentProfessionalSection);
