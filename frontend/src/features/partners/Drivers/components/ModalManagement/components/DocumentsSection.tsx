import React, { memo } from "react";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../../components/ui/modalStyles";
import DetailField from "../../../../../../components/DetailField";
import FormTextField from "../../../../../../components/form/FormTextField";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { DOCUMENTS_OPTIONS } from "../constants";
import type { DriverOrganizationFormValues } from "../../../data/types";
import { commonContent } from "../../../../../../content/common";
import { driversContent } from "../../../../../../content/drivers";

const om = driversContent.organizationModal;
const doc = om.documents;

type Props = {
  readOnly: boolean;
  formValues: DriverOrganizationFormValues;
  handleChange: (
    field: keyof DriverOrganizationFormValues,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DocumentsSection = ({ readOnly, formValues, handleChange }: Props) => {
  return (
    <>
      <Typography sx={sectionLabelSx}>{om.sections.documents}</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {DOCUMENTS_OPTIONS.map((d, index) => {
          const val = formValues[d.key as keyof DriverOrganizationFormValues];
          const isLastOdd =
            DOCUMENTS_OPTIONS.length % 2 !== 0 &&
            index === DOCUMENTS_OPTIONS.length - 1;

          if (readOnly) {
            return (
              <Grid key={d.key} size={{ xs: 12, md: isLastOdd ? 12 : 6 }}>
                <DetailField
                  label={d.label}
                  value={val ? commonContent.boolean.yes : commonContent.boolean.no}
                />
              </Grid>
            );
          }

          return (
            <Grid key={d.key} size={{ xs: 12, md: isLastOdd ? 12 : 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(val)}
                    onChange={handleChange(d.key as keyof DriverOrganizationFormValues)}
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
              label={doc.additionalCertifications.label}
              value={formValues.additionalCertifications}
            />
          ) : (
            <FormTextField
              field="additionalCertifications"
              fullWidth
              size="small"
              label={doc.additionalCertifications.label}
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
              label={doc.documentNotes.label}
              value={formValues.documentNotes}
            />
          ) : (
            <FormTextField
              field="documentNotes"
              fullWidth
              size="small"
              label={doc.documentNotes.label}
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
