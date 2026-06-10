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
import { commonContent } from "../../../../../../content/common";
import { driversContent } from "../../../../../../content/drivers";

const om = driversContent.organizationModal;
const cd = om.companyDetails;

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
      <Typography sx={sectionLabelSx}>{om.sections.companyDetails}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField label={cd.legalForm.label} value={formValues.legalForm} />
          ) : (
            <FormTextField
              field="legalForm"
              fullWidth
              size="small"
              label={cd.legalForm.label}
              value={formValues.legalForm}
              onChange={handleChange("legalForm")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={cd.sirenOrSiret.label}
              value={formValues.sirenOrSiret}
            />
          ) : (
            <FormTextField
              field="sirenOrSiret"
              fullWidth
              size="small"
              label={cd.sirenOrSiret.label}
              value={formValues.sirenOrSiret}
              onChange={handleChange("sirenOrSiret")}
              hint={cd.sirenOrSiret.helperEdit}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={cd.vatNumber.label} value={formValues.vatNumber} />
          ) : (
            <FormTextField
              field="vatNumber"
              fullWidth
              size="small"
              label={cd.vatNumber.label}
              value={formValues.vatNumber}
              onChange={handleChange("vatNumber")}
              hint={cd.vatNumber.helperEdit}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={cd.registrationDate.label}
              value={formValues.registrationDate}
            />
          ) : (
            <FormTextField
              field="registrationDate"
              fullWidth
              size="small"
              type="date"
              label={cd.registrationDate.label}
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
              label={cd.registrationCountry.label}
              value={formValues.registrationCountry}
            />
          ) : (
            <FormTextField
              field="registrationCountry"
              fullWidth
              size="small"
              label={cd.registrationCountry.label}
              value={formValues.registrationCountry}
              onChange={handleChange("registrationCountry")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={cd.registeredAddress.label}
              value={formValues.registeredAddress}
            />
          ) : (
            <FormTextField
              field="registeredAddress"
              fullWidth
              size="small"
              label={cd.registeredAddress.label}
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
              label={cd.sameAsRegisteredReadOnly}
              value={formValues.sameAsRegisteredAddress ? commonContent.boolean.yes : commonContent.boolean.no}
            />
          ) : (
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.sameAsRegisteredAddress}
                  onChange={handleChange("sameAsRegisteredAddress")}
                />
              }
              label={cd.sameAsRegistered}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={cd.mailingAddress.label}
              value={formValues.mailingAddress}
            />
          ) : (
            <FormTextField
              field="mailingAddress"
              fullWidth
              size="small"
              label={cd.mailingAddress.label}
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
            <DetailField label={cd.websiteUrl.label} value={formValues.websiteUrl} />
          ) : (
            <FormTextField
              field="websiteUrl"
              fullWidth
              size="small"
              label={cd.websiteUrl.label}
              value={formValues.websiteUrl}
              onChange={handleChange("websiteUrl")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={cd.directorFullName.label}
              value={formValues.directorFullName}
            />
          ) : (
            <FormTextField
              field="directorFullName"
              fullWidth
              size="small"
              label={cd.directorFullName.label}
              value={formValues.directorFullName}
              onChange={handleChange("directorFullName")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={cd.directorPosition.label}
              value={formValues.directorPosition}
            />
          ) : (
            <FormTextField
              field="directorPosition"
              fullWidth
              size="small"
              label={cd.directorPosition.label}
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
