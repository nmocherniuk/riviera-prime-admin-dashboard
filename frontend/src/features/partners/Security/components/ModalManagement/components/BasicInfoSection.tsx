import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { modalTextFieldSx, sectionLabelSx } from "../../../../../../components/ui/modalStyles";
import { memo, type ChangeEvent } from "react";
import type { SecurityOrganizationFormValues } from "../../../data/types";
import DetailField from "../../../../../../components/DetailField";
import { commonContent } from "../../../../../../content/common";
import { securityPartnersContent } from "../../../../../../content/securityPartners";

const om = securityPartnersContent.organizationModal;
const bi = om.basicInfo;

type Props = {
  formValues: SecurityOrganizationFormValues;
  readOnly: boolean;
  handleChange: (
    field: keyof SecurityOrganizationFormValues,
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
};

function BasicInfoSection({ formValues, readOnly, handleChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>{om.sections.organizationId}</Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.primary" }}>
        #{formValues.id ?? "—"}
      </Typography>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label={bi.organizationName.label}
            value={formValues.organizationName}
          />
        ) : (
          <TextField
            fullWidth
            size="small"
            label={bi.organizationName.label}
            value={formValues.organizationName}
            onChange={handleChange("organizationName")}
            helperText={bi.organizationName.helperEdit}
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label={bi.email.label}
            value={formValues.email}
          />
        ) : (
          <TextField
            fullWidth
            size="small"
            label={bi.email.label}
            value={formValues.email}
            onChange={handleChange("email")}
            helperText={bi.email.helperEdit}
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label={bi.phone.label}
            value={formValues.phone}
          />
        ) : (
          <TextField
            fullWidth
            size="small"
            label={bi.phone.label}
            value={formValues.phone}
            onChange={handleChange("phone")}
            helperText={bi.phone.helperEdit}
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label={bi.contactPerson.label}
            value={formValues.contactPerson}
          />
        ) : (
          <TextField
            fullWidth
            size="small"
            label={bi.contactPerson.label}
            value={formValues.contactPerson}
            onChange={handleChange("contactPerson")}
            helperText={bi.contactPerson.helperEdit}
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label={bi.serviceAreas.label}
            value={formValues.serviceAreas}
          />
        ) : (
          <TextField
            fullWidth
            size="small"
            label={bi.serviceAreas.label}
            value={formValues.serviceAreas}
            onChange={handleChange("serviceAreas")}
            helperText={bi.serviceAreas.helperEdit}
            sx={modalTextFieldSx}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {readOnly ? (
          <DetailField
            label={bi.status.label}
            value={formValues.status ? commonContent.status.active : commonContent.status.inactive}
          />
        ) : (
          <TextField
            select
            fullWidth
            size="small"
            label={bi.status.label}
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
            <MenuItem value="active">{commonContent.status.active}</MenuItem>
            <MenuItem value="inactive">{commonContent.status.inactive}</MenuItem>
          </TextField>
        )}
      </Grid>
    </>
  );
}

export default memo(BasicInfoSection);
