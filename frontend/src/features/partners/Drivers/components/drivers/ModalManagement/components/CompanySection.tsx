import React, { memo } from "react";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { Checkbox } from "@mui/material";
import { FormControlLabel } from "@mui/material";

import DetailField from "../../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";
import type { DriverOrganization } from "../../../../data/types";

type Props = {
  readOnly: boolean;
  formValues: DriverOrganization;
  handleChange: (
    field: keyof DriverOrganization,
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
              helperText="Digits only (if applicable)"
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="VAT number" value={formValues.vatNumber} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="VAT number"
              value={formValues.vatNumber}
              onChange={handleChange("vatNumber")}
              helperText="EU VAT (optional)"
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

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Registration country"
              value={formValues.registrationCountry}
            />
          ) : (
            <TextField
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
            <TextField
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
              label="General email"
              value={formValues.generalEmail}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="email"
              label="General email"
              value={formValues.generalEmail}
              onChange={handleChange("generalEmail")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Company phone number"
              value={formValues.companyPhoneNumber}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Company phone number"
              value={formValues.companyPhoneNumber}
              onChange={handleChange("companyPhoneNumber")}
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

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Director position"
              value={formValues.directorPosition}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Director position"
              value={formValues.directorPosition}
              onChange={handleChange("directorPosition")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Primary contact name"
              value={formValues.primaryContactName}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Primary contact name"
              value={formValues.primaryContactName}
              onChange={handleChange("primaryContactName")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Primary contact email"
              value={formValues.primaryContactEmail}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="email"
              label="Primary contact email"
              value={formValues.primaryContactEmail}
              onChange={handleChange("primaryContactEmail")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Primary contact phone"
              value={formValues.primaryContactPhone}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Primary contact phone"
              value={formValues.primaryContactPhone}
              onChange={handleChange("primaryContactPhone")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(CompanySection);
