import React, { memo, type ChangeEvent } from "react";
import {
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import DetailField from "../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import {
  LANGUAGE_OPTIONS,
  SECURITY_SERVICE_TYPES,
  SPECIAL_REQUIREMENTS_OPTIONS,
} from "../constants";
import type { SecurityOrganizationFormValues } from "../../../data/types";
import {
  commonContent,
} from "../../../../../../content/common";
import {
  securityPartnersContent,
  securityServiceTypeLabel,
} from "../../../../../../content/securityPartners";

const om = securityPartnersContent.organizationModal;
const op = om.operations;

type Props = {
  readOnly: boolean;
  formValues: SecurityOrganizationFormValues;
  handleChange: <K extends keyof SecurityOrganizationFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function OperationsSection({ readOnly, formValues, handleChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>{om.sections.operations}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.serviceAreas.label}
              value={formValues.serviceAreas}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label={op.serviceAreas.label}
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
              label={op.serviceTypes.label}
              value={(formValues.serviceTypes ?? []).join(", ")}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label={op.serviceTypes.label}
              value={formValues.serviceTypes}
              SelectProps={{ multiple: true }}
              onChange={(e) =>
                handleChange("serviceTypes")(e as ChangeEvent<HTMLInputElement>)
              }
              sx={modalTextFieldSx}
            >
              {SECURITY_SERVICE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {securityServiceTypeLabel(t)}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.support247.label}
              value={formValues.support24_7 ? commonContent.boolean.yes : commonContent.boolean.no}
            />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={formValues.support24_7}
                  onChange={handleChange("support24_7")}
                />
              }
              label={op.support247.label}
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
            <TextField
              fullWidth
              size="small"
              select
              label={op.languagesSpoken.label}
              value={formValues.languagesSpoken}
              SelectProps={{ multiple: true }}
              onChange={(e) =>
                handleChange("languagesSpoken")(e as ChangeEvent<HTMLInputElement>)
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

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label={op.minBookingHours.label}
              value={formValues.minBookingHours}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label={op.minBookingHours.label}
              value={formValues.minBookingHours}
              onChange={handleChange("minBookingHours")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label={op.mobilizationTimeMinutes.label}
              value={formValues.mobilizationTimeMinutes}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label={op.mobilizationTimeMinutes.label}
              value={formValues.mobilizationTimeMinutes}
              onChange={handleChange("mobilizationTimeMinutes")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label={op.agentsCount.label} value={formValues.agentsCount} />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label={op.agentsCount.label}
              value={formValues.agentsCount}
              onChange={handleChange("agentsCount")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        {SPECIAL_REQUIREMENTS_OPTIONS.map((c) => (
          <Grid key={String(c.key)} size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField
                label={c.label}
                value={formValues[c.key] ? commonContent.boolean.yes : commonContent.boolean.no}
              />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(formValues[c.key])}
                    onChange={handleChange(c.key)}
                  />
                }
                label={c.label}
              />
            )}
          </Grid>
        ))}

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={op.specialRequirements.label}
              value={formValues.specialRequirements}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label={op.specialRequirements.label}
              value={formValues.specialRequirements}
              onChange={handleChange("specialRequirements")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(OperationsSection);
