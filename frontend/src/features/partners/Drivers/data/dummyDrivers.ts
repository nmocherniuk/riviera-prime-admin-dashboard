export type DriverStatus = "AVAILABLE" | "ON RIDE" | "OFFLINE";

export type Driver = {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: DriverStatus;
  rides: number;
  earning: string;
  todayShift: string;
};

export const DUMMY_DRIVERS: Driver[] = [
  {
    id: "DRV-001",
    organizationId: "ORG-001",
    organizationName: "Aurevia Executive Travel",
    name: "James Sterling",
    vehicle: "Mercedes-Benz S-Class",
    vehiclePlate: "LIMO-992",
    vehicleColor: "Black",
    status: "AVAILABLE",
    rides: 123,
    earning: "$3,421.21",
    todayShift: "08:00-18:00",
  },
  {
    id: "DRV-002",
    organizationId: "ORG-001",
    organizationName: "Aurevia Executive Travel",
    name: "Maria Chen",
    vehicle: "BMW 7 Series",
    vehiclePlate: "LIMO-881",
    vehicleColor: "Navy",
    status: "ON RIDE",
    rides: 98,
    earning: "$2,890.50",
    todayShift: "10:00-22:00",
  },
  {
    id: "DRV-003",
    organizationId: "ORG-002",
    organizationName: "Nordic Chauffeur Partners",
    name: "David Okonkwo",
    vehicle: "Audi A8",
    vehiclePlate: "LIMO-774",
    vehicleColor: "Silver",
    status: "OFFLINE",
    rides: 156,
    earning: "$4,102.00",
    todayShift: "OFF",
  },
  {
    id: "DRV-004",
    organizationId: "ORG-002",
    organizationName: "Nordic Chauffeur Partners",
    name: "Elena Petrova",
    vehicle: "Mercedes-Benz E-Class",
    vehiclePlate: "LIMO-663",
    vehicleColor: "White",
    status: "AVAILABLE",
    rides: 87,
    earning: "$2,456.80",
    todayShift: "06:00-14:00",
  },
  {
    id: "DRV-005",
    organizationId: "ORG-003",
    organizationName: "London Premium Fleet",
    name: "Michael Brown",
    vehicle: "Range Rover Sentinel",
    vehiclePlate: "LIMO-552",
    vehicleColor: "Black",
    status: "ON RIDE",
    rides: 201,
    earning: "$5,678.90",
    todayShift: "NIGHT SHIFT",
  },
];
