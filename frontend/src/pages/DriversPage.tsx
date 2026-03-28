import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Driver } from "../features/partners/Drivers/data/dummyDrivers";
import type { DriverOrganization } from "../features/partners/Drivers/data/types";
import type { DriverFormValues } from "../features/partners/Drivers/components/drivers/ModalManagement/driverManagementForm.types";
import DriverManagementModal from "../features/partners/Drivers/components/drivers/ModalManagement/DriverManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import DriversTable from "../features/partners/Drivers/components/drivers/DriversTable";
import DriversHeader from "../features/partners/Drivers/components/drivers/DriversHeader";
import DriversStats from "../features/partners/Drivers/components/drivers/DriversStats";
import {
  // toGeneralInfoDriverOrganization,
  getApiErrorMessage,
  getOrganization,
  isNotFoundError,
} from "../api/organizations";
import {
  createDriver,
  deleteDriver,
  driverFormToCreateBody,
  driverFormToUpdateBody,
  dtoToDriver,
  listDrivers,
  updateDriver,
  type DriverDto,
} from "../api/drivers";
import type { VehicleDto } from "../api/vehicles";
import {
  assignDriverToVehicle,
  getVehicleIdFromDriverForm,
  listVehicles,
} from "../api/vehicles";
import { queryKeys } from "../api/queryKeys";

type VehiclesByDriver = Record<
  string,
  Array<{ id: string; label: string; vehicleClass: string }>
>;

type DriversPageData = {
  organization: DriverOrganization;
  allDrivers: Driver[];
  vehiclesByDriverId: VehiclesByDriver;
};

async function fetchDriversPageData(
  organizationId: string,
): Promise<DriversPageData> {
  const dto = await getOrganization(organizationId, "CHAUFFEUR");
  // const org = toGeneralInfoDriverOrganization(dto);
  let rows: DriverDto[] = [];
  let vehicles: VehicleDto[] = [];
  try {
    const [driverRows, vehicleRows] = await Promise.all([
      listDrivers(organizationId),
      listVehicles({ organizationId }),
    ]);
    rows = driverRows;
    vehicles = vehicleRows;
  } catch (e) {
    if (isNotFoundError(e)) {
      rows = [];
      vehicles = [];
    } else {
      throw e;
    }
  }
  const allDrivers = rows.map((row) => dtoToDriver(row, org.organizationName));
  const vehiclesByDriverId = vehicles.reduce<VehiclesByDriver>((acc, v) => {
    if (!v.driverId) return acc;
    if (!acc[v.driverId]) acc[v.driverId] = [];
    acc[v.driverId].push({
      id: v.id,
      label: v.vehicleName,
      vehicleClass: v.class,
    });
    return acc;
  }, {});
  return { organization: org, allDrivers, vehiclesByDriverId };
}

export default function DriversPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const driversPageQuery = useQuery({
    queryKey: organizationId
      ? queryKeys.drivers.byOrganization(organizationId)
      : ["drivers", "byOrganization", "none"],
    queryFn: () => fetchDriversPageData(organizationId!),
    enabled: Boolean(organizationId),
  });

  const organization = useMemo(
    () => driversPageQuery.data?.organization,
    [driversPageQuery.data],
  );

  const allDrivers = useMemo(
    () => driversPageQuery.data?.allDrivers ?? [],
    [driversPageQuery.data],
  );

  const vehiclesByDriverId = useMemo(
    () => driversPageQuery.data?.vehiclesByDriverId ?? ({} as VehiclesByDriver),
    [driversPageQuery.data],
  );

  const orgLoading = driversPageQuery.isPending;
  const driversLoading = driversPageQuery.isPending;
  const fetchError =
    driversPageQuery.isError && driversPageQuery.error
      ? isNotFoundError(driversPageQuery.error)
        ? "No results"
        : getApiErrorMessage(
          driversPageQuery.error,
          "Failed to load drivers page",
        )
      : null;

  const [driversError, setDriversError] = useState<string | null>(null);

  const [driverModal, setDriverModal] = useState<{
    open: boolean;
    driver: Driver | null;
    readOnly?: boolean;
  }>({ open: false, driver: null, readOnly: false });
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const handleSaveDriver = useCallback(
    async (driverId: string | null, values: DriverFormValues) => {
      if (!organizationId) return;

      try {
        setDriversError(null);
        if (driverId) {
          const current = allDrivers.find((d) => d.id === driverId);
          if (!current) {
            throw new Error("Driver not found in current list");
          }
          const updated = await updateDriver(
            driverId,
            driverFormToUpdateBody(values, current),
            organizationId,
          );
          const vehicleId = getVehicleIdFromDriverForm(values);
          if (vehicleId) {
            await assignDriverToVehicle(vehicleId, updated.id);
          }
        } else {
          const created = await createDriver(
            driverFormToCreateBody(values, organizationId),
          );
          const vehicleId = getVehicleIdFromDriverForm(values);
          if (vehicleId) {
            await assignDriverToVehicle(vehicleId, created.id);
          }
        }
        await queryClient.invalidateQueries({
          queryKey: queryKeys.drivers.byOrganization(organizationId),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.vehicles.list({ organizationId }),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.drivers.all,
        });
      } catch (e) {
        setDriversError(getApiErrorMessage(e, "Failed to save driver"));
        throw e;
      }
    },
    [organizationId, allDrivers, queryClient],
  );

  const handleDeleteClick = useCallback(
    (driver: Driver) => setDriverToDelete(driver),
    [],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!driverToDelete || !organizationId) return;
    try {
      setDriversError(null);
      await deleteDriver(driverToDelete.id, organizationId);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.drivers.byOrganization(organizationId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.list({ organizationId }),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all });
      setDriverToDelete(null);
    } catch (e) {
      setDriversError(getApiErrorMessage(e, "Failed to delete driver"));
      throw e;
    }
  }, [driverToDelete, organizationId, queryClient]);

  const activeCount = useMemo(
    () => allDrivers.filter((d) => d.status === "AVAILABLE").length,
    [allDrivers],
  );
  const onRideCount = useMemo(
    () => allDrivers.filter((d) => d.status === "ON RIDE").length,
    [allDrivers],
  );
  const offlineCount = allDrivers.length - activeCount - onRideCount;
  const revenueValue = useMemo(() => {
    const total = allDrivers.reduce((sum, d) => {
      const n = Number(d.earning.replace(/[^0-9.]/g, ""));
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
    return `$${total.toFixed(2)}`;
  }, [allDrivers]);

  if (!organizationId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No results
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

  if (orgLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 240,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!organization) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {fetchError ?? "No results"}
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
        {driversError ? (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setDriversError(null)}
          >
            {driversError}
          </Alert>
        ) : null}

        <Box sx={{ pt: { xs: 1, md: 2 } }}>
          <DriversHeader
            organization={organization}
            onAddDriver={() =>
              setDriverModal({ open: true, driver: null, readOnly: false })
            }
          />
        </Box>

        <Box sx={{ pt: { xs: 1, md: 2 } }}>
          <DriversStats
            activeCount={activeCount}
            onRideCount={onRideCount}
            offlineCount={offlineCount}
            revenue={revenueValue}
          />
        </Box>

        <Box sx={{ mt: 2, minHeight: driversLoading ? 200 : 0 }}>
          {driversLoading ? (
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
          ) : allDrivers.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              No results
            </Box>
          ) : (
            <DriversTable
              drivers={allDrivers}
              onDriverView={(d) =>
                setDriverModal({ open: true, driver: d, readOnly: true })
              }
              onDriverEdit={(d) =>
                setDriverModal({ open: true, driver: d, readOnly: false })
              }
              onDriverDelete={handleDeleteClick}
            />
          )}
        </Box>

        <DriverManagementModal
          open={driverModal.open}
          onClose={() => setDriverModal((prev) => ({ ...prev, open: false }))}
          driver={driverModal.driver}
          readOnly={driverModal.readOnly}
          managedVehicles={
            driverModal.driver
              ? (vehiclesByDriverId[driverModal.driver.id] ?? [])
              : []
          }
          onSave={handleSaveDriver}
        />

        <ConfirmDeleteDialog
          open={!!driverToDelete}
          onClose={() => setDriverToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="�������� ����?"
          message="�� �� �� ����� ���������. ����� ���� �������� ��������."
        />
      </Container>
    </Box>
  );
}
