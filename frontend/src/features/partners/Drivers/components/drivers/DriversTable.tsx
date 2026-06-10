import { Avatar, Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PersonIcon from "@mui/icons-material/Person";
import { useCallback, useState } from "react";
import { GenericTable } from "../../../../../components/GenericTable";
import EntityActionsMenu from "../../../../../components/EntityActionsMenu";
import DriverCard from "./DriverCard";
import type { Driver } from "./types";
import {
  driverVehicleName,
  driverVehicleSubtitle,
  hasAssignedVehicle,
} from "./driverVehicleDisplay";
import { commonContent } from "../../../../../content/common";
import { driverAgentsContent } from "../../../../../content/driverAgents";

const t = driverAgentsContent.table;
const rm = driverAgentsContent.rowMenu;

const statusStyle = (active: boolean) =>
  active
    ? { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e", label: commonContent.status.active }
    : {
        bg: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.6)",
        label: commonContent.status.inactive,
      };

type Props = {
  drivers: Driver[];
  onDriverView?: (driver: Driver) => void;
  onDriverEdit?: (driver: Driver) => void;
  onDriverDelete?: (driver: Driver) => void;
  onSendTestMessage?: (driver: Driver) => void;
};

export default function DriversTable({
  drivers,
  onDriverView,
  onDriverEdit,
  onDriverDelete,
  onSendTestMessage,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Driver | null>(null);

  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>, d: Driver) => {
      e.stopPropagation();
      setMenuAnchor(e.currentTarget);
      setSelected(d);
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setMenuAnchor(null);
    setSelected(null);
  }, []);

  const columns = [
    {
      key: "name",
      label: t.columnName,
      render: (d: Driver) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "rgba(255,255,255,0.1)",
              color: "text.secondary",
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {d.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {t.idPrefix}: {d.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "vehicle",
      label: t.columnVehicle,
      render: (d: Driver) => {
        const subtitle = driverVehicleSubtitle(d);
        return (
          <>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {driverVehicleName(d)}
            </Typography>
            {subtitle ? (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {subtitle}
              </Typography>
            ) : !hasAssignedVehicle(d) ? (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {t.noVehicleAssigned}
              </Typography>
            ) : null}
          </>
        );
      },
    },
    {
      key: "status",
      label: t.columnStatus,
      render: (d: Driver) => {
        const s = statusStyle(d.status ?? true);
        return (
          <Chip
            label={s.label}
            size="small"
            sx={{
              bgcolor: s.bg,
              color: s.color,
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: 0.5,
            }}
          />
        );
      },
    },
    {
      key: "rides",
      label: t.columnRides,
      render: (d: Driver) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {d.rides}
        </Typography>
      ),
    },
    {
      key: "earning",
      label: t.columnEarning,
      render: (d: Driver) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {d.earning}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <GenericTable
        title={t.title}
        withPagination={{
          pageSize: 6,
        }}
        data={drivers}
        columns={columns}
        onRowClick={onDriverView}
        actions={openMenu}
        renderMobileCard={(driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onView={onDriverView ? () => onDriverView(driver) : undefined}
            onEdit={onDriverEdit ? () => onDriverEdit(driver) : undefined}
            onDelete={onDriverDelete ? () => onDriverDelete(driver) : undefined}
            onSendTestMessage={
              onSendTestMessage ? () => onSendTestMessage(driver) : undefined
            }
          />
        )}
      />
      <EntityActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        menuPaperSx={{ sx: { minWidth: 160, borderRadius: 2 } }}
        actions={[
          {
            label: rm.edit,
            icon: <EditIcon fontSize="small" />,
            onClick: () => {
              if (selected) onDriverEdit?.(selected);
              closeMenu();
            },
          },
          {
            label: rm.sendTestWhatsApp,
            icon: <WhatsAppIcon fontSize="small" />,
            onClick: () => {
              if (selected) onSendTestMessage?.(selected);
              closeMenu();
            },
          },
          {
            label: rm.delete,
            color: "error.main",
            icon: <DeleteIcon fontSize="small" />,
            onClick: () => {
              if (selected) onDriverDelete?.(selected);
              closeMenu();
            },
          },
        ]}
      />
    </>
  );
}
