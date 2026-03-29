import {
  Box,
  Container,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../components/PageHeader";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import SecurityAgentsTable from "../features/partners/Security/components/securityAgents/SecurityAgentsTable";
import SecurityAgentManagementModal from "../features/partners/Security/components/securityAgents/ModalManagement/SecurityAgentModal";

import {
  createSecurityAgent,
  deleteSecurityAgent,
  listSecurityAgents,
  updateSecurityAgent,
} from "../api/securityAgents";
import {
  getApiErrorMessage,
  getOrganization,
  isNotFoundError,
} from "../api/organizations";
import { queryKeys } from "../api/queryKeys";
import { useToast } from "../providers/ToastProvider";
import { type SecurityAgent, type SecurityAgentFormValues } from "../features/partners/Security/components/securityAgents/ModalManagement/securityAgentForm.types";
import {
  formValuesToSecurityAgent,
  securityAgentFormToUpdateBody,
} from "../features/partners/Security/components/securityAgents/ModalManagement/securityAgent.mapper";

export default function SecurityAgentsPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [securityAgentModal, setSecurityAgentModal] = useState<{
    open: boolean;
    securityAgent: SecurityAgent | null;
    readOnly?: boolean;
  }>({
    open: false,
    securityAgent: null,
    readOnly: false,
  });
  const [securityAgentToDelete, setSecurityAgentToDelete] = useState<SecurityAgent | null>(
    null,
  );

  const { data: organization, isPending, error } = useQuery({
    queryKey: queryKeys.organizations.byId(organizationId!),
    queryFn: () => getOrganization(organizationId!),
    enabled: Boolean(organizationId),
  });

  const { data: securityAgents = [], isPending: securityAgentsPending } = useQuery({
    queryKey: queryKeys.securityAgents.byOrganization(organizationId!),
    queryFn: () => listSecurityAgents(organizationId!),
    enabled: Boolean(organizationId),
  });

  const loadError =
    error && error
      ? isNotFoundError(error)
        ? "No results"
        : getApiErrorMessage(error, "Failed to load partner")
      : null;

  const handleSaveSecurityAgent = async (
    securityAgentId: string | null,
    values: SecurityAgentFormValues,
  ) => {
    try {
      if (securityAgentId) {
        await updateSecurityAgent(
          securityAgentId,
          securityAgentFormToUpdateBody(values),
        );
      } else {
        await createSecurityAgent(
          formValuesToSecurityAgent(values, organizationId!),
        );
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeys.securityAgents.byOrganization(organizationId!),
      });

      showToast({ message: "Bodyguard saved successfully", severity: "success" });
      setSecurityAgentModal((prev) => ({ ...prev, open: false }));
    } catch (error) {
      const msg = getApiErrorMessage(error, "Failed to save bodyguard");
      showToast({ message: msg, severity: "error" });
      throw error;
    }
  };

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 240,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!organizationId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {loadError ?? "Organization not found."}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/security-partners")}
          sx={{ mt: 2 }}
        >
          Back to partners
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        <Box sx={{ pt: { xs: 1, md: 2 } }}>
          <PageHeader
            title={organization?.organizationName ?? ""}
            subtitle={`Manage bodyguards for ${organization?.contactPerson ?? ""}`}
            titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            withBack={{ label: "Back to organizations", path: "/security-partners" }}
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  setSecurityAgentModal({
                    open: true,
                    securityAgent: null,
                    readOnly: false,
                  })
                }
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "primary.main",
                  color: "grey.900",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2,
                  py: 1.25,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Add security agent
              </Button>
            }
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          {securityAgentsPending ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <SecurityAgentsTable
              securityAgents={securityAgents}
              onSecurityAgentView={(b) =>
                setSecurityAgentModal({
                  open: true,
                  securityAgent: b,
                  readOnly: true,
                })
              }
              onSecurityAgentEdit={(b) =>
                setSecurityAgentModal({
                  open: true,
                  securityAgent: b,
                  readOnly: false,
                })
              }
              onSecurityAgentDelete={setSecurityAgentToDelete}
            />
          )}
        </Box>
        <SecurityAgentManagementModal
          open={securityAgentModal.open}
          onClose={() =>
            setSecurityAgentModal((prev) => ({ ...prev, open: false }))
          }
          securityAgent={securityAgentModal.securityAgent}
          readOnly={securityAgentModal.readOnly}
          onSave={handleSaveSecurityAgent}
        />
        <ConfirmDeleteDialog
          open={!!securityAgentToDelete}
          onClose={() => setSecurityAgentToDelete(null)}
          onConfirm={async () => {
            try {
              if (!securityAgentToDelete?.id) return;

              await deleteSecurityAgent(securityAgentToDelete.id);

              await queryClient.invalidateQueries({
                queryKey: queryKeys.securityAgents.byOrganization(organizationId!),
              });

              setSecurityAgentToDelete(null);

              showToast({ message: "Security agent deleted successfully", severity: "success" });
            }
            catch (error) {
              const msg = getApiErrorMessage(error, "Failed to delete security agent");
              showToast({ message: msg, severity: "error" });
              throw error;
            }
          }}
          title="Delete security agent?"
          message="This action cannot be undone."
        />
      </Container>
    </Box>
  );
}
