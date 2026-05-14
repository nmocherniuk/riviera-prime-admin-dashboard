import { Box, Paper, Stack, Typography } from "@mui/material";

export type Stat = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ sx?: object }>;
};

const paperSx = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: { xs: 2, md: 3 },
  border: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 2,
};

export default function CardStat({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <Paper elevation={0} sx={paperSx}>
      {Icon && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 2, bgcolor: "rgba(255,255,255,0.1)" }}>
          <Icon
            sx={{
              color: "primary.main",
              fontSize: { xs: 24, md: 28 },
              opacity: 0.9,
            }}
          />
        </Box>
      )}
      <Stack direction="column">
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            fontWeight: 700,
            fontSize: { xs: "0.7rem", md: "inherit" },
          }}
        >
          {stat.label}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
          }}
        >
          {stat.value}
        </Typography>
      </Stack>
    </Paper>
  );
}
