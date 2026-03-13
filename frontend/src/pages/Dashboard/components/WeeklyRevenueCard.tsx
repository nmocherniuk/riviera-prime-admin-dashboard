import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

type Period = "day" | "week" | "month";

export default function WeeklyRevenueCard() {
  const [period, setPeriod] = useState<Period>("week");

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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}
          >
            Weekly Revenue Performance
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "text.primary", fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              $84,320
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#22c55e", fontSize: "0.875rem" }}
            >
              +15% vs last week
            </Typography>
          </Box>
        </Box>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, newPeriod) => {
            if (newPeriod != null) setPeriod(newPeriod);
          }}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.04)",
            borderRadius: 2,
            "& .MuiToggleButton-root": {
              px: 2,
              py: 1,
              border: "none",
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "none",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "grey.900",
                "&:hover": { bgcolor: "primary.dark" },
              },
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
                color: "text.primary",
              },
            },
          }}
        >
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Placeholder for Chart.js – mount your chart here (e.g. id="weekly-revenue-chart-container") */}
      <Box
        sx={{
          minHeight: 280,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.02)",
          border: "1px dashed",
          borderColor: "divider",
        }}
        aria-label="Chart area for Weekly Revenue"
        id="weekly-revenue-chart-container"
      />
    </Paper>
  );
}
