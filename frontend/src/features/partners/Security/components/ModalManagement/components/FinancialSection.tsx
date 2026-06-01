import { Grid, MenuItem, Typography } from "@mui/material";
import DetailField from "../../../../../../components/DetailField";
import FormTextField from "../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import { CURRENCY_OPTIONS, OPERATIONS_OPTIONS } from "../constants";
import { memo } from "react";
import type { SecurityOrganizationFormValues } from "../../../data/types";
import { securityPartnersContent } from "../../../../../../content/securityPartners";

const om = securityPartnersContent.organizationModal;
const fin = om.financial;

type Props = {
  readOnly: boolean;
  formValues: SecurityOrganizationFormValues;
  handleChange: <K extends keyof SecurityOrganizationFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function FinancialSection({ readOnly, formValues, handleChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>{om.sections.financial}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={fin.bankAccountIban.label}
              value={formValues.bankAccountIban}
            />
          ) : (
            <FormTextField
              field="bankAccountIban"
              fullWidth
              size="small"
              label={fin.bankAccountIban.label}
              value={formValues.bankAccountIban}
              onChange={handleChange("bankAccountIban")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={fin.paymentTerms.label}
              value={formValues.paymentTerms}
            />
          ) : (
            <FormTextField
              field="paymentTerms"
              fullWidth
              size="small"
              label={fin.paymentTerms.label}
              value={formValues.paymentTerms}
              onChange={handleChange("paymentTerms")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label={fin.currency.label} value={formValues.currency} />
          ) : (
            <FormTextField
              field="currency"
              fullWidth
              size="small"
              select
              label={fin.currency.label}
              value={formValues.currency}
              onChange={handleChange("currency")}
              sx={modalTextFieldSx}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>

        {OPERATIONS_OPTIONS.map((f) => (
          <Grid key={String(f.key)} size={{ xs: 12, md: 4 }}>
            {readOnly ? (
              <DetailField
                label={f.label}
                value={String(formValues[f.key] ?? "")}
              />
            ) : (
              <FormTextField
                field={String(f.key)}
                fullWidth
                size="small"
                type="number"
                label={f.label}
                value={String(formValues[f.key] ?? "")}
                onChange={handleChange(f.key)}
                sx={modalTextFieldSx}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default memo(FinancialSection);
