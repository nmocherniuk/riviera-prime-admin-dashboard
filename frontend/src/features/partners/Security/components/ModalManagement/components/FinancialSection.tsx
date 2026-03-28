import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import DetailField from "../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import { CURRENCY_OPTIONS, OPERATIONS_OPTIONS } from "../constants";
import { memo } from "react";
import type { SecurityOrganizationFormValues } from "../../../data/types";

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
      <Typography sx={sectionLabelSx}>Financial</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Bank account IBAN"
              value={formValues.bankAccountIban}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Bank account IBAN"
              value={formValues.bankAccountIban}
              onChange={handleChange("bankAccountIban")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Payment terms"
              value={formValues.paymentTerms}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Payment terms"
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
            <DetailField label="Currency" value={formValues.currency} />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Currency"
              value={formValues.currency}
              onChange={handleChange("currency")}
              sx={modalTextFieldSx}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
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
              <TextField
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
