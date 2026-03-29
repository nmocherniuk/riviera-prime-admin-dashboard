import {
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import DetailField from "../../../../../../../components/DetailField";
import { sectionLabelSx } from "../../../../../../../components/ui/modalStyles";
import { memo } from "react";
import type { SecurityAgentFormValues } from "../securityAgentForm.types";
import { DOCUMENT_PROVIDED_OPTIONS } from "../constants";

type Props = {
  readOnly: boolean;
  formValues: SecurityAgentFormValues;
  onChange: <K extends keyof SecurityAgentFormValues>(
    field: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SecurityAgentDocumentsSection({
  readOnly,
  formValues,
  onChange,
}: Props) {
  return (
    <>
      <Typography sx={sectionLabelSx}>Documents (provided)</Typography>
      <Grid container spacing={2}>
        {DOCUMENT_PROVIDED_OPTIONS.map((c, index) => {
          const isLastOdd =
            DOCUMENT_PROVIDED_OPTIONS.length % 2 !== 0 &&
            index === DOCUMENT_PROVIDED_OPTIONS.length - 1;

          return (
            <Grid key={c.key} size={{ xs: 12, md: isLastOdd ? 12 : 6 }}>
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
                      onChange={onChange(c.key)}
                    />
                  }
                  label={c.label}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default memo(SecurityAgentDocumentsSection);
