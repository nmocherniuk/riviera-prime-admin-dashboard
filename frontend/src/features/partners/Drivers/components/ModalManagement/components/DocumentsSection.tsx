import React, { memo } from "react";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import DetailField from "../../../../../../components/DetailField";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DOCUMENTS_OPTIONS } from "../constants";
import type { DriverOrganization } from "../../../data/types";

type Props = {
  readOnly: boolean;
  formValues: DriverOrganization;
  handleChange: (
    field: keyof DriverOrganization,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DocumentsSection = ({ readOnly, formValues, handleChange }: Props) => {
  return (
    <>
      <Typography sx={sectionLabelSx}>Documents</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {DOCUMENTS_OPTIONS.map((d, index) => {
          const val = formValues[d.key];
          const isLastOdd =
            DOCUMENTS_OPTIONS.length % 2 !== 0 &&
            index === DOCUMENTS_OPTIONS.length - 1;

          if (readOnly) {
            return (
              <Grid size={{ xs: 12, md: isLastOdd ? 12 : 6 }}>
                <DetailField label={d.label} value={val ? "Yes" : "No"} />
              </Grid>
            );
          }

          return (
            <Grid key={d.key} size={{ xs: 12, md: isLastOdd ? 12 : 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(val)}
                    onChange={handleChange(d.key as keyof DriverOrganization)}
                  />
                }
                label={d.label}
              />
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

        <Grid size={{ xs: 12 }}>
          {readOnly ? (
            <DetailField
              label="Document notes"
              value={formValues.documentNotes}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Document notes"
              value={formValues.documentNotes}
              onChange={handleChange("documentNotes")}
              multiline
              minRows={2}
              sx={modalTextFieldSx}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default memo(DocumentsSection);
