import { Grid, MenuItem, Typography } from "@mui/material";
import { memo, type ChangeEvent } from "react";
import DetailField from "../../../../../../../components/DetailField";
import FormTextField from "../../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
  valueBoxSx,
} from "../../../../../../../components/ui/modalStyles";
import { LANGUAGE_OPTIONS } from "../../../ModalManagement/constants";
import type { DriverFormValues } from "../../types";

type Props = {
  readOnly: boolean;
  driverId?: string;
  formValues: DriverFormValues;
  onChange: <K extends keyof DriverFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function BasicInfoSection({ readOnly, driverId, formValues, onChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Driver ID</Typography>
      <Typography variant="body1" sx={valueBoxSx}>
        #{driverId ?? "—"}
      </Typography>

      <Typography sx={sectionLabelSx}>Basic Information</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Name" value={formValues.name} />
          ) : (
            <FormTextField
              field="name"
              fullWidth
              size="small"
              label="Name"
              placeholder="Enter name"
              value={formValues.name}
              onChange={onChange("name")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Phone" value={formValues.phone} />
          ) : (
            <FormTextField
              field="phone"
              fullWidth
              size="small"
              label="Phone"
              placeholder="Enter phone number"
              value={formValues.phone}
              onChange={onChange("phone")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Email" value={formValues.email} />
          ) : (
            <FormTextField
              field="email"
              fullWidth
              size="small"
              label="Email"
              placeholder="Enter email address"
              value={formValues.email}
              onChange={onChange("email")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Address" value={formValues.address} />
          ) : (
            <FormTextField
              field="address"
              fullWidth
              size="small"
              label="Address"
              value={formValues.address}
              onChange={onChange("address")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Nationality" value={formValues.nationality} />
          ) : (
            <FormTextField
              field="nationality"
              fullWidth
              size="small"
              label="Nationality"
              value={formValues.nationality}
              onChange={onChange("nationality")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label="Birth Date" value={formValues.birthDate} />
          ) : (
            <FormTextField
              field="birthDate"
              fullWidth
              size="small"
              type="date"
              label="Birth date"
              InputLabelProps={{ shrink: true }}
              value={formValues.birthDate}
              onChange={onChange("birthDate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Languages spoken"
              value={(formValues.languages ?? []).join(", ")}
            />
          ) : (
            <FormTextField
              field="languages"
              fullWidth
              size="small"
              select
              label="Languages spoken"
              value={formValues.languages ?? []}
              SelectProps={{ multiple: true }}
              onChange={(e) =>
                onChange("languages")(
                  e as ChangeEvent<HTMLInputElement>,
                )
              }
              sx={modalTextFieldSx}
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </FormTextField>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Emergency contact"
              value={formValues.emergencyContact}
            />
          ) : (
            <FormTextField
              field="emergencyContact"
              fullWidth
              size="small"
              label="Emergency contact"
              value={formValues.emergencyContact}
              onChange={onChange("emergencyContact")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Employment status"
              value={formValues.status ? "Active" : "Inactive"}
            />
          ) : (
            <FormTextField
              field="status"
              select
              fullWidth
              size="small"
              label="Employment status"
              value={formValues.status ? "active" : "inactive"}
              onChange={(e) => {
                const checked = e.target.value === "active";
                onChange("status")({
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
      </Grid>
    </>
  );
}

export default memo(BasicInfoSection);
