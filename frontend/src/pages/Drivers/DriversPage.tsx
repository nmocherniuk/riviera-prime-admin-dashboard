import { Box, Container } from "@mui/material";
import { useMemo, useState } from "react";
import DriversHeader from "./components/DriversHeader";
import DriversStats from "./components/DriversStats";
import DriversToolbar from "./components/DriversToolbar";
import DriversTable from "./components/DriversTable";
import DriverManagementModal from "./components/DriverManagementModal";
import ConfirmDeleteDialog from "../../components/ui/ConfirmDeleteDialog";
import { DUMMY_DRIVERS } from "./data/dummyDrivers";
import type { Driver } from "./data/dummyDrivers";

const ROWS_PER_PAGE = 4;
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
  const [page, setPage] = useState(1);
  const [allDrivers, setAllDrivers] = useState<Driver[]>(() => buildDriversList());
  const [driverModal, setDriverModal] = useState<{ open: boolean; driver: Driver | null; readOnly?: boolean }>({
    open: false,
    driver: null,
    readOnly: false,
  });
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const drivers = useMemo(
    () =>
      allDrivers.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [allDrivers, page]
  );

  const handleDriverDelete = (driver: Driver) => {
    setAllDrivers((prev) => prev.filter((d) => d.id !== driver.id));
  };

  const handleDeleteClick = (driver: Driver) => {
    setDriverToDelete(driver);
  };

  const handleConfirmDelete = () => {
    if (driverToDelete) {
      handleDriverDelete(driverToDelete);
      setDriverToDelete(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}>
        <DriversHeader onAddDriver={() => setDriverModal({ open: true, driver: null, readOnly: false })} />
        <Box sx={{ mt: 2 }}>
          <DriversStats />
        </Box>
        <Box sx={{ mt: 2 }}>
          <DriversToolbar />
        </Box>
        <Box sx={{ mt: 2 }}>
          <DriversTable
            drivers={drivers}
            page={page}
            onPageChange={setPage}
            onDriverView={(driver) => setDriverModal({ open: true, driver, readOnly: true })}
            onDriverEdit={(driver) => setDriverModal({ open: true, driver, readOnly: false })}
            onDriverDelete={handleDeleteClick}
          />
        </Box>
        <DriverManagementModal
          open={driverModal.open}
          onClose={() => setDriverModal((prev) => ({ ...prev, open: false }))}
          driver={driverModal.driver}
          readOnly={driverModal.readOnly}
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
