import { Box, Typography } from "@mui/material";
import { useMemo, useRef } from "react";
import type React from "react";
import { getWeekStart } from "../utils/dateUtils";

type Props = {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
};

export default function WeekStrip({ selectedDate, onChangeDate }: Props) {
  const { days, weekStart } = useMemo(() => {
    const start = getWeekStart(selectedDate);
    const arr: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return { days: arr, weekStart: start };
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const touchStartX = useRef<number | null>(null);

  const changeWeek = (deltaWeeks: number) => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + deltaWeeks * 7);
    onChangeDate(next);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;

    const deltaX = e.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX == null) return;

    const threshold = 40;
    if (deltaX > threshold) {
      changeWeek(-1);
    } else if (deltaX < -threshold) {
      changeWeek(1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflowX: "auto",
          gap: 1,
          py: 0.5,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {days.map((day) => {
          const isToday = day.getTime() === today.getTime();
          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <Box
              key={day.toISOString()}
              onClick={() => onChangeDate(day)}
              sx={{
                flex: 1,
                minWidth: 0,
                cursor: "pointer",
                borderRadius: 2,
                px: 1,
                py: 0.75,
                textAlign: "center",
                bgcolor: isSelected
                  ? "primary.main"
                  : isToday
                    ? "rgba(212,175,53,0.18)"
                    : "transparent",
                color: isSelected ? "common.black" : "text.secondary",
                border: isSelected
                  ? "none"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontWeight: 600,
                  display: "block",
                }}
              >
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {day.getDate()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
