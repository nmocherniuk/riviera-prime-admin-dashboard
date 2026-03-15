import { Box } from "@mui/material";

export default function LogoIcon() {
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 1,
        bgcolor: "primary.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          width: 12,
          height: 12,
          border: "2px solid",
          borderColor: "common.white",
          transform: "rotate(45deg)",
        }}
      />
    </Box>
  );
}
