import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import {
  sidebarMenuItems,
  sidebarSecurityItems,
  sidebarFinancialItems,
  sidebarBottomItems,
  sidebarDriversItems,
} from "./sidebarItems";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import LogoIcon from "./components/LogoIcon";
import SectionTitle from "./components/SectionTitle";
import { logoutRequest } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { commonContent } from "../../content/common";

const drawerWidth = 260;

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logoutRequest();
    } catch {
      /* ignore */
    }
    useAuthStore.getState().logout();
    navigate("/login", { replace: true });
    if (!isDesktop) onClose?.();
  };

  const renderListItems = (
    items: Array<{
      label: string;
      icon: React.ComponentType;
      path: string;
      comingSoon?: boolean;
      isSignOut?: boolean;
    }>,
  ) =>
    items.map((item) => {
      const Icon = item.icon;
      const isActive = item.isSignOut
        ? false
        : pathname === item.path ||
        (item.path !== "/" && pathname.startsWith(item.path + "/"));

      const itemSx = {
        mx: 1,
        borderRadius: 1,
        color: "secondary.main",
        mb: 0.5,
        "&.Mui-selected": {
          bgcolor: (t: Theme) => alpha(t.palette.primary.main, 0.2),
          color: "primary.main",
          "&:hover": (t: Theme) => ({
            bgcolor: alpha(t.palette.primary.main, 0.3),
            color: t.palette.primary.main,
          }),
          "& .MuiListItemIcon-root": {
            color: "primary.main",
          },
        },
        "&:hover": (t: Theme) => ({
          color: t.palette.text.primary,
        }),
        "& .MuiListItemIcon-root": {
          minWidth: 40,
          color: item.isSignOut ? "error.main" : "inherit",
        },
        "&.Mui-disabled": {
          opacity: 0.55,
        },
      };

      if (item.isSignOut) {
        return (
          <ListItemButton
            key={item.path}
            component="button"
            type="button"
            selected={false}
            onClick={() => void handleSignOut()}
            sx={itemSx}
          >
            <ListItemIcon
              sx={{ color: item.isSignOut ? "error.main" : "inherit" }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: 500,
                color: "error.main",
              }}
            />
          </ListItemButton>
        );
      }

      return (
        <ListItemButton
          key={item.path}
          selected={isActive}
          onClick={!isDesktop ? onClose : undefined}
          component={RouterLink}
          to={item.path}
          disabled={item.comingSoon}
          sx={itemSx}
        >
          <ListItemIcon
            sx={{ color: item.isSignOut ? "error.main" : "inherit" }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: isActive ? 600 : 500,
              color: item.isSignOut ? "error.main" : "inherit",
            }}
          />
        </ListItemButton>
      );
    });

  const drawer = (
    <Box
      sx={{
        minHeight: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ px: 2, py: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
          <LogoIcon />
          <Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                textAlign: "start",
                fontWeight: 700,
                color: "common.white",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {commonContent.nav.brand.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              {commonContent.nav.brand.subtitle}
            </Typography>
          </Box>
        </Box>
      </Box>

      <SectionTitle>{commonContent.nav.sections.mainMenu}</SectionTitle>
      <List disablePadding sx={{ px: 0, bgcolor: "background.paper" }}>
        {renderListItems(sidebarMenuItems)}
      </List>

      <Divider
        sx={{ borderColor: "divider", mx: 2, my: 1, bgcolor: "transparent" }}
      />

      <SectionTitle>{commonContent.nav.sections.chauffeurServices}</SectionTitle>
      <List disablePadding sx={{ px: 0, bgcolor: "background.paper" }}>
        {renderListItems(sidebarDriversItems)}
      </List>

      <Divider
        sx={{ borderColor: "divider", mx: 2, my: 1, bgcolor: "transparent" }}
      />

      <SectionTitle>{commonContent.nav.sections.securityServices}</SectionTitle>
      <List disablePadding sx={{ px: 0, bgcolor: "background.paper" }}>
        {renderListItems(sidebarSecurityItems)}
      </List>

      <Divider
        sx={{ borderColor: "divider", mx: 2, my: 1, bgcolor: "transparent" }}
      />

      <SectionTitle>{commonContent.nav.sections.financials}</SectionTitle>
      <List disablePadding sx={{ px: 0, bgcolor: "background.paper" }}>
        {renderListItems(sidebarFinancialItems)}
      </List>
      <Divider
        sx={{ borderColor: "divider", mx: 2, my: 1, bgcolor: "transparent" }}
      />
      <List
        disablePadding
        sx={{
          px: 0,
          mt: "auto",
          pb: 2,
          bgcolor: "background.paper",
        }}
      >
        {renderListItems(sidebarBottomItems)}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop ? true : open}
      onClose={onClose}
      PaperProps={{
        style: { "--Paper-overlay": "none" } as React.CSSProperties,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "none",
          bgcolor: "background.paper",
          overflowY: "auto",
          ...(isDesktop ? {} : { top: 0, height: "100%" }),
        },
      }}
      ModalProps={{ keepMounted: true }}
    >
      {drawer}
    </Drawer>
  );
}
