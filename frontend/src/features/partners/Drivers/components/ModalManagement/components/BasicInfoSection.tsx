import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { memo, type ChangeEvent } from "react";
import { modalTextFieldSx, sectionLabelSx } from "../../../../../../components/ui/modalStyles";
import type { DriverOrganizationFormValues } from "../../../data/types";
import DetailField from "../../../../../../components/DetailField";

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
          <TextField
            fullWidth
            size="small"
            label="Organization Name"
            value={formValues.organizationName}
            onChange={handleChange("organizationName")}
            helperText="Digits only (if applicable)"
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
          <TextField
            fullWidth
            size="small"
            label="Email"
            value={formValues.email}
            onChange={handleChange("email")}
            helperText="Enter a valid email address"
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
          <TextField
            fullWidth
            size="small"
            label="Phone"
            value={formValues.phone}
            onChange={handleChange("phone")}
            helperText="Enter a valid phone number"
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
          <TextField
            fullWidth
            size="small"
            label="Contact Person"
            value={formValues.contactPerson}
            onChange={handleChange("contactPerson")}
            helperText="Enter a valid contact person name"
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
          <TextField
            fullWidth
            size="small"
            label="Service Areas"
            value={formValues.serviceAreas}
            onChange={handleChange("serviceAreas")}
            helperText="Enter the service areas separated by commas"
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
          <TextField
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
          </TextField>
        )}
      </Grid>
    </>
  );
}

export default memo(BasicInfoSection);
