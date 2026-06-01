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
import { memo, type ChangeEvent } from "react";
import type { SecurityAgentFormValues } from "../securityAgentForm.types";
import { OPERATIONS_OPTIONS } from "../constants";
import { commonContent } from "../../../../../../../content/common";
import { securityAgentContent } from "../../../../../../../content/securityAgent";

const mo = securityAgentContent.modal.operations;

type Props = {
  readOnly: boolean;
  formValues: SecurityAgentFormValues;
  onChange: <K extends keyof SecurityAgentFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SecurityAgentOperationsSection({
  readOnly,
  formValues,
  onChange,
}: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>{mo.sectionTitle}</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={mo.baseCity.label} value={formValues.baseCity} />
          ) : (
            <FormTextField
              field="baseCity"
              fullWidth
              size="small"
              label={mo.baseCity.label}
              value={formValues.baseCity}
              onChange={onChange("baseCity")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={mo.workingRadiusKm.label}
              value={formValues.workingRadiusKm}
            />
          ) : (
            <FormTextField
              field="workingRadiusKm"
              fullWidth
              size="small"
              label={mo.workingRadiusKm.label}
              value={formValues.workingRadiusKm}
              onChange={onChange("workingRadiusKm")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={mo.availability.label}
              value={formValues.availability}
            />
          ) : (
            <FormTextField
              field="availability"
              fullWidth
              size="small"
              label={mo.availability.label}
              multiline
              minRows={2}
              value={formValues.availability}
              onChange={onChange("availability")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={mo.status.label}
              value={formValues.status ? commonContent.status.active : commonContent.status.inactive}
            />
          ) : (
            <FormTextField
              field="status"
              fullWidth
              size="small"
              select
              label={mo.status.label}
              value={formValues.status ? "active" : "inactive"}
              onChange={(e) => {
                const checked = e.target.value === "active";
                onChange("status")({
                  target: {
                    type: "checkbox",
                    checked,
                    name: "status",
                    value: "",
                  },
                } as ChangeEvent<HTMLInputElement>);
              }}
              sx={modalTextFieldSx}
            >
              <MenuItem value="active">{commonContent.status.active}</MenuItem>
              <MenuItem value="inactive">{commonContent.status.inactive}</MenuItem>
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label={mo.hourlyRate.label} value={formValues.hourlyRate} />
          ) : (
            <FormTextField
              field="hourlyRate"
              fullWidth
              size="small"
              label={mo.hourlyRate.label}
              value={formValues.hourlyRate}
              onChange={onChange("hourlyRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label={mo.dailyRate.label} value={formValues.dailyRate} />
          ) : (
            <FormTextField
              field="dailyRate"
              fullWidth
              size="small"
              label={mo.dailyRate.label}
              value={formValues.dailyRate}
              onChange={onChange("dailyRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label={mo.nightRate.label} value={formValues.nightRate} />
          ) : (
            <FormTextField
              field="nightRate"
              fullWidth
              size="small"
              label={mo.nightRate.label}
              value={formValues.nightRate}
              onChange={onChange("nightRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {OPERATIONS_OPTIONS.map(([key, label]) => (
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
        ))}

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField label={mo.notes.label} value={formValues.notes} />
          ) : (
            <FormTextField
              field="notes"
              fullWidth
              size="small"
              label={mo.notes.label}
              multiline
              minRows={3}
              value={formValues.notes}
              onChange={onChange("notes")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(SecurityAgentOperationsSection);
