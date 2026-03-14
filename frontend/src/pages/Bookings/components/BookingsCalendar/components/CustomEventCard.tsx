import { Box, Typography } from "@mui/material";
import type { EventContentArg } from "@fullcalendar/core";
import type { BookingStatus } from "../data/dummyBookings";
import { STATUS_STYLES, DEFAULT_STATUS_STYLE, STATUS_LABELS } from "../constants";
import { formatEventTime } from "../utils/utils";

export function CustomEventCard({ arg }: { arg: EventContentArg }) {
  const event = arg.event;
  const clientName = event.extendedProps?.clientName ?? event.title;
  const route = event.extendedProps?.route ?? "";
  const car = event.extendedProps?.car ?? "";
  const status = (event.extendedProps?.status ?? "assigned") as BookingStatus;
  const timeStr = formatEventTime(event.start!);
  const style = status && STATUS_STYLES[status] ? STATUS_STYLES[status] : DEFAULT_STATUS_STYLE;
  const statusLabel = STATUS_LABELS[status] ?? status;

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 110,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 0.5,
        p: 1.25,
        pl: 1.5,
        borderLeft: "3px solid",
        borderLeftColor: style.borderColor,
        borderRadius: 1,
        bgcolor: style.bgColor,
        overflow: "hidden",
        boxSizing: "border-box",
        cursor: "pointer",
        width: "100%",
      }}
    >
      <Box
        sx={{
          flex: "1 1 auto",
          minHeight: 52,
          display: "flex",
          flexDirection: "column",
          gap: 0.375,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            flexShrink: 0,
            fontWeight: 700,
            color: "text.secondary",
            lineHeight: 1.3,
            fontSize: "0.7rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {car || "—"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            flexShrink: 0,
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.3,
            fontSize: "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {clientName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: style.accentColor,
            fontSize: "0.65rem",
            lineHeight: 1.3,
            minHeight: "2.6em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {route || "—"}
        </Typography>
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          minHeight: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 0.5,
          minWidth: 0,
          pt: 0.25,
        }}
      >
        <Box
          sx={{
            minHeight: 22,
            display: "inline-flex",
            alignItems: "center",
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid",
            borderColor: style.borderColor,
            overflow: "visible",
          }}
        >
          <Typography
            variant="caption"
            component="span"
            sx={{
              fontSize: "0.65rem",
              fontWeight: 600,
              color: style.accentColor,
              lineHeight: 1.25,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {statusLabel}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            flexShrink: 0,
            fontWeight: 600,
            color: "text.secondary",
            fontSize: "0.7rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {timeStr}
        </Typography>
      </Box>
    </Box>
  );
}
