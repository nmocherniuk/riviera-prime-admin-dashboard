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
import { driversContent } from "../../../../../../content/drivers";

const om = driversContent.organizationModal;
const fin = om.financial;

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
      <Typography sx={sectionLabelSx}>{om.sections.financial}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={fin.cooperationType.label}
              value={formValues.cooperationType}
            />
          ) : (
            <FormTextField
              field="cooperationType"
              fullWidth
              size="small"
              select
              label={fin.cooperationType.label}
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
            {fin.ratesNote}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0 }}>
            {fin.payoutNote}
          </Typography>
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

        {formValues.cooperationType === "COMMISSION" && (
          <Grid size={{ xs: 12, md: 4 }}>
            {readOnly ? (
              <DetailField
                label={fin.commissionPercent.label}
                value={formValues.commissionPercent}
              />
            ) : (
              <FormTextField
                field="commissionPercent"
                fullWidth
                size="small"
                type="number"
                label={fin.commissionPercent.label}
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
              label={fin.minimumFare.label}
              value={formValues.minimumFare}
            />
          ) : (
            <FormTextField
              field="minimumFare"
              fullWidth
              size="small"
              type="number"
              label={fin.minimumFare.label}
              value={formValues.minimumFare}
              onChange={handleChange("minimumFare")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label={fin.holidaySurchargePercent.label}
              value={formValues.holidaySurchargePercent}
            />
          ) : (
            <FormTextField
              field="holidaySurchargePercent"
              fullWidth
              size="small"
              type="number"
              label={fin.holidaySurchargePercent.label}
              value={formValues.holidaySurchargePercent}
              onChange={handleChange("holidaySurchargePercent")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label={fin.nightSurchargePercent.label}
              value={formValues.nightSurchargePercent}
            />
          ) : (
            <FormTextField
              field="nightSurchargePercent"
              fullWidth
              size="small"
              type="number"
              label={fin.nightSurchargePercent.label}
              value={formValues.nightSurchargePercent}
              onChange={handleChange("nightSurchargePercent")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField label={fin.hourlyRate.label} value={formValues.hourlyRate} />
          ) : (
            <FormTextField
              field="hourlyRate"
              fullWidth
              size="small"
              type="number"
              label={fin.hourlyRate.label}
              value={formValues.hourlyRate}
              onChange={handleChange("hourlyRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label={fin.transferBaseRate.label}
              value={formValues.transferBaseRate}
            />
          ) : (
            <FormTextField
              field="transferBaseRate"
              fullWidth
              size="small"
              type="number"
              label={fin.transferBaseRate.label}
              value={formValues.transferBaseRate}
              onChange={handleChange("transferBaseRate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {readOnly ? (
            <DetailField
              label={fin.waitingTimeFee.label}
              value={formValues.waitingTimeFee}
            />
          ) : (
            <FormTextField
              field="waitingTimeFee"
              fullWidth
              size="small"
              type="number"
              label={fin.waitingTimeFee.label}
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
