import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { queryKeys } from "../api/queryKeys";

export default function FleetPage() {
  const queryClient = useQueryClient();
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

  const vehiclesQuery = useQuery({
    queryKey: queryKeys.vehicles.list(),
    queryFn: () => listVehicles(),
  });

  const organizationsForFleetQuery = useQuery({
    queryKey: queryKeys.organizations.list("CHAUFFEUR"),
    queryFn: () => listOrganizations("CHAUFFEUR"),
  });

  const driversQuery = useQuery({
    queryKey: queryKeys.drivers.list(),
    queryFn: () => listDrivers(),
  });

  const allVehicles = useMemo(() => {
    if (
      vehiclesQuery.isError &&
      vehiclesQuery.error &&
      isNotFoundError(vehiclesQuery.error)
    ) {
      return [];
    }
    if (!vehiclesQuery.data) return [];
    return vehiclesQuery.data.map(dtoToFleetVehicle);
  }, [vehiclesQuery.data, vehiclesQuery.isError, vehiclesQuery.error]);

  const organizationOptions = useMemo(
    () =>
      (organizationsForFleetQuery.data ?? []).map((o) => ({
        id: o.id,
        name: o.title,
      })),
    [organizationsForFleetQuery.data],
  );

  const driverOptions = useMemo(
    () =>
      (driversQuery.data ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        organizationId: d.organizationId,
      })),
    [driversQuery.data],
  );

  const loading = vehiclesQuery.isPending;
  const vehiclesError = vehiclesQuery.error;
  const listError =
    vehiclesError && !isNotFoundError(vehiclesError)
      ? getApiErrorMessage(vehiclesError, "Failed to load vehicles")
      : null;

  const handleDeleteClick = (vehicle: FleetVehicle) => {
    setVehicleToDelete(vehicle);
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDelete) {
      setError(null);
      try {
        await deleteVehicle(vehicleToDelete.id);
        await queryClient.invalidateQueries({
          queryKey: queryKeys.vehicles.all,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.drivers.all,
        });
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
      await queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.all,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all });
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
        {(error ?? listError) ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error ?? listError}
          </Alert>
        ) : null}

        <FleetHeader
          onAddFleet={() =>
            setFleetModal({ open: true, vehicle: null, readOnly: false })
          }
        />
        <Box sx={{ mt: 2 }}>
          <FleetStats vehicles={allVehicles} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FleetToolbar />
        </Box>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : listError ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              Unable to load vehicles.
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
