import {
  Box,
  Button,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type PageHeaderProps = {
  withBack?: { label: string; path: string };
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  titleSx?: SxProps<Theme>;
  subtitleSx?: SxProps<Theme>;
  sx?: SxProps<Theme>;
};

const defaultTitleSx: SxProps<Theme> = {
  fontWeight: 700,
  color: "background.paper",
  lineHeight: 1.2,
};

const defaultSubtitleSx: SxProps<Theme> = {
  color: "text.secondary",
  mt: 0.25,
};

const backButtonSx = {
  width: { xs: "100%", sm: "auto" },
  bgcolor: "transparent",
  color: "text.secondary",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: 2,
  px: 2,
  py: 1.25,
};

export default function PageHeader({
  title,
  subtitle,
  action,
  titleSx,
  subtitleSx,
  sx,
  withBack,
}: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "stretch", sm: "flex-start" },
        justifyContent: "space-between",
        gap: 2,
        ...(sx as object),
      }}
    >
      {withBack && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(withBack.path)}
          sx={backButtonSx}
        >
          {withBack.label}
        </Button>
      )}
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            ...defaultTitleSx,
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            ...(titleSx as object),
            ...(withBack && { textAlign: "center" }),
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              ...defaultSubtitleSx,
              ...(subtitleSx as object),
              ...(withBack && { textAlign: "center" }),
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}
