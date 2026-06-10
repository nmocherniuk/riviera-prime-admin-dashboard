import {
  Typography,
  Grid,
  Button,
} from "@mui/material";
import FormTextField from "../../../components/form/FormTextField";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import type { Booking } from "./BookingsCalendar/data/dummyBookings";
import { sectionLabelSx, modalTextFieldSx } from "../../../components/ui/modalStyles";
import DetailField from "../../../components/DetailField";
import BaseModal from "../../../components/BaseModal";
import { FormFieldErrorsProvider } from "../../../components/form/FormFieldErrorsProvider";
import type { FieldErrors } from "../../../utils/formErrors";
import { bookingContent } from "../../../content/booking";

const mm = bookingContent.managementModal;

export type BookingFormValues = {
  clientName: string;
  vehicleId: string;
  /** comfort | business | van — used when no concrete vehicle UUID is set */
  vehicleClass: string;
  driverId: string;
  date: string;
  startTime: string;
  duration: string;
  from: string;
  to: string;
};

const defaultFormValues: BookingFormValues = {
  clientName: "",
  vehicleId: "",
  vehicleClass: "",
  driverId: "",
  date: "",
  startTime: "",
  duration: "",
  from: "",
  to: "",
};

function bookingToFormValues(booking: Booking | null): BookingFormValues {
  if (!booking) return defaultFormValues;
  return {
    clientName: booking.clientName || "",
    vehicleId: booking.vehicleId || "",
    vehicleClass: booking.vehicleClass || "",
    driverId: booking.driverId || "",
    date: booking.date || "",
    startTime: booking.startTime || "",
    duration: booking.duration || "",
    from: booking.from || "",
    to: booking.to || "",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  fieldErrors?: FieldErrors;
  onClearFieldError?: (field: string) => void;
  onSave?: (bookingId: string | null, values: BookingFormValues) => void | Promise<void>;
};

export default function BookingManagementModal({
  open,
  onClose,
  booking,
  fieldErrors = {},
  onClearFieldError,
  onSave,
}: Props) {
  const [formValues, setFormValues] = useState<BookingFormValues>(defaultFormValues);

  useEffect(() => {
    setFormValues(bookingToFormValues(booking));
  }, [booking, open]);

  const handleChange = (field: keyof BookingFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onClearFieldError?.(field);
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await onSave?.(booking?.id ?? null, formValues);
      onClose();
    } catch {
      // Keep modal open; field errors come from parent.
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <InfoOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            {booking ? mm.titles.edit : mm.titles.create}
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
            {mm.cancel}
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
            {booking ? mm.submitEdit : mm.submitCreate}
          </Button>
        </>
      }
    >
      <DetailField label={mm.bookingId} value={booking ? `#${booking.id}` : "—"} emptyAsDash={false} />

      <FormFieldErrorsProvider
        fieldErrors={fieldErrors}
        onClearField={onClearFieldError}
      >
      <Typography sx={sectionLabelSx}>{mm.sections.details}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="clientName"
            fullWidth
            size="small"
            label={mm.fields.clientName.label}
            placeholder={mm.fields.clientName.placeholder}
            value={formValues.clientName}
            onChange={handleChange("clientName")}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="vehicleId"
            fullWidth
            size="small"
            label={mm.fields.vehicleId.label}
            placeholder={mm.fields.vehicleId.placeholder}
            value={formValues.vehicleId}
            onChange={handleChange("vehicleId")}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="vehicleClass"
            fullWidth
            select
            size="small"
            label={mm.fields.vehicleClass.label}
            value={formValues.vehicleClass}
            onChange={handleChange("vehicleClass")}
            SelectProps={{ native: true }}
            sx={modalTextFieldSx}
          >
            <option value="">—</option>
            <option value="comfort">{mm.vehicleClasses.comfort}</option>
            <option value="business">{mm.vehicleClasses.business}</option>
            <option value="van">{mm.vehicleClasses.van}</option>
          </FormTextField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="driverId"
            fullWidth
            size="small"
            label={mm.fields.driverId.label}
            placeholder={mm.fields.driverId.placeholder}
            value={formValues.driverId}
            onChange={handleChange("driverId")}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="date"
            fullWidth
            size="small"
            label={mm.fields.date.label}
            placeholder={mm.fields.date.placeholder}
            type="date"
            value={formValues.date}
            onChange={handleChange("date")}
            InputLabelProps={{ shrink: true }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="startTime"
            fullWidth
            size="small"
            label={mm.fields.startTime.label}
            placeholder={mm.fields.startTime.placeholder}
            type="time"
            value={formValues.startTime}
            onChange={handleChange("startTime")}
            InputLabelProps={{ shrink: true }}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            field="duration"
            fullWidth
            size="small"
            label={mm.fields.duration.label}
            placeholder={mm.fields.duration.placeholder}
            value={formValues.duration}
            onChange={handleChange("duration")}
            sx={modalTextFieldSx}
          />
        </Grid>
      </Grid>

      <Typography sx={sectionLabelSx}>{mm.sections.route}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="from"
            fullWidth
            size="small"
            label={mm.fields.from.label}
            placeholder={mm.fields.from.placeholder}
            value={formValues.from}
            onChange={handleChange("from")}
            sx={modalTextFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            field="to"
            fullWidth
            size="small"
            label={mm.fields.to.label}
            placeholder={mm.fields.to.placeholder}
            value={formValues.to}
            onChange={handleChange("to")}
            sx={modalTextFieldSx}
          />
        </Grid>
      </Grid>
      </FormFieldErrorsProvider>
    </BaseModal>
  );
}
