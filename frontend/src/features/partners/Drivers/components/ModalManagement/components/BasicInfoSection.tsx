import { Grid, MenuItem, Typography } from "@mui/material";
import { memo, type ChangeEvent } from "react";
import { modalTextFieldSx, sectionLabelSx } from "../../../../../../components/ui/modalStyles";
import type { DriverOrganizationFormValues } from "../../../data/types";
import DetailField from "../../../../../../components/DetailField";
import FormTextField from "../../../../../../components/form/FormTextField";

type Props = {
  formValues: DriverOrganizationFormValues;
  readOnly: boolean;
  handleChange: (
    field: keyof DriverOrganizationFormValues,
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
};

function BasicInfoSection({ formValues, readOnly, handleChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Organization ID</Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.primary" }}>
        #{formValues.id ?? "—"}
      </Typography>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label="Organization Name"
            value={formValues.organizationName}
          />
        ) : (
          <FormTextField
            field="organizationName"
            fullWidth
            size="small"
            label="Organization Name"
            value={formValues.organizationName}
            onChange={handleChange("organizationName")}
            hint="Digits only (if applicable)"
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label="Email"
            value={formValues.email}
          />
        ) : (
          <FormTextField
            field="email"
            fullWidth
            size="small"
            label="Email"
            value={formValues.email}
            onChange={handleChange("email")}
            hint="Enter a valid email address"
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label="Phone"
            value={formValues.phone}
          />
        ) : (
          <FormTextField
            field="phone"
            fullWidth
            size="small"
            label="Phone"
            value={formValues.phone}
            onChange={handleChange("phone")}
            hint="Enter a valid phone number"
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label="Contact Person"
            value={formValues.contactPerson}
          />
        ) : (
          <FormTextField
            field="contactPerson"
            fullWidth
            size="small"
            label="Contact Person"
            value={formValues.contactPerson}
            onChange={handleChange("contactPerson")}
            hint="Enter a valid contact person name"
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label="Service Areas"
            value={formValues.serviceAreas}
          />
        ) : (
          <FormTextField
            field="serviceAreas"
            fullWidth
            size="small"
            label="Service Areas"
            value={formValues.serviceAreas}
            onChange={handleChange("serviceAreas")}
            hint="Enter the service areas separated by commas"
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label="Status"
            value={formValues.status ? "Active" : "Inactive"}
          />
        ) : (
          <FormTextField
            field="status"
            select
            fullWidth
            size="small"
            label="Status"
            value={formValues.status ? "active" : "inactive"}
            onChange={(e) => {
              const checked = e.target.value === "active";
              handleChange("status")({
                target: {
                  type: "checkbox",
                  checked,
                  name: "status",
                  value: "",
                },
              } as ChangeEvent<HTMLInputElement>);
            }}
            sx={modalTextFieldSx}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </FormTextField>
        )}
      </Grid>
    </>
  );
}

export default memo(BasicInfoSection);
