import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import DetailField from "../../../../../../components/DetailField";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import type { SecurityOrganizationFormValues } from "../../../data/types";
import { memo } from "react";
import { DOCUMENTS_OPTIONS } from "../constants";

type Props = {
  readOnly: boolean;
  formValues: SecurityOrganizationFormValues;
  handleChange: (
    field: keyof SecurityOrganizationFormValues,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function DocumentsSection({ readOnly, formValues, handleChange }: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Documents</Typography>
      <Grid container spacing={2}>
        {DOCUMENTS_OPTIONS.map((c, index) => {
          const isLastOdd =
            DOCUMENTS_OPTIONS.length % 2 !== 0 &&
            index === DOCUMENTS_OPTIONS.length - 1;

          return (
            <Grid key={String(c.key)} size={{ xs: 12, md: isLastOdd ? 12 : 6 }}>
              {readOnly ? (
                <DetailField
                  label={c.label}
                  value={formValues[c.key] ? "Yes" : "No"}
                />
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(formValues[c.key])}
                      onChange={handleChange(c.key)}
                    />
                  }
                  label={c.label}
                />
              )}
            </Grid>
          );
        })}

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Additional certifications"
              value={formValues.additionalCertifications}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Additional certifications"
              value={formValues.additionalCertifications}
              onChange={handleChange("additionalCertifications")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(DocumentsSection);
