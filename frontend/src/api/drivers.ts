import { api } from "./api";
import type { Driver, DriverStatus } from "../features/partners/Drivers/data/dummyDrivers";

export type DriverDto = {
  id: string;
  organizationId: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  nationality: string | null;
  birthDate: string | null;
  languages: string[];
  emergencyContact: string | null;
  employmentStatus: "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR" | null;
  vtcCardNumber: string | null;
  vtcCardIssuedAt: string | null;
  vtcCardExpiresAt: string | null;
  driverLicenseNumber: string | null;
  licenseCategory: string | null;
  licenseIssuedAt: string | null;
  licenseExpiresAt: string | null;
  drivingExperienceYears: number | null;
  hasVipExperience: boolean;
  hasEventExperience: boolean;
  languageLevel: string | null;
  dressCodeReady: boolean;
  passportProvided: boolean;
  driverLicenseProvided: boolean;
  vtcCardProvided: boolean;
  criminalRecordProvided: boolean;
  medicalCertificateProvided: boolean;
  insuranceProofProvided: boolean;
  profilePhotoProvided: boolean;
  signedContractProvided: boolean;
  baseCity: string | null;
  workingRadiusKm: number | null;
  acceptsLongDistance: boolean;
  acceptsNightTrips: boolean;
  acceptsAirportTransfers: boolean;
  acceptsVipClients: boolean;
  availabilityDays: string[];
  availabilityHours: string | null;
  hasOwnVehicle: boolean;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: DriverStatus;
  rides: number;
  earning: string;
  todayShift: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDriverBody = {
  organizationId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  nationality?: string;
  birthDate?: string;
  languages?: string[];
  emergencyContact?: string;
  employmentStatus?: "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR";
  vtcCardNumber?: string;
  vtcCardIssuedAt?: string;
  vtcCardExpiresAt?: string;
  driverLicenseNumber?: string;
  licenseCategory?: string;
  licenseIssuedAt?: string;
  licenseExpiresAt?: string;
  drivingExperienceYears?: number;
  hasVipExperience?: boolean;
  hasEventExperience?: boolean;
  languageLevel?: string;
  dressCodeReady?: boolean;
  passportProvided?: boolean;
  driverLicenseProvided?: boolean;
  vtcCardProvided?: boolean;
  criminalRecordProvided?: boolean;
  medicalCertificateProvided?: boolean;
  insuranceProofProvided?: boolean;
  profilePhotoProvided?: boolean;
  signedContractProvided?: boolean;
  baseCity?: string;
  workingRadiusKm?: number;
  acceptsLongDistance?: boolean;
  acceptsNightTrips?: boolean;
  acceptsAirportTransfers?: boolean;
  acceptsVipClients?: boolean;
  availabilityDays?: string[];
  availabilityHours?: string;
  hasOwnVehicle?: boolean;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: DriverStatus;
  rides: number;
  todayShift: string;
};

export type UpdateDriverBody = Omit<CreateDriverBody, "organizationId">;

export function dtoToDriver(dto: DriverDto, organizationName: string): Driver {
  return {
    id: dto.id,
    organizationId: dto.organizationId,
    organizationName,
    name: dto.name,
    phone: dto.phone,
    email: dto.email,
    address: dto.address,
    nationality: dto.nationality,
    birthDate: dto.birthDate,
    languages: dto.languages,
    emergencyContact: dto.emergencyContact,
    employmentStatus: dto.employmentStatus,
    vtcCardNumber: dto.vtcCardNumber,
    vtcCardIssuedAt: dto.vtcCardIssuedAt,
    vtcCardExpiresAt: dto.vtcCardExpiresAt,
    driverLicenseNumber: dto.driverLicenseNumber,
    licenseCategory: dto.licenseCategory,
    licenseIssuedAt: dto.licenseIssuedAt,
    licenseExpiresAt: dto.licenseExpiresAt,
    drivingExperienceYears: dto.drivingExperienceYears,
    hasVipExperience: dto.hasVipExperience,
    hasEventExperience: dto.hasEventExperience,
    languageLevel: dto.languageLevel,
    dressCodeReady: dto.dressCodeReady,
    passportProvided: dto.passportProvided,
    driverLicenseProvided: dto.driverLicenseProvided,
    vtcCardProvided: dto.vtcCardProvided,
    criminalRecordProvided: dto.criminalRecordProvided,
    medicalCertificateProvided: dto.medicalCertificateProvided,
    insuranceProofProvided: dto.insuranceProofProvided,
    profilePhotoProvided: dto.profilePhotoProvided,
    signedContractProvided: dto.signedContractProvided,
    baseCity: dto.baseCity,
    workingRadiusKm: dto.workingRadiusKm,
    acceptsLongDistance: dto.acceptsLongDistance,
    acceptsNightTrips: dto.acceptsNightTrips,
    acceptsAirportTransfers: dto.acceptsAirportTransfers,
    acceptsVipClients: dto.acceptsVipClients,
    availabilityDays: dto.availabilityDays,
    availabilityHours: dto.availabilityHours,
    hasOwnVehicle: dto.hasOwnVehicle,
    vehicle: dto.vehicle,
    vehiclePlate: dto.vehiclePlate,
    vehicleColor: dto.vehicleColor,
    status: dto.status,
    rides: dto.rides,
    earning: dto.earning,
    todayShift: dto.todayShift,
  };
}

export function driverFormToCreateBody(
  values: {
    name: string;
    phone: string;
    email: string;
    address: string;
    nationality: string;
    birthDate: string;
    languages: string;
    emergencyContact: string;
    employmentStatus: "" | "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR";
    vtcCardNumber: string;
    vtcCardIssuedAt: string;
    vtcCardExpiresAt: string;
    driverLicenseNumber: string;
    licenseCategory: string;
    licenseIssuedAt: string;
    licenseExpiresAt: string;
    drivingExperienceYears: string;
    hasVipExperience: boolean;
    hasEventExperience: boolean;
    languageLevel: string;
    dressCodeReady: boolean;
    passportProvided: boolean;
    driverLicenseProvided: boolean;
    vtcCardProvided: boolean;
    criminalRecordProvided: boolean;
    medicalCertificateProvided: boolean;
    insuranceProofProvided: boolean;
    profilePhotoProvided: boolean;
    signedContractProvided: boolean;
    baseCity: string;
    workingRadiusKm: string;
    acceptsLongDistance: boolean;
    acceptsNightTrips: boolean;
    acceptsAirportTransfers: boolean;
    acceptsVipClients: boolean;
    availabilityDays: string;
    availabilityHours: string;
    hasOwnVehicle: boolean;
    vehicle: string;
    vehiclePlate: string;
    vehicleColor: string;
    status: DriverStatus;
    rides: string;
    todayShift: string;
  },
  organizationId: string,
): CreateDriverBody {
  const ridesNumber = Number.parseInt(values.rides, 10);
  const yearsNumber = Number.parseInt(values.drivingExperienceYears, 10);
  const radiusNumber = Number.parseInt(values.workingRadiusKm, 10);

  return {
    organizationId,
    name: values.name.trim() || "Unnamed driver",
    phone: values.phone.trim() || undefined,
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    nationality: values.nationality.trim() || undefined,
    birthDate: values.birthDate || undefined,
    languages: values.languages
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    emergencyContact: values.emergencyContact.trim() || undefined,
    employmentStatus: values.employmentStatus || undefined,
    vtcCardNumber: values.vtcCardNumber.trim() || undefined,
    vtcCardIssuedAt: values.vtcCardIssuedAt || undefined,
    vtcCardExpiresAt: values.vtcCardExpiresAt || undefined,
    driverLicenseNumber: values.driverLicenseNumber.trim() || undefined,
    licenseCategory: values.licenseCategory.trim() || undefined,
    licenseIssuedAt: values.licenseIssuedAt || undefined,
    licenseExpiresAt: values.licenseExpiresAt || undefined,
    drivingExperienceYears: Number.isFinite(yearsNumber) ? yearsNumber : undefined,
    hasVipExperience: values.hasVipExperience,
    hasEventExperience: values.hasEventExperience,
    languageLevel: values.languageLevel.trim() || undefined,
    dressCodeReady: values.dressCodeReady,
    passportProvided: values.passportProvided,
    driverLicenseProvided: values.driverLicenseProvided,
    vtcCardProvided: values.vtcCardProvided,
    criminalRecordProvided: values.criminalRecordProvided,
    medicalCertificateProvided: values.medicalCertificateProvided,
    insuranceProofProvided: values.insuranceProofProvided,
    profilePhotoProvided: values.profilePhotoProvided,
    signedContractProvided: values.signedContractProvided,
    baseCity: values.baseCity.trim() || undefined,
    workingRadiusKm: Number.isFinite(radiusNumber) ? radiusNumber : undefined,
    acceptsLongDistance: values.acceptsLongDistance,
    acceptsNightTrips: values.acceptsNightTrips,
    acceptsAirportTransfers: values.acceptsAirportTransfers,
    acceptsVipClients: values.acceptsVipClients,
    availabilityDays: values.availabilityDays
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    availabilityHours: values.availabilityHours.trim() || undefined,
    hasOwnVehicle: values.hasOwnVehicle,
    vehicle: values.vehicle.trim() || "Unknown vehicle",
    vehiclePlate: values.vehiclePlate.trim() || "N/A",
    vehicleColor: values.vehicleColor.trim() || "N/A",
    status: values.status,
    rides: Number.isFinite(ridesNumber) ? ridesNumber : 0,
    todayShift: values.todayShift.trim(),
  };
}

export function driverFormToUpdateBody(
  values: {
    name: string;
    phone: string;
    email: string;
    address: string;
    nationality: string;
    birthDate: string;
    languages: string;
    emergencyContact: string;
    employmentStatus: "" | "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR";
    vtcCardNumber: string;
    vtcCardIssuedAt: string;
    vtcCardExpiresAt: string;
    driverLicenseNumber: string;
    licenseCategory: string;
    licenseIssuedAt: string;
    licenseExpiresAt: string;
    drivingExperienceYears: string;
    hasVipExperience: boolean;
    hasEventExperience: boolean;
    languageLevel: string;
    dressCodeReady: boolean;
    passportProvided: boolean;
    driverLicenseProvided: boolean;
    vtcCardProvided: boolean;
    criminalRecordProvided: boolean;
    medicalCertificateProvided: boolean;
    insuranceProofProvided: boolean;
    profilePhotoProvided: boolean;
    signedContractProvided: boolean;
    baseCity: string;
    workingRadiusKm: string;
    acceptsLongDistance: boolean;
    acceptsNightTrips: boolean;
    acceptsAirportTransfers: boolean;
    acceptsVipClients: boolean;
    availabilityDays: string;
    availabilityHours: string;
    hasOwnVehicle: boolean;
    vehicle: string;
    vehiclePlate: string;
    vehicleColor: string;
    status: DriverStatus;
    rides: string;
    todayShift: string;
  },
  current: Driver,
): UpdateDriverBody {
  const ridesNumber = Number.parseInt(values.rides, 10);
  const yearsNumber = Number.parseInt(values.drivingExperienceYears, 10);
  const radiusNumber = Number.parseInt(values.workingRadiusKm, 10);

  return {
    name: values.name.trim() || current.name,
    phone: values.phone.trim() || undefined,
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    nationality: values.nationality.trim() || undefined,
    birthDate: values.birthDate || undefined,
    languages: values.languages
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    emergencyContact: values.emergencyContact.trim() || undefined,
    employmentStatus: values.employmentStatus || undefined,
    vtcCardNumber: values.vtcCardNumber.trim() || undefined,
    vtcCardIssuedAt: values.vtcCardIssuedAt || undefined,
    vtcCardExpiresAt: values.vtcCardExpiresAt || undefined,
    driverLicenseNumber: values.driverLicenseNumber.trim() || undefined,
    licenseCategory: values.licenseCategory.trim() || undefined,
    licenseIssuedAt: values.licenseIssuedAt || undefined,
    licenseExpiresAt: values.licenseExpiresAt || undefined,
    drivingExperienceYears: Number.isFinite(yearsNumber) ? yearsNumber : undefined,
    hasVipExperience: values.hasVipExperience,
    hasEventExperience: values.hasEventExperience,
    languageLevel: values.languageLevel.trim() || undefined,
    dressCodeReady: values.dressCodeReady,
    passportProvided: values.passportProvided,
    driverLicenseProvided: values.driverLicenseProvided,
    vtcCardProvided: values.vtcCardProvided,
    criminalRecordProvided: values.criminalRecordProvided,
    medicalCertificateProvided: values.medicalCertificateProvided,
    insuranceProofProvided: values.insuranceProofProvided,
    profilePhotoProvided: values.profilePhotoProvided,
    signedContractProvided: values.signedContractProvided,
    baseCity: values.baseCity.trim() || undefined,
    workingRadiusKm: Number.isFinite(radiusNumber) ? radiusNumber : undefined,
    acceptsLongDistance: values.acceptsLongDistance,
    acceptsNightTrips: values.acceptsNightTrips,
    acceptsAirportTransfers: values.acceptsAirportTransfers,
    acceptsVipClients: values.acceptsVipClients,
    availabilityDays: values.availabilityDays
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    availabilityHours: values.availabilityHours.trim() || undefined,
    hasOwnVehicle: values.hasOwnVehicle,
    vehicle: values.vehicle.trim() || current.vehicle,
    vehiclePlate: values.vehiclePlate.trim() || current.vehiclePlate,
    vehicleColor: values.vehicleColor.trim() || current.vehicleColor,
    status: values.status,
    rides: Number.isFinite(ridesNumber) ? ridesNumber : current.rides,
    todayShift: values.todayShift.trim() || current.todayShift,
  };
}

export async function listDrivers(organizationId?: string) {
  const { data } = await api.get<{ drivers: DriverDto[] }>("/drivers", {
    params: organizationId ? { organizationId } : {},
  });
  return data.drivers;
}

export async function createDriver(body: CreateDriverBody) {
  const { data } = await api.post<{ driver: DriverDto }>("/drivers", body);
  return data.driver;
}

export async function updateDriver(
  id: string,
  body: UpdateDriverBody,
  organizationId?: string,
) {
  const { data } = await api.patch<{ driver: DriverDto }>(`/drivers/${id}`, body, {
    params: organizationId ? { organizationId } : {},
  });
  return data.driver;
}

export async function deleteDriver(id: string, organizationId?: string) {
  await api.delete(`/drivers/${id}`, {
    params: organizationId ? { organizationId } : {},
  });
}
