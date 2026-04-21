import {
  Typography,
  TextField,
  Box,
  Button,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState, useEffect } from "react";
import type { VehiclePricing } from "../data/pricingData";
import { modalTextFieldSx } from "../../../components/ui/modalStyles";
import BaseModal from "../../../components/BaseModal";

type Props = {
  open: boolean;
  onClose: () => void;
  row: VehiclePricing | null;
  onSave: (vehicleId: string, payload: {
    perHour: string;
    perKm: string;
    minimumFare: string;
    holidaySurchargePercent: string;
    nightSurchargePercent: string;
  }) => void;
};

export default function PricingEditModal({
  open,
  onClose,
  row,
  onSave,
}: Props) {
  const [perHour, setPerHour] = useState("");
  const [perKm, setPerKm] = useState("");
  const [minimumFare, setMinimumFare] = useState("");
  const [holidaySurchargePercent, setHolidaySurchargePercent] = useState("");
  const [nightSurchargePercent, setNightSurchargePercent] = useState("");

  useEffect(() => {
    if (row) {
      setPerHour(row.perHour);
      setPerKm(row.perKm);
      setMinimumFare(row.minimumFare ?? "0");
      setHolidaySurchargePercent(row.holidaySurchargePercent ?? "0");
      setNightSurchargePercent(row.nightSurchargePercent ?? "0");
    }
  }, [row, open]);

  const handleSave = () => {
    if (row) {
      onSave(row.vehicle.id, {
        perHour,
        perKm,
        minimumFare,
        holidaySurchargePercent,
        nightSurchargePercent,
      });
      onClose();
    }
  };

  if (!row) return null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            Edit price — {row.vehicle.vehicleName}
          </Typography>
        </>
      }
      actions={
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
            Save
          </Button>
        </>
      }
    >
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Price per hour"
            placeholder="0"
            type="number"
            value={perHour}
            onChange={(e) => setPerHour(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Price per KM"
            placeholder="0"
            type="number"
            value={perKm}
            onChange={(e) => setPerKm(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Minimum fare (EUR)"
            type="number"
            value={minimumFare}
            onChange={(e) => setMinimumFare(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Holiday surcharge (%)"
            type="number"
            value={holidaySurchargePercent}
            onChange={(e) => setHolidaySurchargePercent(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Night surcharge (%)"
            type="number"
            value={nightSurchargePercent}
            onChange={(e) => setNightSurchargePercent(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            sx={modalTextFieldSx}
          />
        </Grid>
      </Grid>
    </BaseModal>
  );
}
