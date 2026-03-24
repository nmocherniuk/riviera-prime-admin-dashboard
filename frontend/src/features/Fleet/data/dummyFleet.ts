export type FleetClass = "Comfort" | "Business" | "Van";
export type FleetStatus = "AVAILABLE" | "ON TRIP";

export type FleetVehicle = {
  id: string;
  organizationId: string;
  driverId?: string | null;
  vehicleName: string;
  yearColor: string;
  licensePlate: string;
  class: FleetClass;
  status: FleetStatus;
  nextService: string;
};

export const DUMMY_FLEET: FleetVehicle[] = [
  {
    id: "DRV-001",
    organizationId: "",
    driverId: null,
    vehicleName: "BMW 7 Series",
    yearColor: "2023 Black Metallic",
    licensePlate: "AV-2023-XD",
    class: "Business",
    status: "AVAILABLE",
    nextService: "Oct 12, 2026",
  },
  {
    id: "DRV-002",
    organizationId: "",
    driverId: null,
    vehicleName: "Mercedes-Benz S-Class",
    yearColor: "2024 Navy Blue",
    licensePlate: "BV-2024-MB",
    class: "Business",
    status: "ON TRIP",
    nextService: "Nov 5, 2026",
  },
  {
    id: "DRV-003",
    organizationId: "",
    driverId: null,
    vehicleName: "Audi A8",
    yearColor: "2023 Silver",
    licensePlate: "CV-2023-AU",
    class: "Comfort",
    status: "AVAILABLE",
    nextService: "Sep 28, 2026",
  },
  {
    id: "DRV-004",
    organizationId: "",
    driverId: null,
    vehicleName: "Mercedes V-Class",
    yearColor: "2024 White",
    licensePlate: "DV-2024-VC",
    class: "Van",
    status: "AVAILABLE",
    nextService: "Dec 1, 2026",
  },
  {
    id: "DRV-005",
    organizationId: "",
    driverId: null,
    vehicleName: "Range Rover Sentinel",
    yearColor: "2023 Black",
    licensePlate: "EV-2023-RR",
    class: "Business",
    status: "ON TRIP",
    nextService: "Jan 15, 2027",
  },
];
