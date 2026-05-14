import {
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import type { ReactNode } from "react";
import ModalTitleBar from "./ModalTitleBar";

type Props = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md";
  actions?: ReactNode;
  disableAutoFocus?: boolean;
};

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
  actions,
  disableAutoFocus,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth={maxWidth}
      disableAutoFocus={disableAutoFocus}
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
      <ModalTitleBar title={title} onClose={onClose} />

      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          pb: 2.5,
          overflowY: "auto",
        }}
      >
        <Box sx={{ pt: 2.5 }}>
          {children}
        </Box>
        {actions && (
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: {
                xs: "stretch",
                md: "flex-end",
              },
              "& > *": {
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                flex: {
                  xs: "unset",
                  sm: 1,
                  md: "unset",
                },
                maxWidth: {
                  md: "fit-content",
                },
              },
            }}
          >
            {actions}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
