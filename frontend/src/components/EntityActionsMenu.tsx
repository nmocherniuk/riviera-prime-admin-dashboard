import type { ReactNode } from "react";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type SxProps,
  type Theme,
} from "@mui/material";

export type EntityActionsMenuAction = {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  color?: string;
  onClick: () => void;
  sx?: SxProps<Theme>;
};

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  actions: EntityActionsMenuAction[];
  menuPaperSx?: SxProps<Theme>;
};

export default function EntityActionsMenu({
  anchorEl,
  open,
  onClose,
  actions,
  menuPaperSx,
}: Props) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{ paper: { sx: menuPaperSx } }}
    >
      {actions.map((a) => (
        <MenuItem
          key={a.label}
          disabled={a.disabled}
          onClick={() => {
            if (a.disabled) return;
            a.onClick();
            onClose();
          }}
          sx={{
            ...(a.color ? { color: a.color } : {}),
            ...(a.sx as object),
          }}
        >
          {a.icon && <ListItemIcon sx={a.color ? { color: a.color } : undefined}>{a.icon}</ListItemIcon>}
          <ListItemText>{a.label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
}

