import { Button, Divider, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState, type ChangeEvent } from "react";
import BaseModal from "../../../../../../components/BaseModal";
import {
  defaultSecurityAgentFormValues,
  type SecurityAgent,
  type SecurityAgentFormValues,
} from "./securityAgentForm.types";
import { sectionLabelSx } from "../../../../../../components/ui/modalStyles";
import SecurityAgentPersonalSection from "./components/SecurityAgentPersonalSection";
import SecurityAgentProfessionalSection from "./components/SecurityAgentProfessionalSection";
import SecurityAgentDocumentsSection from "./components/SecurityAgentDocumentsSection";
import SecurityAgentOperationsSection from "./components/SecurityAgentOperationsSection";
import { securityAgentToFormValues } from "./securityAgent.mapper";
import { securityAgentContent } from "../../../../../../content/securityAgent";

const m = securityAgentContent.modal;

type Props = {
  open: boolean;
  onClose: () => void;
  securityAgent: SecurityAgent | null;
  readOnly?: boolean;
  onSave?: (
    agentId: string | null,
    values: SecurityAgentFormValues,
  ) => void | Promise<void>;
};

export default function SecurityAgentManagementModal({
  open,
  onClose,
  securityAgent,
  readOnly = false,
  onSave,
}: Props) {
  const [formValues, setFormValues] = useState<SecurityAgentFormValues>(
    defaultSecurityAgentFormValues,
  );

  useEffect(() => {
    if (!open) return;
    if (!securityAgent) {
      setFormValues(defaultSecurityAgentFormValues);
      return;
    }
    setFormValues(
      securityAgentToFormValues(securityAgent),
    );
  }, [securityAgent, open]);

  const handleChange =
    <K extends keyof SecurityAgentFormValues>(field: K) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const nextValue =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormValues((prev) => ({ ...prev, [field]: nextValue }));
      };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {readOnly
              ? m.titles.readOnly
              : securityAgent
                ? m.titles.edit
                : m.titles.create}
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
              onClick={() => onSave?.(securityAgent?.id ?? null, formValues)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2,
              }}
            >
              {securityAgent ? m.save : m.addAgent}
            </Button>
          </>
        ) : undefined
      }
    >
      {securityAgent ? (
        <>
          <Typography sx={sectionLabelSx}>{m.agentIdSection}</Typography>
          <Typography variant="body2" sx={{ mb: 1, color: "text.primary" }}>
            #{securityAgent.id}
          </Typography>
        </>
      ) : null}

      <SecurityAgentPersonalSection
        readOnly={readOnly}
        formValues={formValues}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />
      <SecurityAgentProfessionalSection
        readOnly={readOnly}
        formValues={formValues}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />
      <SecurityAgentDocumentsSection
        readOnly={readOnly}
        formValues={formValues}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />
      <SecurityAgentOperationsSection
        readOnly={readOnly}
        formValues={formValues}
        onChange={handleChange}
      />
    </BaseModal>
  );
}
