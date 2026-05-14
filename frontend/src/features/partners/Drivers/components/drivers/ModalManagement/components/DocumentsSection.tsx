import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { memo } from "react";
import DetailField from "../../../../../../../components/DetailField";
import { sectionLabelSx } from "../../../../../../../components/ui/modalStyles";
;
import { DOCUMENT_FIELDS } from "../constants";
import type { DriverFormValues } from "../../types";

type Props = {
  readOnly: boolean;
  formValues: DriverFormValues;
  onChange: <K extends keyof DriverFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};


function DocumentsSection({ readOnly, formValues, onChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Documents</Typography>
      <Grid container spacing={1.5}>
        {DOCUMENT_FIELDS.map((f) => (
          <Grid key={f.key} size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label={f.label} value={formValues[f.key] ? "Yes" : "No"} />
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

