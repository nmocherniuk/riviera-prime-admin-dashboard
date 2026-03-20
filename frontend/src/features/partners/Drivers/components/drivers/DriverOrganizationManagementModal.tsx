import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState, type ChangeEvent } from "react";
import type {
  DriverOrganization,
  DriverOrganizationStatus,
} from "../../data/types";
import DetailField from "../../../../../components/DetailField";
import ModalTitleBar from "../../../../../components/ModalTitleBar";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../../components/ui/modalStyles";

export type DriverOrganizationFormValues = {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceArea: string;
  status: DriverOrganizationStatus;
};

const defaultFormValues: DriverOrganizationFormValues = {
  organizationName: "",
  contactPerson: "",
  email: "",
  phone: "",
  serviceArea: "",
  status: "active",
};

function orgToFormValues(
  org: DriverOrganization | null,
): DriverOrganizationFormValues {
  if (!org) return defaultFormValues;
  return {
    organizationName: org.organizationName || "",
    contactPerson: org.contactPerson || "",
    email: org.email || "",
    phone: org.phone || "",
    serviceArea: org.serviceArea || "",
    status: org.status,
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  organization: DriverOrganization | null;
  readOnly?: boolean;
  onSave?: (
    organizationId: string | null,
    values: DriverOrganizationFormValues,
  ) => void;
};

const ORG_STATUSES: DriverOrganizationStatus[] = ["active", "inactive"];

export default function DriverOrganizationManagementModal({
  open,
  onClose,
  organization,
  readOnly = false,
  onSave,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formValues, setFormValues] =
    useState<DriverOrganizationFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(orgToFormValues(organization));
  }, [organization, open]);

  const handleChange =
    (field: keyof DriverOrganizationFormValues) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = () => {
    onSave?.(organization?.id ?? null, formValues);
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
            <Typography
              component="span"
              variant="h6"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {readOnly
                ? "Organization details"
                : organization
                  ? "Edit organization"
                  : "Add organization"}
            </Typography>
          </>
        }
        onClose={onClose}
      />

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, overflowY: "auto" }}>
        <Typography sx={sectionLabelSx}>Organization ID</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.primary" }}>
          #{organization?.id ?? "—"}
        </Typography>

        <Typography sx={sectionLabelSx}>Company & contact</Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField
                label="Organization name"
                value={formValues.organizationName}
              />
            ) : (
              <TextField
                fullWidth
                size="small"
                label="Organization name"
                value={formValues.organizationName}
                onChange={handleChange("organizationName")}
                sx={modalTextFieldSx}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField
                label="Contact person"
                value={formValues.contactPerson}
              />
            ) : (
              <TextField
                fullWidth
                size="small"
                label="Contact person"
                value={formValues.contactPerson}
                onChange={handleChange("contactPerson")}
                sx={modalTextFieldSx}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label="Email" value={formValues.email} />
            ) : (
              <TextField
                fullWidth
                size="small"
                type="email"
                label="Email"
                value={formValues.email}
                onChange={handleChange("email")}
                sx={modalTextFieldSx}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField label="Phone" value={formValues.phone} />
            ) : (
              <TextField
                fullWidth
                size="small"
                label="Phone"
                value={formValues.phone}
                onChange={handleChange("phone")}
                sx={modalTextFieldSx}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            {readOnly ? (
              <DetailField
                label="Service area"
                value={formValues.serviceArea}
              />
            ) : (
              <TextField
                fullWidth
                size="small"
                label="Service area"
                value={formValues.serviceArea}
                onChange={handleChange("serviceArea")}
                sx={modalTextFieldSx}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {readOnly ? (
              <DetailField
                label="Status"
                value={formValues.status}
                emptyAsDash={false}
              />
            ) : (
              <TextField
                fullWidth
                size="small"
                select
                label="Status"
                value={formValues.status}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    status: e.target.value as DriverOrganizationStatus,
                  }))
                }
                sx={modalTextFieldSx}
              >
                {ORG_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>
        </Grid>

        {!readOnly && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mt: 2.5,
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
              Save changes
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
        )}
      </DialogContent>
    </Dialog>
  );
}
