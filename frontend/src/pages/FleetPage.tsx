import { Box, Container } from "@mui/material";
import { useMemo, useState } from "react";
import FleetHeader from "../features/Fleet/components/FleetHeader";
import FleetStats from "../features/Fleet/components/FleetStats";
import FleetToolbar from "../features/Fleet/components/FleetToolbar";
import FleetTable from "../features/Fleet/components/FleetTable";
import FleetManagementModal from "../features/Fleet/components/FleetManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import { DUMMY_FLEET } from "../features/Fleet/data/dummyFleet";
import type { FleetVehicle } from "../features/Fleet/data/dummyFleet";

const ROWS_PER_PAGE = 4;
const TOTAL_FLEET = 28;

function buildFleetList(): FleetVehicle[] {
  const list: FleetVehicle[] = [];
  while (list.length < TOTAL_FLEET) {
    for (const v of DUMMY_FLEET) {
      if (list.length >= TOTAL_FLEET) break;
      list.push({
        ...v,
        id: `DRV-${String(list.length + 1).padStart(3, "0")}`,
      });
    }
  }
  return list;
}

export default function FleetPage() {
  const [page, setPage] = useState(1);
  const [allVehicles, setAllVehicles] = useState<FleetVehicle[]>(() =>
    buildFleetList(),
  );
  const [fleetModal, setFleetModal] = useState<{
    open: boolean;
    vehicle: FleetVehicle | null;
    readOnly?: boolean;
  }>({
    open: false,
    vehicle: null,
    readOnly: false,
  });
  const [vehicleToDelete, setVehicleToDelete] = useState<FleetVehicle | null>(
    null,
  );
  const vehicles = useMemo(
    () => allVehicles.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [allVehicles, page],
  );

  const handleVehicleDelete = (vehicle: FleetVehicle) => {
    setAllVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
  };

  const handleDeleteClick = (vehicle: FleetVehicle) => {
    setVehicleToDelete(vehicle);
  };

  const handleConfirmDelete = () => {
    if (vehicleToDelete) {
      handleVehicleDelete(vehicleToDelete);
      setVehicleToDelete(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        <FleetHeader
          onAddFleet={() =>
            setFleetModal({ open: true, vehicle: null, readOnly: false })
          }
        />
        <Box sx={{ mt: 2 }}>
          <FleetStats />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FleetToolbar />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FleetTable
            vehicles={vehicles}
            page={page}
            onPageChange={setPage}
            onVehicleView={(v) =>
              setFleetModal({ open: true, vehicle: v, readOnly: true })
            }
            onVehicleEdit={(v) =>
              setFleetModal({ open: true, vehicle: v, readOnly: false })
            }
            onVehicleDelete={handleDeleteClick}
          />
        </Box>
        <FleetManagementModal
          open={fleetModal.open}
          onClose={() => setFleetModal((prev) => ({ ...prev, open: false }))}
          vehicle={fleetModal.vehicle}
          readOnly={fleetModal.readOnly}
        />
        <ConfirmDeleteDialog
          open={!!vehicleToDelete}
          onClose={() => setVehicleToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Видалити авто?"
          message="Цю дію не можна скасувати. Запис буде видалено назавжди."
        />
      </Container>
    </Box>
  );
}
