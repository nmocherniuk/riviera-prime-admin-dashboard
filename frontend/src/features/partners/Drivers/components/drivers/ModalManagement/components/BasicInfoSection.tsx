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
import { commonContent } from "../../../../../../../content/common";
import { driverAgentsContent } from "../../../../../../../content/driverAgents";

const m = driverAgentsContent.modal;
const b = m.basic;

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
      <Typography sx={sectionLabelSx}>{m.driverIdSection}</Typography>
      <Typography variant="body1" sx={valueBoxSx}>
        #{driverId ?? "—"}
      </Typography>

      <Typography sx={sectionLabelSx}>{b.sectionTitle}</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={b.name.label} value={formValues.name} />
          ) : (
            <FormTextField
              field="name"
              fullWidth
              size="small"
              label={b.name.label}
              placeholder={b.name.placeholder}
              value={formValues.name}
              onChange={onChange("name")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={b.phone.label} value={formValues.phone} />
          ) : (
            <FormTextField
              field="phone"
              fullWidth
              size="small"
              label={b.phone.label}
              placeholder={b.phone.placeholder}
              value={formValues.phone}
              onChange={onChange("phone")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={b.email.label} value={formValues.email} />
          ) : (
            <FormTextField
              field="email"
              fullWidth
              size="small"
              label={b.email.label}
              placeholder={b.email.placeholder}
              value={formValues.email}
              onChange={onChange("email")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={b.address.label} value={formValues.address} />
          ) : (
            <FormTextField
              field="address"
              fullWidth
              size="small"
              label={b.address.label}
              value={formValues.address}
              onChange={onChange("address")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={b.nationality.label} value={formValues.nationality} />
          ) : (
            <FormTextField
              field="nationality"
              fullWidth
              size="small"
              label={b.nationality.label}
              value={formValues.nationality}
              onChange={onChange("nationality")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField label={b.birthDate.label} value={formValues.birthDate} />
          ) : (
            <FormTextField
              field="birthDate"
              fullWidth
              size="small"
              type="date"
              label={b.birthDate.label}
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
              label={b.languagesSpoken.label}
              value={(formValues.languages ?? []).join(", ")}
            />
          ) : (
            <FormTextField
              field="languages"
              fullWidth
              size="small"
              select
              label={b.languagesSpoken.label}
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
              label={b.emergencyContact.label}
              value={formValues.emergencyContact}
            />
          ) : (
            <FormTextField
              field="emergencyContact"
              fullWidth
              size="small"
              label={b.emergencyContact.label}
              value={formValues.emergencyContact}
              onChange={onChange("emergencyContact")}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label={b.status.label}
              value={formValues.status ? commonContent.status.active : commonContent.status.inactive}
            />
          ) : (
            <FormTextField
              field="status"
              select
              fullWidth
              size="small"
              label={b.status.label}
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
              <MenuItem value="active">{commonContent.status.active}</MenuItem>
              <MenuItem value="inactive">{commonContent.status.inactive}</MenuItem>
            </FormTextField>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(BasicInfoSection);
