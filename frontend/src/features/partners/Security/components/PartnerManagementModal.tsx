import {
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { Partner, PartnerStatus } from "../data/types";
import {
  modalTextFieldSx,
  sectionLabelSx,
} from "../../../../components/ui/modalStyles";
import DetailField from "../../../../components/DetailField";
import BaseModal from "../../../../components/BaseModal";

export type PartnerFormValues = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  locationServiceArea: string;
  status: PartnerStatus;
};

const defaultFormValues: PartnerFormValues = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  locationServiceArea: "",
  status: "active",
};

function partnerToFormValues(partner: Partner | null): PartnerFormValues {
  if (!partner) return defaultFormValues;
  return {
    companyName: partner.companyName || "",
    contactPerson: partner.contactPerson || "",
    email: partner.email || "",
    phone: partner.phone || "",
    locationServiceArea: partner.locationServiceArea || "",
    status: partner.status,
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  partner: Partner | null;
  readOnly?: boolean;
  onSave?: (partnerId: string | null, values: PartnerFormValues) => void;
};

const PARTNER_STATUSES: PartnerStatus[] = ["active", "inactive"];

export default function PartnerManagementModal({
  open,
  onClose,
  partner,
  readOnly = false,
  onSave,
}: Props) {
  const [formValues, setFormValues] =
    useState<PartnerFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(partnerToFormValues(partner));
  }, [partner, open]);

  const handleChange =
    (field: keyof PartnerFormValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const handleSave = () => {
    onSave?.(partner?.id ?? null, formValues);
    onClose();
  };

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
            {readOnly
              ? "Partner details"
              : partner
                ? "Edit Partner"
                : "Add Partner"}
          </Typography>
        </>
      }
      actions={
        !readOnly ? (
          <>
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
              {partner ? "Save changes" : "Add Partner"}
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
          </>
        ) : undefined
      }
    >

      <Typography sx={sectionLabelSx}>Company</Typography>
      <DetailField
        label="Partner ID"
        value={partner ? `#${partner.id}` : "—"}
        emptyAsDash={false}
      />

      <Typography sx={sectionLabelSx}>Contact</Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          {readOnly ? (
            <DetailField
              label="Company name"
              value={formValues.companyName}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Company name"
              value={formValues.companyName}
              onChange={handleChange("companyName")}
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
              label="Location / service area"
              value={formValues.locationServiceArea}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Location / service area"
              value={formValues.locationServiceArea}
              onChange={handleChange("locationServiceArea")}
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
              onChange={handleChange("status")}
              sx={modalTextFieldSx}
            >
              {PARTNER_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
      </Grid>
    </BaseModal>
  );
}
