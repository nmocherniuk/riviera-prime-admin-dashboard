import type { FleetClass, FleetStatus } from "../../data/dummyFleet";

export const classColors: Record<FleetClass, { bg: string; color: string }> = {
    Comfort: { bg: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" },
    Business: { bg: "rgba(212,175,53,0.2)", color: "#D4AF35" },
    Van: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
};

export const statusColors: Record<FleetStatus, { bg: string; color: string }> = {
    ACTIVE: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
    INACTIVE: { bg: "rgba(148, 163, 184, 0.25)", color: "#94a3b8" },
};
