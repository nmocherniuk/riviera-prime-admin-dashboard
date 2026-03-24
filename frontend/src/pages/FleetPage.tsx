import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import FleetHeader from "../features/Fleet/components/FleetHeader";
import FleetStats from "../features/Fleet/components/FleetStats";
import FleetToolbar from "../features/Fleet/components/FleetToolbar";
import FleetTable from "../features/Fleet/components/FleetTable";
import FleetManagementModal from "../features/Fleet/components/FleetManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import type { FleetVehicle } from "../features/Fleet/data/dummyFleet";
import type { FleetFormValues } from "../features/Fleet/components/FleetManagementModal";
import {
  createVehicle,
  deleteVehicle,
  dtoToFleetVehicle,
  fleetFormToCreateBody,
  fleetFormToUpdateBody,
  listVehicles,
  updateVehicle,
} from "../api/vehicles";
import {
  getApiErrorMessage,
  isNotFoundError,
  listOrganizations,
} from "../api/organizations";
import { listDrivers } from "../api/drivers";

export default function FleetPage() {
  const [allVehicles, setAllVehicles] = useState<FleetVehicle[]>([]);
  const [organizationOptions, setOrganizationOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [driverOptions, setDriverOptions] = useState<
    Array<{ id: string; name: string; organizationId: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listVehicles();
      setAllVehicles(rows.map(dtoToFleetVehicle));
    } catch (e) {
      if (isNotFoundError(e)) {
        setAllVehicles([]);
      } else {
        setError(getApiErrorMessage(e, "Failed to load vehicles"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRelations = useCallback(async () => {
    try {
      const [orgRows, driverRows] = await Promise.all([
        listOrganizations("CHAUFFEUR"),
        listDrivers(),
      ]);
      setOrganizationOptions(orgRows.map((o) => ({ id: o.id, name: o.title })));
      setDriverOptions(
        driverRows.map((d) => ({
          id: d.id,
          name: d.name,
          organizationId: d.organizationId,
        })),
      );
    } catch {
      // Keep main flow working even if relation options failed to load.
    }
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    void loadRelations();
  }, [loadRelations]);

  const handleDeleteClick = (vehicle: FleetVehicle) => {
    setVehicleToDelete(vehicle);
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDelete) {
      setError(null);
      try {
        await deleteVehicle(vehicleToDelete.id);
        await loadVehicles();
        setVehicleToDelete(null);
      } catch (e) {
        setError(getApiErrorMessage(e, "Failed to delete vehicle"));
        throw e;
      }
    }
  };

  const handleSaveVehicle = async (
    vehicleId: string | null,
    values: FleetFormValues,
  ) => {
    setError(null);
    try {
      if (vehicleId) {
        await updateVehicle(vehicleId, fleetFormToUpdateBody(values));
      } else {
        await createVehicle(fleetFormToCreateBody(values));
      }
      await loadVehicles();
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to save vehicle"));
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
          {loading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : allVehicles.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              No results
            </Box>
          ) : (
            <FleetTable
              vehicles={allVehicles}
              onVehicleView={(v) =>
                setFleetModal({ open: true, vehicle: v, readOnly: true })
              }
              onVehicleEdit={(v) =>
                setFleetModal({ open: true, vehicle: v, readOnly: false })
              }
              onVehicleDelete={handleDeleteClick}
            />
          )}
        </Box>
        <FleetManagementModal
          open={fleetModal.open}
          onClose={() => setFleetModal((prev) => ({ ...prev, open: false }))}
          vehicle={fleetModal.vehicle}
          readOnly={fleetModal.readOnly}
          organizations={organizationOptions}
          drivers={driverOptions}
          onSave={handleSaveVehicle}
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
