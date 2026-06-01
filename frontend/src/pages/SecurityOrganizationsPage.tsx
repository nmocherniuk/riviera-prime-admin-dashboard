import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SecurityPartnersHeader from "../features/partners/Security/components/SecurityPartnersHeader";
import SecurityPartnersToolbar from "../features/partners/Security/components/SecurityOrganizationToolbar";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

import SecurityOrganizationTable from "../features/partners/Security/components/SecutiryOrganizationTable";
import {
  createOrganization,
  deleteOrganization,
  getApiErrorMessage,
  isNotFoundError,
  listOrganizations,
  updateOrganization,
} from "../api/organizations";
import { queryKeys } from "../api/queryKeys";
import type { SecurityOrganization, SecurityOrganizationFormValues } from "../features/partners/Security/data/types";
import { formValuesToSecurityOrganization } from "../features/partners/Security/components/ModalManagement/securityOrganizationForm.mapper";
import { useToast } from "../providers/ToastProvider";
import SecurityOrganizationManagementModal from "../features/partners/Security/components/ModalManagement/SecurityOrganizationManagementModal";
import SecurityOrganizationStats from "../features/partners/Security/components/SecurityOrganizationStats";
import { securityPartnersContent } from "../content/securityPartners";
import { useModalFormErrors } from "../hooks/useModalFormErrors";

export default function SecurityOrganizationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const [orgModal, setOrgModal] = useState<{
    open: boolean;
    organization: SecurityOrganization | null;
    readOnly?: boolean;
  }>({
    open: false,
    organization: null,
    readOnly: false,
  });
  const [orgToDelete, setOrgToDelete] = useState<SecurityOrganization | null>(null);
  const { showToast } = useToast();
  const {
    fieldErrors,
    clearFieldError,
    clearAllFieldErrors,
    applySubmitError,
  } = useModalFormErrors();

  const { data: securityOrganizations = [], isPending, error: securityOrganizationsError } = useQuery({
    queryKey: queryKeys.organizations.list("SECURITY"),
    queryFn: async () => {
      return await listOrganizations("SECURITY");
    },
  });

  const listError =
    securityOrganizationsError && !isNotFoundError(securityOrganizationsError)
      ? getApiErrorMessage(securityOrganizationsError, securityPartnersContent.errors.loadList)
      : null;

  const activeCount = useMemo(
    () => securityOrganizations.filter((o) => o.status).length,
    [securityOrganizations],
  );
  const inactiveCount = securityOrganizations.length - activeCount;

  const handleSavePartner = async (
    organizationId: string | null,
    values: SecurityOrganizationFormValues,
  ) => {
    try {
      setError(null);
      clearAllFieldErrors();
      if (organizationId) {
        await updateOrganization(
          organizationId,
          formValuesToSecurityOrganization(values),
        );
      } else {
        await createOrganization(formValuesToSecurityOrganization(values));
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });

      showToast({
        message: organizationId
          ? securityPartnersContent.toasts.updated
          : securityPartnersContent.toasts.created,
        severity: "success",
      });

      setOrgModal((prev) => ({
        ...prev,
        open: false,
        organization: null,
      }));
    } catch (e) {
      const msg = applySubmitError(e, securityPartnersContent.errors.save);
      showToast({ message: msg, severity: "error" });
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
          onAddOrganization={() => {
            clearAllFieldErrors();
            setOrgModal({ open: true, organization: null, readOnly: false });
          }}
        />
        <Box sx={{ mt: 2 }}>
          <SecurityOrganizationStats
            totalOrganizations={securityOrganizations.length}
            activeOrganizations={activeCount}
            inactiveOrganizations={inactiveCount}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <SecurityPartnersToolbar />
        </Box>
        <Box sx={{ mt: 2, position: "relative", minHeight: isPending ? 200 : 0 }}>
          {isPending ? (
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
              {securityPartnersContent.empty.unableToLoad}
            </Box>
          ) : securityOrganizations.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              {securityPartnersContent.empty.noneFound}
            </Box>
          ) : (
            <SecurityOrganizationTable
              organizations={securityOrganizations as SecurityOrganization[]}
              onOrganizationView={(organization) => {
                clearAllFieldErrors();
                setOrgModal({ open: true, organization, readOnly: true });
              }}
              onOrganizationEdit={(organization) => {
                clearAllFieldErrors();
                setOrgModal({ open: true, organization, readOnly: false });
              }}
              onOrganizationDelete={(organization) => setOrgToDelete(organization)}
              onViewBodyguards={(organization) =>
                navigate(`/security-partners/${organization.id}`)
              }
            />
          )}
        </Box>
        <SecurityOrganizationManagementModal
          open={orgModal.open}
          onClose={() => {
            clearAllFieldErrors();
            setOrgModal((prev) => ({ ...prev, open: false }));
          }}
          organization={orgModal.organization}
          readOnly={orgModal.readOnly}
          fieldErrors={fieldErrors}
          onClearFieldError={clearFieldError}
          onSave={handleSavePartner}
        />
        <ConfirmDeleteDialog
          open={!!orgToDelete}
          onClose={() => setOrgToDelete(null)}
          onConfirm={async () => {
            if (!orgToDelete?.id) return;
            setError(null);

            try {
              await deleteOrganization(orgToDelete.id);
              await queryClient.invalidateQueries({
                queryKey: queryKeys.organizations.all,
              });

              showToast({
                message: securityPartnersContent.toasts.deleted,
                severity: "success",
              });
            } catch (e) {
              showToast({ message: getApiErrorMessage(e, securityPartnersContent.errors.delete), severity: "error" });
              throw e;
            }
          }}
          title={securityPartnersContent.deleteDialog.title}
          message={securityPartnersContent.deleteDialog.message}
        />
      </Container>
    </Box>
  );
}
