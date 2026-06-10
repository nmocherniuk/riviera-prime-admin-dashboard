import { Box, Paper, Typography } from "@mui/material";
import { commonContent } from "../../../content/common";

type Props = {
  title: string;
  chartId: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  headerRightContent?: React.ReactNode;
};

export default function ChartPlaceholderCard({ title, chartId, ariaLabel, children, headerRightContent }: Props) {

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        p: 2,
      }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        width: "100%",
        mb: 2
      }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          {title}
        </Typography>
        {headerRightContent}
      </Box>
      <Box
        sx={{
          minHeight: 280,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.02)",
          border: "1px dashed",
          borderColor: "divider",
        }}
        aria-label={ariaLabel ?? commonContent.aria.chartArea.replace("{title}", title)}
        id={chartId}
      >
        {children}
      </Box>
    </Paper>
  );
}
