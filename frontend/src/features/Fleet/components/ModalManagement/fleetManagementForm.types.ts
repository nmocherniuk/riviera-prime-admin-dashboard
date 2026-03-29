import type { FleetClass, FleetStatus } from "../../data/dummyFleet";

export const defaultFormValues: FleetFormValues = {
    organizationId: "",
    driverId: "",
    vehicleName: "",
    year: "",
    color: "",
    licensePlate: "",
    class: "Business",
    status: "ACTIVE",
};

export type FleetVehicle = {
    id?: string;
    organizationId?: string | null;
    driverId?: string | null;
    vehicleName: string;
    year: string;
    color: string;
    licensePlate: string;
    class: FleetClass;
    status: FleetStatus;
};

export type FleetFormValues = {
    organizationId: string;
    driverId: string;
    vehicleName: string;
    year: string;
    color: string;
    licensePlate: string;
    class: FleetClass;
    status: FleetStatus;
};

export const FLEET_CLASSES: FleetClass[] = ["Comfort", "Business", "Van"];
export const FLEET_STATUSES: FleetStatus[] = ["ACTIVE", "INACTIVE"];
