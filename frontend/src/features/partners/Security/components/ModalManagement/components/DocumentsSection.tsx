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
import { commonContent } from "../../../../../../content/common";
import { securityPartnersContent } from "../../../../../../content/securityPartners";
import { DOCUMENTS_OPTIONS } from "../constants";

const om = securityPartnersContent.organizationModal;

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
      <Typography sx={sectionLabelSx}>{om.sections.documents}</Typography>
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
                  value={formValues[c.key] ? commonContent.boolean.yes : commonContent.boolean.no}
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
              label={om.documents.additionalCertifications.label}
              value={formValues.additionalCertifications}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label={om.documents.additionalCertifications.label}
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
