import { Typography, Button, Divider } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState, type ChangeEvent } from "react";
import type { DriverOrganization } from "../../data/types";
import BaseModal from "../../../../../components/BaseModal";
import CompanySection from "./components/CompanySection";
import DocumentsSection from "./components/DocumentsSection";
import OperationsSection from "./components/OperationsSection";
import FinancialSection from "./components/FinancialSection";
import { defaultFormValues } from "./driverOrganizationForm.types";
import { orgToFormValues } from "./driverOrganizationForm.mapper";
import BasicInfoSection from "./components/BasicInfoSection";

type Props = {
  open: boolean;
  onClose: () => void;
  organization: DriverOrganization | null;
  readOnly?: boolean;
  onSave?: (
    organizationId: string | null,
    values: DriverOrganization,
  ) => void | Promise<void>;
};

export default function DriverOrganizationManagementModal({
  open,
  onClose,
  organization,
  readOnly = false,
  onSave,
}: Props) {
  const [formValues, setFormValues] =
    useState<DriverOrganization>(defaultFormValues);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormValues(orgToFormValues(organization));
  }, [organization, open]);

  const handleChange =
    (field: keyof DriverOrganization) => (e: ChangeEvent<HTMLInputElement>) => {
      const nextValue =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormValues(
        (prev) =>
          ({
            ...prev,
            [field]: nextValue,
          }) as DriverOrganization,
      );
    };

  const handleSave = async () => {
    try {
      await Promise.resolve(onSave?.(organization?.id ?? null, formValues));
      onClose();
    } catch {
      // keep modal open on failure
    }
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
              ? "Organization details"
              : organization
                ? "Edit organization"
                : "Add organization"}
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
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleSave}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2,
              }}
            >
              Save changes
            </Button>
          </>
        ) : undefined
      }
    >
      <BasicInfoSection formValues={formValues} />

      <Divider sx={{ my: 2 }} />

      <CompanySection
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
    </BaseModal>
  );
}
