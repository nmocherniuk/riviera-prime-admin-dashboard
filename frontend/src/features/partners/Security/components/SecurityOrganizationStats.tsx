import { Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import GroupIcon from "@mui/icons-material/Group";
import CardStat from "../../../../components/CardStat";
import { securityPartnersContent } from "../../../../content/securityPartners";

type Props = {
  totalOrganizations: number;
  activeOrganizations: number;
  inactiveOrganizations: number;
};

export default function SecurityOrganizationStats({
  totalOrganizations,
  activeOrganizations,
  inactiveOrganizations,
}: Props) {
  const stats = [
    {
      label: securityPartnersContent.stats.organizations,
      value: String(totalOrganizations),
      icon: BusinessIcon,
    },
    {
      label: securityPartnersContent.stats.active,
      value: String(activeOrganizations),
      icon: GroupIcon,
    },
    {
      label: securityPartnersContent.stats.inactive,
      value: String(inactiveOrganizations),
      icon: PersonOffIcon,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <CardStat key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
