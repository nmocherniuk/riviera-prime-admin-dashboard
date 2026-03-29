import type { FleetVehicle } from "../components/ModalManagement/fleetManagementForm.types";

export type FleetClass = "Comfort" | "Business" | "Van";
export type FleetStatus = "ACTIVE" | "INACTIVE";

export const FLEET_STATUS_LABELS: Record<FleetStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};



export const DUMMY_FLEET: FleetVehicle[] = [
  {
    id: "DRV-001",
    organizationId: "",
    driverId: null,
    vehicleName: "BMW 7 Series",
    year: "2023",
    color: "Black Metallic",
    licensePlate: "AV-2023-XD",
    class: "Business",
    status: "ACTIVE",
  },
  {
    id: "DRV-002",
    organizationId: "",
    driverId: null,
    vehicleName: "Mercedes-Benz S-Class",
    year: "2024",
    color: "Navy Blue",
    licensePlate: "BV-2024-MB",
    class: "Business",
    status: "INACTIVE",
  },
  {
    id: "DRV-003",
    organizationId: "",
    driverId: null,
    vehicleName: "Audi A8",
    year: "2023",
    color: "Silver",
    licensePlate: "CV-2023-AU",
    class: "Comfort",
    status: "ACTIVE",
  },
  {
    id: "DRV-004",
    organizationId: "",
    driverId: null,
    vehicleName: "Mercedes V-Class",
    year: "2024",
    color: "White",
    licensePlate: "DV-2024-VC",
    class: "Van",
    status: "ACTIVE",
  },
  {
    id: "DRV-005",
    organizationId: "",
    driverId: null,
    vehicleName: "Range Rover Sentinel",
    year: "2023",
    color: "Black",
    licensePlate: "EV-2023-RR",
    class: "Business",
    status: "INACTIVE",
  },
];
