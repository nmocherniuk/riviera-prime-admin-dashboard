import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { DriverOrganization, DriverOrganizationFormValues } from "../features/partners/Drivers/data/types";
import DriversOrganizationsHeader from "../features/partners/Drivers/components/DriversOrganizationsHeader";
import DriversOrganizationsToolbar from "../features/partners/Drivers/components/DriversOrganizationsToolbar";
import DriversOrganizationsTable from "../features/partners/Drivers/components/DriversOrganizationsTable";
import DriverOrganizationManagementModal from "../features/partners/Drivers/components/ModalManagement/DriverOrganizationManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import {
  createOrganization,
  deleteOrganization,
  getApiErrorMessage,
  isNotFoundError,
  listOrganizations,
  updateOrganization,
} from "../api/organizations";
import { queryKeys } from "../api/queryKeys";
import { formValuesToDriverOrganization } from "../features/partners/Drivers/components/ModalManagement/driverOrganizationForm.mapper";
import DriversOrganizationsStats from "../features/partners/Drivers/components/DriversOrganizationsStats";
import { useToast } from "../providers/ToastProvider";

export default function DriverOrganizationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [error, setError] = useState<string | null>(null);

  const [orgModal, setOrgModal] = useState<{
    open: boolean;
    organization: DriverOrganization | null;
    readOnly?: boolean;
  }>({ open: false, organization: null, readOnly: false });

  const [orgToDelete, setOrgToDelete] = useState<DriverOrganization | null>(
    null,
  );

  const { data: driverOrganizations = [], isPending, error: driverOrganizationsError } = useQuery({
    queryKey: queryKeys.organizations.list("CHAUFFEUR"),
    queryFn: async () => {
      return await listOrganizations("CHAUFFEUR");
    },
  });

  const listError =
    driverOrganizationsError && !isNotFoundError(driverOrganizationsError)
      ? getApiErrorMessage(
        driverOrganizationsError,
        "Failed to load organizations",
      )
      : null;

  const activeCount = useMemo(
    () => driverOrganizations.filter((o) => o.status).length,
    [driverOrganizations],
  ) ?? 0;
  const inactiveCount = driverOrganizations.length - activeCount;

  const handleSaveOrganization = async (
    organizationId: string | null,
    values: DriverOrganizationFormValues,
  ) => {
    try {
      setError(null);
      if (organizationId) {
        await updateOrganization(
          organizationId,
          formValuesToDriverOrganization(values),
        );
      } else {
        await createOrganization(formValuesToDriverOrganization(values));
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });

      showToast({
        message: organizationId
          ? "Organization updated successfully."
          : "Organization created successfully.",
        severity: "success",
      });

      setOrgModal((prev) => ({
        ...prev,
        open: false,
        organization: null,
      }));
    } catch (e) {
      const msg = getApiErrorMessage(e, "Failed to save organization");
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
        {(error ?? listError) ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error ?? listError}
          </Alert>
        ) : null}

        <DriversOrganizationsHeader
          onAddOrganization={() =>
            setOrgModal({
              open: true,
              organization: null,
              readOnly: false,
            })
          }
        />

        <Box sx={{ mt: 2 }}>
          <DriversOrganizationsStats
            totalOrganizations={driverOrganizations.length}
            activeOrganizations={activeCount}
            inactiveOrganizations={inactiveCount}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <DriversOrganizationsToolbar />
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
              Unable to load organizations.
            </Box>
          ) : driverOrganizations && driverOrganizations.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              No organizations found.
            </Box>
          ) : (
            <DriversOrganizationsTable
              organizations={driverOrganizations as DriverOrganization[]}
              onViewDrivers={(org) => navigate(`/drivers-partners/${org.id}`)}
              onViewDetails={async (org) => {
                try {
                  setError(null);
                  setOrgModal({
                    open: true,
                    organization: org,
                    readOnly: true,
                  });
                } catch (e) {
                  setError(
                    getApiErrorMessage(e, "Failed to load organization"),
                  );
                }
              }}
              onEdit={async (org) => {
                try {
                  setError(null);
                  setOrgModal({
                    open: true,
                    organization: org,
                    readOnly: false,
                  });
                } catch (e) {
                  setError(
                    getApiErrorMessage(e, "Failed to load organization"),
                  );
                }
              }}
              onDelete={(org) => setOrgToDelete(org)}
            />
          )}
        </Box>

        <DriverOrganizationManagementModal
          open={orgModal.open}
          onClose={() =>
            setOrgModal((prev) => ({
              ...prev,
              open: false,
              organization: null,
            }))
          }
          organization={orgModal.organization}
          readOnly={orgModal.readOnly}
          onSave={handleSaveOrganization}
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
                message: "Organization deleted successfully.",
                severity: "success",
              });
            } catch (e) {
              showToast({ message: getApiErrorMessage(e, "Failed to delete organization"), severity: "error" });
              throw e;
            }
          }}
          title="Delete organization?"
          message="This action cannot be undone. The organization will be deleted permanently."
        />
      </Container>
    </Box>
  );
}
