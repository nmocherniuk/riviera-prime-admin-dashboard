import type { VehicleClass } from "../../generated/prisma/enums.js";
import type { VehicleJson } from "./vehicle.types.js";

export function isPrismaUniqueError(
    error: unknown,
): error is { code: string; meta?: { target?: unknown } } {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
    );
}

export function toDbClass(value: VehicleJson["class"]): VehicleClass {
    if (value === "Comfort") return "COMFORT";
    if (value === "Business") return "BUSINESS";
    return "VAN";
}

export function toPublicClass(value: VehicleClass): VehicleJson["class"] {
    if (value === "COMFORT") return "Comfort";
    if (value === "BUSINESS") return "Business";
    return "Van";
}
