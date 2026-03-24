import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DriverOrganization } from "../features/partners/Drivers/data/types";
import type { DriverOrganizationFormValues } from "../features/partners/Drivers/components/drivers/DriverOrganizationManagementModal";
import DriversOrganizationsHeader from "../features/partners/Drivers/components/DriversOrganizationsHeader";
import DriversOrganizationsStats from "../features/partners/Drivers/components/DriversOrganizationsStats";
import DriversOrganizationsToolbar from "../features/partners/Drivers/components/DriversOrganizationsToolbar";
import DriversOrganizationsTable from "../features/partners/Drivers/components/DriversOrganizationsTable";
import DriverOrganizationManagementModal from "../features/partners/Drivers/components/drivers/DriverOrganizationManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import {
  createOrganization,
  deleteOrganization,
  driverFormToCreateBody,
  driverFormToUpdateBody,
  dtoToDriverOrganization,
  getApiErrorMessage,
  isNotFoundError,
  listOrganizations,
  updateOrganization,
} from "../api/organizations";

export default function DriverOrganizationsPage() {
  const navigate = useNavigate();

  const [allOrganizations, setAllOrganizations] = useState<
    DriverOrganization[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orgModal, setOrgModal] = useState<{
    open: boolean;
    organization: DriverOrganization | null;
    readOnly?: boolean;
  }>({ open: false, organization: null, readOnly: false });

  const [orgToDelete, setOrgToDelete] = useState<DriverOrganization | null>(
    null,
  );

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listOrganizations("CHAUFFEUR");
      setAllOrganizations(rows.map(dtoToDriverOrganization));
    } catch (e) {
      if (isNotFoundError(e)) {
        setAllOrganizations([]);
      } else {
        setError(getApiErrorMessage(e, "Failed to load organizations"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  const activeCount = useMemo(
    () => allOrganizations.filter((o) => o.status === "active").length,
    [allOrganizations],
  );
  const inactiveCount = allOrganizations.length - activeCount;

  const handleSaveOrganization = async (
    organizationId: string | null,
    values: DriverOrganizationFormValues,
  ) => {
    try {
      setError(null);
      if (organizationId) {
        await updateOrganization(
          organizationId,
          driverFormToUpdateBody(values),
          "CHAUFFEUR",
        );
      } else {
        await createOrganization(driverFormToCreateBody(values));
      }
      await loadOrganizations();
    } catch (e) {
      const msg = getApiErrorMessage(e, "Failed to save organization");
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
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
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
            totalOrganizations={allOrganizations.length}
            activeOrganizations={activeCount}
            inactiveOrganizations={inactiveCount}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <DriversOrganizationsToolbar />
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
          ) : allOrganizations.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              No organizations found.
            </Box>
          ) : (
            <DriversOrganizationsTable
              organizations={allOrganizations}
              onViewDrivers={(org) => navigate(`/drivers-partners/${org.id}`)}
              onViewDetails={(org) =>
                setOrgModal({ open: true, organization: org, readOnly: true })
              }
              onEdit={(org) =>
                setOrgModal({ open: true, organization: org, readOnly: false })
              }
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
            if (!orgToDelete) return;
            setError(null);
            try {
              await deleteOrganization(orgToDelete.id, "CHAUFFEUR");
              await loadOrganizations();
            } catch (e) {
              setError(getApiErrorMessage(e, "Failed to delete organization"));
              throw e;
            }
          }}
          title="Видалити організацію?"
          message="Цю дію не можна скасувати. Запис буде видалено назавжди."
        />
      </Container>
    </Box>
  );
}
