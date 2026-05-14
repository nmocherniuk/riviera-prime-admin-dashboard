import { Box } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import CardStat from "../../../components/CardStat";
import { useMemo } from "react";
import type { FleetVehicle } from "./ModalManagement/fleetManagementForm.types";
import { vehiclesContent } from "../../../content/vehicles";

type Props = {
  vehicles: FleetVehicle[];
};

export default function FleetStats({ vehicles }: Props) {
  const stats = useMemo(() => {
    const active = vehicles.filter((v) => v.status === "ACTIVE").length;
    const inactive = vehicles.filter((v) => v.status === "INACTIVE").length;
    const total = vehicles.length;

    return [
      {
        label: vehiclesContent.stats.active,
        value: String(active),
        icon: DirectionsCarIcon,
      },
      {
        label: vehiclesContent.stats.inactive,
        value: String(inactive),
        icon: BlockIcon,
      },
      {
        label: vehiclesContent.stats.totalFleet,
        value: String(total),
        icon: LocalTaxiIcon,
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
