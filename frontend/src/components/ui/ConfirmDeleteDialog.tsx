import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
};

const defaultTitle = "Видалити запис?";
const defaultMessage =
  "Цю дію не можна скасувати. Запис буде видалено назавжди.";
const defaultConfirmLabel = "Видалити";

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = defaultTitle,
  message = defaultMessage,
  confirmLabel = defaultConfirmLabel,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: "text.primary" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Скасувати
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
