import React, { memo } from "react";

import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import DetailField from "../../../../../../components/DetailField";
import { COOPERATION_OPTIONS, CURRENCY_OPTIONS } from "../constants";
import type { DriverOrganization } from "../../../data/types";

type Props = {
  readOnly: boolean;
  formValues: DriverOrganization;
  handleChange: (
    field: keyof DriverOrganization,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FinancialSection = ({ readOnly, formValues, handleChange }: Props) => {
  return (
    <>
      <Typography sx={sectionLabelSx}>Commercial & financial</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Cooperation type"
              value={formValues.cooperationType}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              select
              label="Cooperation type"
              value={formValues.cooperationType}
              onChange={handleChange("cooperationType")}
              sx={modalTextFieldSx}
            >
              {COOPERATION_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
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

        {formValues.cooperationType === "COMMISSION" && (
          <Grid size={{ xs: 12, md: 4 }}>
            {readOnly ? (
              <DetailField
                label="Commission (%)"
                value={formValues.commissionPercent}
              />
            ) : (
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Commission (%)"
                value={formValues.commissionPercent}
                onChange={handleChange("commissionPercent")}
                sx={modalTextFieldSx}
              />
            )}
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label="Minimum fare" value={formValues.minimumFare} />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Minimum fare"
              value={formValues.minimumFare}
              onChange={handleChange("minimumFare")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label="Hourly rate" value={formValues.hourlyRate} />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Hourly rate"
              value={formValues.hourlyRate}
              onChange={handleChange("hourlyRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label="Transfer base rate"
              value={formValues.transferBaseRate}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Transfer base rate"
              value={formValues.transferBaseRate}
              onChange={handleChange("transferBaseRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label="Night surcharge (%)"
              value={formValues.nightSurchargePercent}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Night surcharge (%)"
              value={formValues.nightSurchargePercent}
              onChange={handleChange("nightSurchargePercent")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label="Holiday surcharge (%)"
              value={formValues.holidaySurchargePercent}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Holiday surcharge (%)"
              value={formValues.holidaySurchargePercent}
              onChange={handleChange("holidaySurchargePercent")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label="Waiting time fee"
              value={formValues.waitingTimeFee}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Waiting time fee"
              value={formValues.waitingTimeFee}
              onChange={handleChange("waitingTimeFee")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default memo(FinancialSection);
