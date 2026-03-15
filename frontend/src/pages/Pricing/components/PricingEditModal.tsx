import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Box,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState, useEffect } from "react";
import type { VehiclePricing } from "../data/pricingData";
import { modalTextFieldSx } from "../../../components/ui/modalStyles";
import ModalTitleBar from "../../../components/ModalTitleBar";

type Props = {
  open: boolean;
  onClose: () => void;
  row: VehiclePricing | null;
  onSave: (vehicleId: string, perHour: string, perKm: string) => void;
};

export default function PricingEditModal({
  open,
  onClose,
  row,
  onSave,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [perHour, setPerHour] = useState("");
  const [perKm, setPerKm] = useState("");

  useEffect(() => {
    if (row) {
      setPerHour(row.perHour);
      setPerKm(row.perKm);
    }
  }, [row, open]);

  const handleSave = () => {
    if (row) {
      onSave(row.vehicle.id, perHour, perKm);
      onClose();
    }
  };

  if (!row) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: fullScreen ? 0 : 3,
          maxHeight: fullScreen ? "100%" : "90vh",
        },
      }}
    >
      <ModalTitleBar
        title={
          <>
            <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
              Edit price — {row.vehicle.vehicleName}
            </Typography>
          </>
        }
        onClose={onClose}
      />

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2, overflowY: "auto" }}>
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
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
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
        </Box>
      </DialogContent>
    </Dialog>
  );
}
