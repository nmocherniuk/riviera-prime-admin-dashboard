import { Button, Divider, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState, type ChangeEvent } from "react";
import BaseModal from "../../../../../components/BaseModal";
import { defaultFormValues } from "./securityOrganizationForm.types";
import BasicInfoSection from "./components/BasicInfoSection";
import CompanyDetailsSection from "./components/CompanyDetailsSection";
import DocumentsSection from "./components/DocumentsSection";
import OperationsSection from "./components/OperationsSection";
import FinancialSection from "./components/FinancialSection";
import type { SecurityOrganization, SecurityOrganizationFormValues } from "../../data/types";
import { securityOrganizationToFormValues } from "./securityOrganizationForm.mapper";
import { securityPartnersContent } from "../../../../../content/securityPartners";
import { FormFieldErrorsProvider } from "../../../../../components/form/FormFieldErrorsProvider";
import type { FieldErrors } from "../../../../../utils/formErrors";

const om = securityPartnersContent.organizationModal;

type Props = {
  open: boolean;
  onClose: () => void;
  organization: SecurityOrganization | null;
  readOnly?: boolean;
  fieldErrors?: FieldErrors;
  onClearFieldError?: (field: string) => void;
  onSave?: (
    organizationId: string | null,
    values: SecurityOrganizationFormValues,
  ) => void | Promise<void>;
};

export default function SecurityOrganizationManagementModal({
  open,
  onClose,
  organization,
  readOnly = false,
  fieldErrors = {},
  onClearFieldError,
  onSave,
}: Props) {
  const [formValues, setFormValues] =
    useState<SecurityOrganizationFormValues>(defaultFormValues);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormValues(securityOrganizationToFormValues(organization));
  }, [organization, open]);

  const handleChange =
    <K extends keyof SecurityOrganizationFormValues>(field: K) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        onClearFieldError?.(field);
        const nextValue =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormValues((prev) => ({ ...prev, [field]: nextValue }));
      };


  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {readOnly
              ? om.titles.readOnly
              : organization
                ? om.titles.edit
                : om.titles.create}
          </Typography>
        </>
      }
      actions={
        !readOnly ? (
          <>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "rgba(212, 175, 53, 0.08)",
                },
              }}
            >
              {om.cancel}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => onSave?.(organization?.id ?? null, formValues)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2,
              }}
            >
              {organization ? om.save : om.addOrganization}
            </Button>
          </>
        ) : undefined
      }
    >
      <FormFieldErrorsProvider
        fieldErrors={fieldErrors}
        onClearField={onClearFieldError}
      >
        <BasicInfoSection formValues={formValues} readOnly={readOnly} handleChange={handleChange} />
        <Divider sx={{ my: 2 }} />
        <CompanyDetailsSection
          readOnly={readOnly}
          formValues={formValues}
          handleChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />
        <DocumentsSection
          readOnly={readOnly}
          formValues={formValues}
          handleChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />
        <OperationsSection
          readOnly={readOnly}
          formValues={formValues}
          handleChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />
        <FinancialSection
          readOnly={readOnly}
          formValues={formValues}
          handleChange={handleChange}
        />
      </FormFieldErrorsProvider>
    </BaseModal>
  );
}
