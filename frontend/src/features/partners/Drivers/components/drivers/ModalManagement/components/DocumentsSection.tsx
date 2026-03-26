import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../../components/DetailField";
import { sectionLabelSx } from "../../../../../../../components/ui/modalStyles";
import {
  DOCUMENT_FIELDS,
  type DriverFormValues,
  type DriverModalFormOnChange,
} from "../driverManagementForm.types";

type Props = {
  readOnly: boolean;
  formValues: DriverFormValues;
  onChange: DriverModalFormOnChange;
};

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

function DocumentsSection({ readOnly, formValues, onChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Documents</Typography>
      <Grid container spacing={1.5}>
        {DOCUMENT_FIELDS.map((f) => (
          <Grid key={f.key} size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label={f.label} value={yesNo(formValues[f.key])} />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox checked={formValues[f.key]} onChange={onChange(f.key)} />
                }
                label={f.label}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default memo(DocumentsSection);

