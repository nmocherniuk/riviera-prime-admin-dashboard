import { Button, Divider, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import BaseModal from "../../../../../../components/BaseModal";
import {
  defaultFormValues,
  type DriverFormValues,
  type DriverManagementModalProps,
} from "./driverManagementForm.types";
import { driverToFormValues } from "./driverManagementForm.mapper";
import BasicInfoSection from "./components/BasicInfoSection";
import ProfessionalSection from "./components/ProfessionalSection";
import DocumentsSection from "./components/DocumentsSection";
import OperationsVehicleSection from "./components/OperationsVehicleSection";

export default function DriverManagementModal({
  open,
  onClose,
  driver,
  readOnly = false,
  managedVehicles = [],
  onSave,
}: DriverManagementModalProps) {
  const [formValues, setFormValues] =
    useState<DriverFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(driverToFormValues(driver));
  }, [driver, open]);

  const handleChange =
    (field: keyof DriverFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormValues((prev) => ({ ...prev, [field]: nextValue }));
    };

  const handleSave = async () => {
    try {
      await Promise.resolve(onSave?.(driver?.id ?? null, formValues));
      onClose();
    } catch {
      // keep modal open on failure
    }
  };

  const primaryVehicle = managedVehicles[0];
  const extraVehicles = Math.max(0, managedVehicles.length - 1);
  const vehicleIdValue = primaryVehicle
    ? extraVehicles > 0
      ? `${primaryVehicle.id} (+${extraVehicles})`
      : primaryVehicle.id
    : formValues.vehicleId || "—";
  const vehicleTypeValue = primaryVehicle
    ? extraVehicles > 0
      ? `${primaryVehicle.vehicleClass} (+${extraVehicles})`
      : primaryVehicle.vehicleClass
    : formValues.vehicleType || "—";
  const vehicleNameValue = primaryVehicle
    ? extraVehicles > 0
      ? `${primaryVehicle.label} (+${extraVehicles})`
      : primaryVehicle.label
    : formValues.vehicle || "—";

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {readOnly ? "Driver details" : "Driver Management"}
          </Typography>
        </>
      }
      actions={
        !readOnly ? (
          <>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "rgba(212, 175, 53, 0.08)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleSave}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2,
              }}
            >
              Save changes
            </Button>
          </>
        ) : undefined
      }
    >
      <BasicInfoSection
        readOnly={readOnly}
        driverId={driver?.id}
        formValues={formValues}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />
      <ProfessionalSection
        readOnly={readOnly}
        formValues={formValues}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />
      <DocumentsSection
        readOnly={readOnly}
        formValues={formValues}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />
      <OperationsVehicleSection
        readOnly={readOnly}
        formValues={formValues}
        onChange={handleChange}
        vehicleIdValue={vehicleIdValue}
        vehicleTypeValue={vehicleTypeValue}
        vehicleNameValue={vehicleNameValue}
      />
    </BaseModal>
  );
}
