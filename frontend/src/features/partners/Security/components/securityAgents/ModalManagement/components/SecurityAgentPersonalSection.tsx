import { Grid, MenuItem, Typography } from "@mui/material";
import DetailField from "../../../../../../../components/DetailField";
import FormTextField from "../../../../../../../components/form/FormTextField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../../components/ui/modalStyles";
import { memo, type ChangeEvent } from "react";
import type { SecurityAgentFormValues } from "../securityAgentForm.types";
import { LANGUAGE_OPTIONS } from "../../../ModalManagement/constants";
import { securityAgentContent } from "../../../../../../../content/securityAgent";

const mp = securityAgentContent.modal.personal;

type Props = {
  readOnly: boolean;
  formValues: SecurityAgentFormValues;
  onChange: <K extends keyof SecurityAgentFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SecurityAgentPersonalSection({ readOnly, formValues, onChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>{mp.sectionTitle}</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={mp.firstName.label} value={formValues.firstName} />
          ) : (
            <FormTextField
              field="firstName"
              fullWidth
              size="small"
              label={mp.firstName.label}
              value={formValues.firstName}
              onChange={onChange("firstName")}
              sx={modalTextFieldSx}
              required
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={mp.lastName.label} value={formValues.lastName} />
          ) : (
            <FormTextField
              field="lastName"
              fullWidth
              size="small"
              label={mp.lastName.label}
              value={formValues.lastName}
              onChange={onChange("lastName")}
              sx={modalTextFieldSx}
              required
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={mp.birthDate.label} value={formValues.birthDate} />
          ) : (
            <FormTextField
              field="birthDate"
              fullWidth
              size="small"
              label={mp.birthDate.label}
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formValues.birthDate}
              onChange={onChange("birthDate")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={mp.nationality.label} value={formValues.nationality} />
          ) : (
            <FormTextField
              field="nationality"
              fullWidth
              size="small"
              label={mp.nationality.label}
              value={formValues.nationality}
              onChange={onChange("nationality")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={mp.phone.label} value={formValues.phone} />
          ) : (
            <FormTextField
              field="phone"
              fullWidth
              size="small"
              label={mp.phone.label}
              value={formValues.phone}
              onChange={onChange("phone")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={mp.email.label} value={formValues.email} />
          ) : (
            <FormTextField
              field="email"
              fullWidth
              size="small"
              label={mp.email.label}
              type="email"
              value={formValues.email}
              onChange={onChange("email")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField label={mp.address.label} value={formValues.address} />
          ) : (
            <FormTextField
              field="address"
              fullWidth
              size="small"
              label={mp.address.label}
              multiline
              minRows={2}
              value={formValues.address}
              onChange={onChange("address")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={mp.languagesSpoken.label}
              value={(formValues.languages ?? []).join(", ")}
            />
          ) : (
            <FormTextField
              field="languages"
              fullWidth
              size="small"
              select
              label={mp.languagesSpoken.label}
              value={formValues.languages ?? []}
              SelectProps={{ multiple: true }}
              onChange={(e) =>
                onChange("languages")(e as ChangeEvent<HTMLInputElement>)
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
              label={mp.emergencyContact.label}
              value={formValues.emergencyContact}
            />
          ) : (
            <FormTextField
              field="emergencyContact"
              fullWidth
              size="small"
              label={mp.emergencyContact.label}
              value={formValues.emergencyContact}
              onChange={onChange("emergencyContact")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label={mp.profilePhotoUrl.label}
              value={formValues.profilePhotoUrl}
            />
          ) : (
            <FormTextField
              field="profilePhotoUrl"
              fullWidth
              size="small"
              label={mp.profilePhotoUrl.label}
              value={formValues.profilePhotoUrl}
              onChange={onChange("profilePhotoUrl")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(SecurityAgentPersonalSection);
