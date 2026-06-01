import { Grid, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../components/DetailField";
import FormTextField from "../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import type { SecurityOrganizationFormValues } from "../../../data/types";
import { securityPartnersContent } from "../../../../../../content/securityPartners";

const om = securityPartnersContent.organizationModal;
const cd = om.companyDetails;

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
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={cd.licenseNumber.label}
              value={formValues.licenseNumber}
            />
          ) : (
            <FormTextField
              field="licenseNumber"
              fullWidth
              size="small"
              label={cd.licenseNumber.label}
              value={formValues.licenseNumber}
              onChange={handleChange("licenseNumber")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={cd.cnapsNumber.label} value={formValues.cnapsNumber} />
          ) : (
            <FormTextField
              field="cnapsNumber"
              fullWidth
              size="small"
              label={cd.cnapsNumber.label}
              value={formValues.cnapsNumber}
              onChange={handleChange("cnapsNumber")}
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
              label={cd.officeAddress.label}
              value={formValues.officeAddress}
            />
          ) : (
            <FormTextField
              field="officeAddress"
              fullWidth
              size="small"
              label={cd.officeAddress.label}
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
      </Grid>
    </>
  );
}

export default memo(CompanyDetailsSection);
