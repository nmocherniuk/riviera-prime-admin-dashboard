import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SecurityPartnersHeader from "../features/partners/Security/components/SecurityPartnersHeader";
import SecurityPartnersStats from "../features/partners/Security/components/SecurityPartnersStats";
import SecurityPartnersToolbar from "../features/partners/Security/components/SecurityPartnersToolbar";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import type { Partner } from "../features/partners/Security/data/types";
import PartnerManagementModal, {
  type PartnerFormValues,
} from "../features/partners/Security/components/PartnerManagementModal";
import PartnersTable from "../features/partners/Security/components/PartnersTable";
import {
  createOrganization,
  deleteOrganization,
  dtoToPartner,
  getApiErrorMessage,
  isNotFoundError,
  listOrganizations,
  partnerFormToCreateBody,
  partnerFormToUpdateBody,
  updateOrganization,
} from "../api/organizations";
import { queryKeys } from "../api/queryKeys";

export default function SecurityOrganizationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const [partnerModal, setPartnerModal] = useState<{
    open: boolean;
    partner: Partner | null;
    readOnly?: boolean;
  }>({
    open: false,
    partner: null,
    readOnly: false,
  });
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  const partnersQuery = useQuery({
    queryKey: queryKeys.organizations.list("SECURITY"),
    queryFn: () => listOrganizations("SECURITY"),
  });

  const allPartners = useMemo(() => {
    if (
      partnersQuery.isError &&
      partnersQuery.error &&
      isNotFoundError(partnersQuery.error)
    ) {
      return [];
    }
    if (!partnersQuery.data) return [];
    return partnersQuery.data.map(dtoToPartner);
  }, [partnersQuery.data, partnersQuery.isError, partnersQuery.error]);

  const loading = partnersQuery.isPending;
  const listError =
    partnersQuery.error && !isNotFoundError(partnersQuery.error)
      ? getApiErrorMessage(partnersQuery.error, "Failed to load partners")
      : null;

  const activeCount = useMemo(
    () => allPartners.filter((p) => p.status === "active").length,
    [allPartners],
  );
  const inactiveCount = allPartners.length - activeCount;

  const handleSavePartner = async (
    partnerId: string | null,
    values: PartnerFormValues,
  ) => {
    try {
      setError(null);
      if (partnerId) {
        await updateOrganization(
          partnerId,
          partnerFormToUpdateBody(values),
          "SECURITY",
        );
      } else {
        await createOrganization(partnerFormToCreateBody(values));
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });
    } catch (e) {
      const msg = getApiErrorMessage(e, "Failed to save partner");
      setError(msg);
      throw e;
    }
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        {error ?? listError ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error ?? listError}
          </Alert>
        ) : null}

        <SecurityPartnersHeader
          onAddPartner={() =>
            setPartnerModal({ open: true, partner: null, readOnly: false })
          }
        />
        <Box sx={{ mt: 2 }}>
          <SecurityPartnersStats
            totalPartners={allPartners.length}
            activePartners={activeCount}
            inactivePartners={inactiveCount}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <SecurityPartnersToolbar />
        </Box>
        <Box sx={{ mt: 2, position: "relative", minHeight: loading ? 200 : 0 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : listError ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              Unable to load partners.
            </Box>
          ) : allPartners.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              No organizations found.
            </Box>
          ) : (
            <PartnersTable
              partners={allPartners}
              onPartnerView={(partner) =>
                setPartnerModal({ open: true, partner, readOnly: true })
              }
              onPartnerEdit={(partner) =>
                setPartnerModal({ open: true, partner, readOnly: false })
              }
              onPartnerDelete={(partner) => setPartnerToDelete(partner)}
              onViewBodyguards={(partner) =>
                navigate(`/security-partners/${partner.id}`)
              }
            />
          )}
        </Box>
        <PartnerManagementModal
          open={partnerModal.open}
          onClose={() => setPartnerModal((prev) => ({ ...prev, open: false }))}
          partner={partnerModal.partner}
          readOnly={partnerModal.readOnly}
          onSave={handleSavePartner}
        />
        <ConfirmDeleteDialog
          open={!!partnerToDelete}
          onClose={() => setPartnerToDelete(null)}
          onConfirm={async () => {
            if (!partnerToDelete) return;
            setError(null);
            try {
              await deleteOrganization(partnerToDelete.id, "SECURITY");
              await queryClient.invalidateQueries({
                queryKey: queryKeys.organizations.all,
              });
            } catch (e) {
              setError(getApiErrorMessage(e, "Failed to delete partner"));
              throw e;
            }
          }}
          title="Видалити партнера?"
          message="Цю дію не можна скасувати. Запис буде видалено назавжди."
        />
      </Container>
    </Box>
  );
}
