import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Grid,
  Box,
  Button,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { Bodyguard, BodyguardAvailabilityStatus } from "../../data/types";
import { sectionLabelSx, modalTextFieldSx } from "../../../../components/ui/modalStyles";
import DetailField from "../../../../components/DetailField";
import ModalTitleBar from "../../../../components/ModalTitleBar";

export type BodyguardFormValues = {
  name: string;
  licenseCertification: string;
  experience: string;
  languages: string;
  availabilityStatus: BodyguardAvailabilityStatus;
  notes: string;
};

const defaultFormValues: BodyguardFormValues = {
  name: "",
  licenseCertification: "",
  experience: "",
  languages: "",
  availabilityStatus: "available",
  notes: "",
};

function bodyguardToFormValues(b: Bodyguard | null): BodyguardFormValues {
  if (!b) return defaultFormValues;
  return {
    name: b.name || "",
    licenseCertification: b.licenseCertification || "",
    experience: b.experience || "",
    languages: b.languages || "",
    availabilityStatus: b.availabilityStatus,
    notes: b.notes || "",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  bodyguard: Bodyguard | null;
  readOnly?: boolean;
  onSave?: (bodyguardId: string | null, values: BodyguardFormValues) => void;
};

const AVAILABILITY_OPTIONS: BodyguardAvailabilityStatus[] = ["available", "on_assignment", "off_duty"];

export default function BodyguardModal({
  open,
  onClose,
  bodyguard,
  readOnly = false,
  onSave,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [formValues, setFormValues] = useState<BodyguardFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(bodyguardToFormValues(bodyguard));
  }, [bodyguard, open]);

  const handleChange = (field: keyof BodyguardFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave?.(bodyguard?.id ?? null, formValues);
    onClose();
  };

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
              {readOnly ? "Bodyguard details" : bodyguard ? "Edit bodyguard" : "Add bodyguard"}
            </Typography>
          </>
        }
        onClose={onClose}
      />
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, overflowY: "auto" }}>
        <Typography sx={sectionLabelSx}>Bodyguard information</Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label="Name" value={formValues.name} />
            ) : (
              <TextField fullWidth size="small" label="Name" value={formValues.name} onChange={handleChange("name")} sx={modalTextFieldSx} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label="License / certification" value={formValues.licenseCertification} />
            ) : (
              <TextField fullWidth size="small" label="License / certification" value={formValues.licenseCertification} onChange={handleChange("licenseCertification")} sx={modalTextFieldSx} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label="Experience" value={formValues.experience} />
            ) : (
              <TextField fullWidth size="small" label="Experience" placeholder="e.g. 5 years" value={formValues.experience} onChange={handleChange("experience")} sx={modalTextFieldSx} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label="Languages" value={formValues.languages} />
            ) : (
              <TextField fullWidth size="small" label="Languages" placeholder="e.g. English, French" value={formValues.languages} onChange={handleChange("languages")} sx={modalTextFieldSx} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label="Availability status" value={formValues.availabilityStatus.replace("_", " ")} emptyAsDash={false} />
            ) : (
              <TextField fullWidth size="small" select label="Availability status" value={formValues.availabilityStatus} onChange={handleChange("availabilityStatus")} sx={modalTextFieldSx}>
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt.replace("_", " ")}</MenuItem>
                ))}
              </TextField>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            {readOnly ? (
              <DetailField label="Notes" value={formValues.notes} />
            ) : (
              <TextField fullWidth size="small" label="Notes" multiline rows={2} value={formValues.notes} onChange={handleChange("notes")} sx={modalTextFieldSx} />
            )}
          </Grid>
        </Grid>
        {!readOnly && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2.5, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleSave} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, px: 2 }}>
              {bodyguard ? "Save changes" : "Add bodyguard"}
            </Button>
            <Button variant="outlined" startIcon={<CloseIcon />} onClick={onClose} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "primary.main", color: "primary.main", "&:hover": { borderColor: "primary.dark", bgcolor: "rgba(212, 175, 53, 0.08)" } }}>
              Cancel
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
