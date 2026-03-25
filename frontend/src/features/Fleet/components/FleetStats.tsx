import { Box } from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import CardStat from "../../../components/CardStat";
import { useMemo } from "react";
import type { FleetVehicle } from "../data/dummyFleet";

type Props = {
  vehicles: FleetVehicle[];
};

export default function FleetStats({ vehicles }: Props) {
  const stats = useMemo(() => {
    const available = vehicles.filter((v) => v.status === "AVAILABLE").length;
    const onTrip = vehicles.filter((v) => v.status === "ON TRIP").length;
    const maintenance = Math.max(0, vehicles.length - available - onTrip);

    return [
      {
        label: "Available",
        value: String(available),
        icon: DirectionsCarIcon,
      },
      {
        label: "On Trip",
        value: String(onTrip),
        icon: LocalTaxiIcon,
      },
      {
        label: "Maintenance",
        value: String(maintenance),
        icon: BuildCircleIcon,
      },
    ];
  }, [vehicles]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <CardStat key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
