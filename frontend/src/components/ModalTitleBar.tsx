import { DialogTitle, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { commonContent } from "../content/common";

type Props = {
  title: React.ReactNode;
  onClose: () => void;
};

const titleBarSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: 1,
  borderColor: "divider",
  py: 1.5,
  px: { xs: 2, sm: 3 },
};

/**
 * Shared modal header: custom title content (e.g. icon + text) and close button.
 * Wraps content in DialogTitle with consistent styling.
 */
export default function ModalTitleBar({ title, onClose }: Props) {
  return (
    <DialogTitle sx={titleBarSx} component="div">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{title}</Box>
      <IconButton
        onClick={onClose}
        aria-label={commonContent.aria.close}
        sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}
