import { Button, Divider, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import BaseModal from "../../../../../../components/BaseModal";
import {
  defaultFormValues,
} from "./driverManagementForm.types";
import { driverToFormValues } from "./driverManagementForm.mapper";
import BasicInfoSection from "./components/BasicInfoSection";
import ProfessionalSection from "./components/ProfessionalSection";
import DocumentsSection from "./components/DocumentsSection";
import DriverPayoutSection from "./components/DriverPayoutSection";
import type { Driver, DriverFormValues } from "../types";
import { FormFieldErrorsProvider } from "../../../../../../components/form/FormFieldErrorsProvider";
import type { FieldErrors } from "../../../../../../utils/formErrors";
import { driverAgentsContent } from "../../../../../../content/driverAgents";

const m = driverAgentsContent.modal;

type DriverManagementModalProps = {
  open: boolean;
  onClose: () => void;
  driver: Driver | null;
  readOnly?: boolean;
  managedVehicles?: Array<{ id: string; label: string; vehicleClass: string }>;
  fieldErrors?: FieldErrors;
  onClearFieldError?: (field: string) => void;
  onSave?: (
    driverId: string | null,
    values: DriverFormValues,
  ) => void | Promise<void>;
};


export default function DriverManagementModal({
  open,
  onClose,
  driver,
  readOnly = false,
  managedVehicles = [],
  fieldErrors = {},
  onClearFieldError,
  onSave,
}: DriverManagementModalProps) {
  const [formValues, setFormValues] =
    useState<DriverFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(driverToFormValues(driver));
  }, [driver, open]);

  const handleChange =
    (field: keyof DriverFormValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onClearFieldError?.(field);
        const nextValue =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormValues((prev: DriverFormValues) => ({ ...prev, [field]: nextValue }));
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
            {readOnly ? m.titles.readOnly : m.titles.edit}
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
              {m.cancel}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => onSave?.(driver?.id ?? null, formValues)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2,
              }}
            >
              {m.save}
            </Button>
          </>
        ) : undefined
      }
    >
      <FormFieldErrorsProvider
        fieldErrors={fieldErrors}
        onClearField={onClearFieldError}
      >
        <BasicInfoSection
          readOnly={readOnly}
          driverId={driver?.id}
          formValues={formValues}
          onChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />
        <ProfessionalSection
          readOnly={readOnly}
          formValues={formValues}
          onChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />
        <DocumentsSection
          readOnly={readOnly}
          formValues={formValues}
          onChange={handleChange}
        />
      </FormFieldErrorsProvider>
      <Divider sx={{ my: 2 }} />
      <DriverPayoutSection
        readOnly={readOnly}
        driverId={driver?.id}
        driverEmail={driver?.email}
        stripeAccountId={driver?.stripeAccountId}
        stripeOnboardingCompleted={driver?.stripeOnboardingCompleted}
      />
    </BaseModal>
  );
}
