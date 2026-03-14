import { Box, Container } from "@mui/material";
import { useMemo, useState } from "react";
import FleetHeader from "./components/FleetHeader";
import FleetStats from "./components/FleetStats";
import FleetToolbar from "./components/FleetToolbar";
import FleetTable from "./components/FleetTable";
import FleetManagementModal from "./components/FleetManagementModal";
import { DUMMY_FLEET } from "./data/dummyFleet";
import type { FleetVehicle } from "./data/dummyFleet";

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
  const [fleetModal, setFleetModal] = useState<{ open: boolean; vehicle: FleetVehicle | null }>({
    open: false,
    vehicle: null,
  });
  const allVehicles = useMemo(buildFleetList, []);
  const vehicles = useMemo(
    () =>
      allVehicles.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [allVehicles, page]
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}>
        <FleetHeader onAddFleet={() => setFleetModal({ open: true, vehicle: null })} />
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
            onVehicleClick={(v) => setFleetModal({ open: true, vehicle: v })}
          />
        </Box>
        <FleetManagementModal
          open={fleetModal.open}
          onClose={() => setFleetModal({ open: false, vehicle: null })}
          vehicle={fleetModal.vehicle}
        />
      </Container>
    </Box>
  );
}
