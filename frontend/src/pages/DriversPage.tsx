import { Box, Button, Container, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  DUMMY_DRIVERS,
  type Driver,
} from "../features/partners/Drivers/data/dummyDrivers";
import type { DriverOrganization } from "../features/partners/Drivers/data/types";
import { DUMMY_DRIVER_ORGANIZATIONS } from "../features/partners/Drivers/data/dummyDriverOrganizations";
import type { DriverFormValues } from "../features/partners/Drivers/components/drivers/DriverManagementModal";
import DriverManagementModal from "../features/partners/Drivers/components/drivers/DriverManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import DriversTable from "../features/partners/Drivers/components/drivers/DriversTable";
import DriversHeader from "../features/partners/Drivers/components/drivers/DriversHeader";
import DriversStats from "../features/partners/Drivers/components/drivers/DriversStats";

const TOTAL_DRIVERS = 28;

function buildDriversList(): Driver[] {
  const list: Driver[] = [];
  while (list.length < TOTAL_DRIVERS) {
    for (const d of DUMMY_DRIVERS) {
      if (list.length >= TOTAL_DRIVERS) break;
      list.push({
        ...d,
        id: `DRV-${String(list.length + 1).padStart(3, "0")}`,
      });
    }
  }
  return list;
}

export default function DriversPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();

  const organization: DriverOrganization | undefined = useMemo(() => {
    if (!organizationId) return undefined;
    return DUMMY_DRIVER_ORGANIZATIONS.find((o) => o.id === organizationId);
  }, [organizationId]);

  const [allDrivers, setAllDrivers] = useState<Driver[]>(() =>
    buildDriversList(),
  );
  const [driverModal, setDriverModal] = useState<{
    open: boolean;
    driver: Driver | null;
    readOnly?: boolean;
  }>({ open: false, driver: null, readOnly: false });
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const drivers = useMemo(() => {
    if (!organizationId) return [];
    return allDrivers.filter((d) => d.organizationId === organizationId);
  }, [allDrivers, organizationId]);

  const handleSaveDriver = useCallback(
    (driverId: string, values: DriverFormValues) => {
      setAllDrivers((prev) =>
        prev.map((d) => {
          if (d.id !== driverId) return d;
          const fullName = `${values.name} ${values.surname}`.trim();
          return {
            ...d,
            name: fullName || d.name,
            vehicle: values.vehicle || d.vehicle,
          };
        }),
      );
      setDriverModal({ open: false, driver: null, readOnly: false });
    },
    [],
  );

  const handleDeleteClick = useCallback(
    (driver: Driver) => setDriverToDelete(driver),
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!driverToDelete) return;
    setAllDrivers((prev) => prev.filter((d) => d.id !== driverToDelete.id));
    setDriverToDelete(null);
  }, [driverToDelete]);

  if (!organizationId || !organization) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Organization not found.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/drivers-partners")}
          sx={{ mt: 2, textTransform: "none" }}
        >
          Back to organizations
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
          <DriversHeader
            organization={organization}
            onAddDriver={() =>
              setDriverModal({ open: true, driver: null, readOnly: false })
            }
          />
        </Box>

        <Box sx={{ pt: { xs: 1, md: 2 } }}>
          <DriversStats />
        </Box>

        <Box sx={{ mt: 2 }}>
          <DriversTable
            drivers={drivers}
            onDriverView={(d) =>
              setDriverModal({ open: true, driver: d, readOnly: true })
            }
            onDriverEdit={(d) =>
              setDriverModal({ open: true, driver: d, readOnly: false })
            }
            onDriverDelete={handleDeleteClick}
          />
        </Box>

        <DriverManagementModal
          open={driverModal.open}
          onClose={() => setDriverModal((prev) => ({ ...prev, open: false }))}
          driver={driverModal.driver}
          readOnly={driverModal.readOnly}
          onSave={handleSaveDriver}
        />

        <ConfirmDeleteDialog
          open={!!driverToDelete}
          onClose={() => setDriverToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Видалити водія?"
          message="Цю дію не можна скасувати. Запис буде видалено назавжди."
        />
      </Container>
    </Box>
  );
}
