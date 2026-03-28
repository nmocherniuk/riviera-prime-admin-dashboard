import {
  Box,
  Container,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../components/PageHeader";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import type { Bodyguard, SecurityOrganization } from "../features/partners/Security/data/types";
import BodyguardsTable from "../features/partners/Security/components/bodyguards/BodyguardsTable";
import BodyguardManagementModal from "../features/partners/Security/components/bodyguards/ModalManagement/BodyguardManagementModal";
import type { SecurityAgentFormValues } from "../features/partners/Security/components/bodyguards/ModalManagement/bodyguardForm.types";
import {
  agentDtoToBodyguard,
  formValuesToCreateBody,
  formValuesToUpdateBody,
} from "../features/partners/Security/components/bodyguards/ModalManagement/bodyguardForm.mapper";
import {
  createSecurityAgent,
  deleteSecurityAgent,
  listSecurityAgents,
  updateSecurityAgent,
  type CreateSecurityAgentBody,
  type SecurityAgentDto,
} from "../api/securityAgents";
import {
  getApiErrorMessage,
  getOrganization,
  isNotFoundError,
} from "../api/organizations";
import { queryKeys } from "../api/queryKeys";

type BodyguardsSectionProps = {
  partner: SecurityOrganization;
  partnerId: string;
};

function SecurityBodyguardsSection({ partner, partnerId }: BodyguardsSectionProps) {
  const queryClient = useQueryClient();

  const agentsQuery = useQuery({
    queryKey: queryKeys.securityAgents.byOrganization(partnerId),
    queryFn: () => listSecurityAgents(partnerId),
  });

  const bodyguards = useMemo(
    () => (agentsQuery.data ?? []).map(agentDtoToBodyguard),
    [agentsQuery.data],
  );

  const [bodyguardModal, setBodyguardModal] = useState<{
    open: boolean;
    agentDto: SecurityAgentDto | null;
    readOnly?: boolean;
  }>({
    open: false,
    agentDto: null,
    readOnly: false,
  });
  const [bodyguardToDelete, setBodyguardToDelete] = useState<Bodyguard | null>(
    null,
  );

  const findDto = (b: Bodyguard): SecurityAgentDto | null =>
    agentsQuery.data?.find((a) => a.id === b.id) ?? null;

  const handleSaveBodyguard = async (
    agentId: string | null,
    values: SecurityAgentFormValues,
  ) => {
    if (agentId) {
      await updateSecurityAgent(
        agentId,
        formValuesToUpdateBody(values),
        partnerId,
      );
    } else {
      await createSecurityAgent(
        formValuesToCreateBody(partnerId, values) as CreateSecurityAgentBody,
      );
    }
    await queryClient.invalidateQueries({
      queryKey: queryKeys.securityAgents.byOrganization(partnerId),
    });
  };

  const handleConfirmDelete = async () => {
    if (!bodyguardToDelete) return;
    await deleteSecurityAgent(bodyguardToDelete.id, partnerId);
    await queryClient.invalidateQueries({
      queryKey: queryKeys.securityAgents.byOrganization(partnerId),
    });
    setBodyguardToDelete(null);
  };

  return (
    <>
      <Box sx={{ pt: { xs: 1, md: 2 } }}>
        <PageHeader
          // title={partner.companyName}
          subtitle={`Manage bodyguards for ${partner.contactPerson}`}
          titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          withBack={{ label: "Back to partners", path: "/security-partners" }}
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                setBodyguardModal({
                  open: true,
                  agentDto: null,
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
              Add bodyguard
            </Button>
          }
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        {agentsQuery.isPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <BodyguardsTable
            bodyguards={bodyguards}
            onBodyguardView={(b) =>
              setBodyguardModal({
                open: true,
                agentDto: findDto(b),
                readOnly: true,
              })
            }
            onBodyguardEdit={(b) =>
              setBodyguardModal({
                open: true,
                agentDto: findDto(b),
                readOnly: false,
              })
            }
            onBodyguardDelete={setBodyguardToDelete}
          />
        )}
      </Box>
      <BodyguardManagementModal
        open={bodyguardModal.open}
        onClose={() =>
          setBodyguardModal((prev) => ({ ...prev, open: false }))
        }
        agent={bodyguardModal.agentDto}
        readOnly={bodyguardModal.readOnly}
        onSave={handleSaveBodyguard}
      />
      <ConfirmDeleteDialog
        open={!!bodyguardToDelete}
        onClose={() => setBodyguardToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
        title="Видалити охоронця?"
        message="Цю дію не можна скасувати."
      />
    </>
  );
}

export default function SecurityOrganizationPage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();

  const partnerQuery = useQuery({
    queryKey: partnerId
      ? queryKeys.organizations.detail("SECURITY", partnerId)
      : ["organizations", "detail", "SECURITY", "none"],
    queryFn: () => getOrganization(partnerId!, "SECURITY"),
    enabled: Boolean(partnerId),
    // select: (dto) => dtoToPartner(dto),
  });

  const partner = partnerQuery.data ?? null;
  const loading = partnerQuery.isPending;
  const loadError =
    partnerQuery.isError && partnerQuery.error
      ? isNotFoundError(partnerQuery.error)
        ? "No results"
        : getApiErrorMessage(partnerQuery.error, "Failed to load partner")
      : null;

  if (!partnerId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Partner not found.
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

  if (loading) {
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

  if (!partner) {
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
        <SecurityBodyguardsSection
          key={partnerId}
          // partner={partner}
          partnerId={partnerId}
        />
      </Container>
    </Box>
  );
}
