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
import DriverManagementModal from "../features/partners/Drivers/components/drivers/ModalManagement/DriverManagementModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import DriversTable from "../features/partners/Drivers/components/drivers/DriversTable";
import DriversHeader from "../features/partners/Drivers/components/drivers/DriversHeader";
import DriversStats from "../features/partners/Drivers/components/drivers/DriversStats";
import {
  getApiErrorMessage,
  getOrganization,
  isNotFoundError,
} from "../api/organizations";
import {
  createDriver,
  deleteDriver,
  listDrivers,
  sendDriverTestWhatsApp,
  updateDriver,
} from "../api/drivers";
import { queryKeys } from "../api/queryKeys";
import type { Driver, DriverFormValues } from "../features/partners/Drivers/components/drivers/types";
import { FormValuesToDriver } from "../features/partners/Drivers/components/drivers/ModalManagement/driverManagementForm.mapper";
import { useToast } from "../providers/ToastProvider";
import { useModalFormErrors } from "../hooks/useModalFormErrors";
import type { DriverOrganization } from "../features/partners/Drivers/data/types";
import { driverAgentsContent } from "../content/driverAgents";

// type VehiclesByDriver = Record<
//   string,
//   Array<{ id: string; label: string; vehicleClass: string }>
// >;

// type DriversPageData = {
//   organization: DriverOrganization;
//   allDrivers: Driver[];
//   vehiclesByDriverId: VehiclesByDriver;
// };

// async function fetchDriversPageData(
//   organizationId: string,
// ): Promise<DriversPageData> {
//   const org = await getOrganization(organizationId);


//   let rows: DriverDto[] = [];
//   let vehicles: VehicleDto[] = [];
//   try {
//     const [driverRows, vehicleRows] = await Promise.all([
//       listDrivers(organizationId),
//       listVehicles({ organizationId }),
//     ]);
//     rows = driverRows;
//     vehicles = vehicleRows;
//   } catch (e) {
//     if (isNotFoundError(e)) {
//       rows = [];
//       vehicles = [];
//     } else {
//       throw e;
//     }
//   }
//   const allDrivers = rows.map((row) => dtoToDriver(row, org.organizationName));
//   const vehiclesByDriverId = vehicles.reduce<VehiclesByDriver>((acc, v) => {
//     if (!v.driverId) return acc;
//     if (!acc[v.driverId]) acc[v.driverId] = [];
//     acc[v.driverId].push({
//       id: v.id,
//       label: v.vehicleName,
//       vehicleClass: v.class,
//     });
//     return acc;
//   }, {});
//   return { organization: org, allDrivers, vehiclesByDriverId };
// }

export default function DriversPage() {
  const { organizationId } = useParams<{ organizationId: string }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const { showToast } = useToast();
  const {
    fieldErrors,
    clearFieldError,
    clearAllFieldErrors,
    applySubmitError,
  } = useModalFormErrors();
  const [driverModal, setDriverModal] = useState<{
    open: boolean;
    driver: Driver | null;
    readOnly?: boolean;
  }>({ open: false, driver: null, readOnly: false });

  const {
    data: organization,
    isPending: organizationPending,
    error: organizationError,
  } = useQuery({
    queryKey: queryKeys.organizations.byId(organizationId!),
    queryFn: () => getOrganization(organizationId!),
    enabled: Boolean(organizationId),
  });

  const {
    data: drivers = [],
    isPending: driversPending,
    error: driversError,
  } = useQuery({
    queryKey: organizationId
      ? queryKeys.drivers.byOrganization(organizationId)
      : ["drivers", "byOrganization", "none"],
    queryFn: () => listDrivers(organizationId!),
    enabled: Boolean(organizationId),
  });

  const isPending = organizationPending || driversPending;
  const listError = organizationError && !isNotFoundError(organizationError)
    ? getApiErrorMessage(organizationError, driverAgentsContent.errors.loadOrganization)
    : driversError && !isNotFoundError(driversError)
      ? getApiErrorMessage(driversError, driverAgentsContent.errors.loadDrivers)
      : null;


  // const vehiclesByDriverId = useMemo(
  //   () => ({} as VehiclesByDriver),
  //   [],
  // );

  // const vehiclesByDriverId = useMemo(
  //   () => driversPageQuery.data?.vehiclesByDriverId ?? ({} as VehiclesByDriver),
  //   [driversPageQuery.data],
  // );

  // const orgLoading = driversPageQuery.isPending;
  // const fetchError =
  //   driversPageQuery.isError && driversPageQuery.error
  //     ? isNotFoundError(driversPageQuery.error)
  //       ? "No results"
  //       : getApiErrorMessage(
  //         driversPageQuery.error,
  //         "Failed to load drivers page",
  //       )
  //     : null;



  const handleSaveDriver = useCallback(
    async (driverId: string | null, values: DriverFormValues) => {

      if (!organizationId) return;

      try {
        setError(null);
        clearAllFieldErrors();
        if (driverId) {
          await updateDriver(
            driverId,
            FormValuesToDriver(values, organizationId),
          );
          // const vehicleId = getVehicleIdFromDriverForm(values);
          // if (vehicleId) {
          //   await assignDriverToVehicle(vehicleId, updated.id);
          // }
        } else {
          await createDriver(
            FormValuesToDriver(values, organizationId),
          );
          // const vehicleId = getVehicleIdFromDriverForm(values);
          //   await assignDriverToVehicle(vehicleId, created.id);
          // }
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

        showToast({
          message: driverId
            ? driverAgentsContent.toasts.updated
            : driverAgentsContent.toasts.created,
          severity: "success",
        });

        setDriverModal((prev) => ({
          ...prev,
          open: false,
          driver: null,
        }));
      } catch (e) {
        const msg = applySubmitError(e, driverAgentsContent.errors.save);
        showToast({ message: msg, severity: "error" });
        throw e;
      }
    },
    [organizationId, drivers, queryClient],
  );

  const handleDeleteClick = useCallback(
    (driver: Driver) => setDriverToDelete(driver),
    [],
  );

  const handleSendTestMessage = useCallback(
    async (driver: Driver) => {
      if (!driver.id) {
        showToast({ message: driverAgentsContent.errors.missingDriverId, severity: "error" });
        return;
      }
      try {
        await sendDriverTestWhatsApp(driver.id);
        showToast({
          message: driverAgentsContent.toasts.whatsAppSent,
          severity: "success",
        });
      } catch (e) {
        const msg = getApiErrorMessage(e, driverAgentsContent.errors.sendWhatsApp);
        showToast({ message: msg, severity: "error" });
      }
    },
    [showToast],
  );

  const activeCount = useMemo(
    () => drivers.filter((d) => d.status !== false).length,
    [drivers],
  );
  const inactiveCount = useMemo(
    () => drivers.filter((d) => d.status === false).length,
    [drivers],
  );

  if (!organizationId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {driverAgentsContent.empty.noResults}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/drivers-partners")}
          sx={{ mt: 2, textTransform: "none" }}
        >
          {driverAgentsContent.page.backToOrganizations}
        </Button>
      </Box>
    );
  }

  if (isPending) {
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

  if (listError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {listError ?? driverAgentsContent.empty.noResults}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/drivers-partners")}
          sx={{ mt: 2, textTransform: "none" }}
        >
          {driverAgentsContent.page.backToOrganizations}
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
        {error ? (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        ) : null}

        <Box sx={{ pt: { xs: 1, md: 2 } }}>
          <DriversHeader
            organizationName={organization?.organizationName ?? ""}
            onAddDriver={() =>
              {
                clearAllFieldErrors();
                setDriverModal({ open: true, driver: null, readOnly: false });
              }
            }
          />
        </Box>

        <Box sx={{ pt: { xs: 1, md: 2 } }}>
          <DriversStats
            activeCount={activeCount}
            inactiveCount={inactiveCount}
          />
        </Box>

        <Box sx={{ mt: 2, minHeight: isPending ? 200 : 0 }}>
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
          ) : drivers.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              {driverAgentsContent.empty.noResults}
            </Box>
          ) : (
            <DriversTable
              drivers={drivers}
              onDriverView={(d) => {
                clearAllFieldErrors();
                setDriverModal({ open: true, driver: d, readOnly: true });
              }}
              onDriverEdit={(d) => {
                clearAllFieldErrors();
                setDriverModal({ open: true, driver: d, readOnly: false });
              }}
              onDriverDelete={handleDeleteClick}
              onSendTestMessage={handleSendTestMessage}
            />
          )}
        </Box>

        <DriverManagementModal
          open={driverModal.open}
          onClose={() => {
            clearAllFieldErrors();
            setDriverModal((prev) => ({ ...prev, open: false }));
          }}
          driver={driverModal.driver}
          readOnly={driverModal.readOnly}
          managedVehicles={
            []
            // driverModal.driver?.id
            //   ? (vehiclesByDriverId[driverModal.driver.id] ?? [])
            //   : []
          }
          fieldErrors={fieldErrors}
          onClearFieldError={clearFieldError}
          onSave={handleSaveDriver}
        />

        <ConfirmDeleteDialog
          open={!!driverToDelete}
          onClose={() => setDriverToDelete(null)}
          onConfirm={async () => {
            if (!driverToDelete?.id) return;

            setError(null);
            try {
              await deleteDriver(driverToDelete.id);

              await queryClient.invalidateQueries({
                queryKey: queryKeys.drivers.byOrganization(organizationId),
              });
              await queryClient.invalidateQueries({
                queryKey: queryKeys.vehicles.list({ organizationId }),
              });
              await queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all });

              setDriverToDelete(null);

              showToast({
                message: driverAgentsContent.toasts.deleted,
                severity: "success",
              });
            } catch (e) {
              const msg = getApiErrorMessage(e, driverAgentsContent.errors.delete);
              showToast({ message: msg, severity: "error" });
              throw e;
            }
          }}
          title={driverAgentsContent.deleteDialog.title}
          message={driverAgentsContent.deleteDialog.message}
        />
      </Container>
    </Box>
  );
}
