import { Box, Container } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DUMMY_DRIVER_ORGANIZATIONS } from "../features/partners/Drivers/data/dummyDriverOrganizations";
import type { DriverOrganization } from "../features/partners/Drivers/data/types";
import type { DriverOrganizationFormValues } from "../features/partners/Drivers/components/drivers/DriverOrganizationManagementModal";
import DriversOrganizationsHeader from "../features/partners/Drivers/components/DriversOrganizationsHeader";
import DriversOrganizationsStats from "../features/partners/Drivers/components/DriversOrganizationsStats";
import DriversOrganizationsToolbar from "../features/partners/Drivers/components/DriversOrganizationsToolbar";
import DriversOrganizationsTable from "../features/partners/Drivers/components/DriversOrganizationsTable";
import DriverOrganizationManagementModal from "../features/partners/Drivers/components/drivers/DriverOrganizationManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

const ROWS_PER_PAGE = 4;

export default function DriverOrganizationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const [allOrganizations, setAllOrganizations] = useState<
    DriverOrganization[]
  >(() => [...DUMMY_DRIVER_ORGANIZATIONS]);

  const [orgModal, setOrgModal] = useState<{
    open: boolean;
    organization: DriverOrganization | null;
    readOnly?: boolean;
  }>({ open: false, organization: null, readOnly: false });

  const [orgToDelete, setOrgToDelete] = useState<DriverOrganization | null>(
    null,
  );

  const organizations = useMemo(() => {
    return allOrganizations.slice(
      (page - 1) * ROWS_PER_PAGE,
      page * ROWS_PER_PAGE,
    );
  }, [allOrganizations, page]);

  const handleSaveOrganization = (
    organizationId: string | null,
    values: DriverOrganizationFormValues,
  ) => {
    if (organizationId) {
      setAllOrganizations((prev) =>
        prev.map((o) => (o.id === organizationId ? { ...o, ...values } : o)),
      );
    } else {
      const newId = `ORG-${String(allOrganizations.length + 1).padStart(3, "0")}`;
      setAllOrganizations((prev) => [...prev, { id: newId, ...values }]);
    }
  };

  const handleDeleteOrganization = (org: DriverOrganization) => {
    setAllOrganizations((prev) => prev.filter((o) => o.id !== org.id));
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
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
          <DriversOrganizationsStats />
        </Box>

        <Box sx={{ mt: 2 }}>
          <DriversOrganizationsToolbar />
        </Box>

        <Box sx={{ mt: 2 }}>
          <DriversOrganizationsTable
            organizations={organizations}
            page={page}
            totalCount={allOrganizations.length}
            onPageChange={setPage}
            onViewDrivers={(org) => navigate(`/drivers-partners/${org.id}`)}
            onViewDetails={(org) =>
              setOrgModal({ open: true, organization: org, readOnly: true })
            }
            onEdit={(org) =>
              setOrgModal({ open: true, organization: org, readOnly: false })
            }
            onDelete={(org) => setOrgToDelete(org)}
          />
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
          onConfirm={() => {
            if (!orgToDelete) return;
            handleDeleteOrganization(orgToDelete);
            setOrgToDelete(null);
          }}
          title="Видалити організацію?"
          message="Цю дію не можна скасувати. Запис буде видалено назавжди."
        />
      </Container>
    </Box>
  );
}
