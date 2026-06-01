import React, { memo } from "react";

import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import { Grid, MenuItem, Typography } from "@mui/material";
import DetailField from "../../../../../../components/DetailField";
import FormTextField from "../../../../../../components/form/FormTextField";
import { COOPERATION_OPTIONS, CURRENCY_OPTIONS } from "../constants";
import type { DriverOrganizationFormValues } from "../../../data/types";

type Props = {
  readOnly: boolean;
  formValues: DriverOrganizationFormValues;
  handleChange: (
    field: keyof DriverOrganizationFormValues,
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
            <FormTextField
              field="cooperationType"
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
            </FormTextField>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            Public customer rates are set per vehicle in Pricing. Partner
            settlement (commission, partner minimum, partner surcharges) applies
            to payouts after the client pays the platform.
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0 }}>
            Payout bank details are not collected here — use Stripe Connect
            onboarding per driver from the driver profile.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Payment terms"
              value={formValues.paymentTerms}
            />
          ) : (
            <FormTextField
              field="paymentTerms"
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
            <FormTextField
              field="currency"
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
            </FormTextField>
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
              <FormTextField
                field="commissionPercent"
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
            <DetailField
              label="Minimum fare / partner floor (EUR)"
              value={formValues.minimumFare}
            />
          ) : (
            <FormTextField
              field="minimumFare"
              fullWidth
              size="small"
              type="number"
              label="Minimum fare / partner floor (EUR)"
              value={formValues.minimumFare}
              onChange={handleChange("minimumFare")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label="Holiday surcharge — settlement (%)"
              value={formValues.holidaySurchargePercent}
            />
          ) : (
            <FormTextField
              field="holidaySurchargePercent"
              fullWidth
              size="small"
              type="number"
              label="Holiday surcharge — settlement (%)"
              value={formValues.holidaySurchargePercent}
              onChange={handleChange("holidaySurchargePercent")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label="Night surcharge — settlement (%)"
              value={formValues.nightSurchargePercent}
            />
          ) : (
            <FormTextField
              field="nightSurchargePercent"
              fullWidth
              size="small"
              type="number"
              label="Night surcharge — settlement (%)"
              value={formValues.nightSurchargePercent}
              onChange={handleChange("nightSurchargePercent")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label="Hourly rate (org ref.)" value={formValues.hourlyRate} />
          ) : (
            <FormTextField
              field="hourlyRate"
              fullWidth
              size="small"
              type="number"
              label="Hourly rate (org ref.)"
              value={formValues.hourlyRate}
              onChange={handleChange("hourlyRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label="Transfer base rate (org ref.)"
              value={formValues.transferBaseRate}
            />
          ) : (
            <FormTextField
              field="transferBaseRate"
              fullWidth
              size="small"
              type="number"
              label="Transfer base rate (org ref.)"
              value={formValues.transferBaseRate}
              onChange={handleChange("transferBaseRate")}
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
            <FormTextField
              field="waitingTimeFee"
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
