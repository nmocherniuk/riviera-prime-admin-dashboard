import { Grid, TextField, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import type { SecurityOrganizationFormValues } from "../../../data/types";

type Props = {
  readOnly: boolean;
  formValues: SecurityOrganizationFormValues;
  handleChange: <K extends keyof SecurityOrganizationFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CompanyDetailsSection({ readOnly, formValues, handleChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Company details</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField label="Legal form" value={formValues.legalForm} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Legal form"
              value={formValues.legalForm}
              onChange={handleChange("legalForm")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="SIREN / SIRET"
              value={formValues.sirenOrSiret}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="SIREN / SIRET"
              value={formValues.sirenOrSiret}
              onChange={handleChange("sirenOrSiret")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="License number"
              value={formValues.licenseNumber}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="License number"
              value={formValues.licenseNumber}
              onChange={handleChange("licenseNumber")}
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
              onChange={handleChange("cnapsNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Registration date"
              value={formValues.registrationDate}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Registration date"
              value={formValues.registrationDate}
              onChange={handleChange("registrationDate")}
              InputLabelProps={{ shrink: true }}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Registered address"
              value={formValues.registeredAddress}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Registered address"
              value={formValues.registeredAddress}
              onChange={handleChange("registeredAddress")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Office address"
              value={formValues.officeAddress}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Office address"
              value={formValues.officeAddress}
              onChange={handleChange("officeAddress")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Website URL" value={formValues.websiteUrl} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Website URL"
              value={formValues.websiteUrl}
              onChange={handleChange("websiteUrl")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Director full name"
              value={formValues.directorFullName}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Director full name"
              value={formValues.directorFullName}
              onChange={handleChange("directorFullName")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(CompanyDetailsSection);
