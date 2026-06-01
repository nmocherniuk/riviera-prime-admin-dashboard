import React, { memo } from "react";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Checkbox } from "@mui/material";
import { FormControlLabel } from "@mui/material";

import DetailField from "../../../../../../components/DetailField";
import FormTextField from "../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import type { DriverOrganizationFormValues } from "../../../data/types";

type Props = {
  readOnly: boolean;
  formValues: DriverOrganizationFormValues;
  handleChange: (
    field: keyof DriverOrganizationFormValues,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CompanySection({ readOnly, formValues, handleChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Company information</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField label="Legal form" value={formValues.legalForm} />
          ) : (
            <FormTextField
              field="legalForm"
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
            <FormTextField
              field="sirenOrSiret"
              fullWidth
              size="small"
              label="SIREN / SIRET"
              value={formValues.sirenOrSiret}
              onChange={handleChange("sirenOrSiret")}
              hint="Digits only (if applicable)"
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="VAT number" value={formValues.vatNumber} />
          ) : (
            <FormTextField
              field="vatNumber"
              fullWidth
              size="small"
              label="VAT number"
              value={formValues.vatNumber}
              onChange={handleChange("vatNumber")}
              hint="EU VAT (optional)"
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
            <FormTextField
              field="registrationDate"
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

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Registration country"
              value={formValues.registrationCountry}
            />
          ) : (
            <FormTextField
              field="registrationCountry"
              fullWidth
              size="small"
              label="Registration country"
              value={formValues.registrationCountry}
              onChange={handleChange("registrationCountry")}
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
            <FormTextField
              field="registeredAddress"
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
              label="Mailing address same as registered"
              value={formValues.sameAsRegisteredAddress ? "Yes" : "No"}
            />
          ) : (
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.sameAsRegisteredAddress}
                  onChange={handleChange("sameAsRegisteredAddress")}
                />
              }
              label="Mailing address is the same as registered address"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Mailing address"
              value={formValues.mailingAddress}
            />
          ) : (
            <FormTextField
              field="mailingAddress"
              fullWidth
              size="small"
              label="Mailing address"
              value={formValues.mailingAddress}
              onChange={handleChange("mailingAddress")}
              multiline
              minRows={2}
              disabled={formValues.sameAsRegisteredAddress}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Website URL" value={formValues.websiteUrl} />
          ) : (
            <FormTextField
              field="websiteUrl"
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
            <FormTextField
              field="directorFullName"
              fullWidth
              size="small"
              label="Director full name"
              value={formValues.directorFullName}
              onChange={handleChange("directorFullName")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Director position"
              value={formValues.directorPosition}
            />
          ) : (
            <FormTextField
              field="directorPosition"
              fullWidth
              size="small"
              label="Director position"
              value={formValues.directorPosition}
              onChange={handleChange("directorPosition")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(CompanySection);
