import type { Driver } from "../../../data/dummyDrivers";
import {
  defaultFormValues,
  type DriverFormValues,
} from "./driverManagementForm.types";

export function driverToFormValues(driver: Driver | null): DriverFormValues {
  if (!driver) return defaultFormValues;

  return {
    name: driver.name ?? "",
    phone: driver.phone ?? "",
    email: driver.email ?? "",
    address: driver.address ?? "",
    nationality: driver.nationality ?? "",
    birthDate: driver.birthDate ? String(driver.birthDate).slice(0, 10) : "",
    languages: (driver.languages ?? []).join(", "),
    emergencyContact: driver.emergencyContact ?? "",
    employmentStatus: driver.employmentStatus ?? "",
    vtcCardNumber: driver.vtcCardNumber ?? "",
    vtcCardIssuedAt: driver.vtcCardIssuedAt
      ? String(driver.vtcCardIssuedAt).slice(0, 10)
      : "",
    vtcCardExpiresAt: driver.vtcCardExpiresAt
      ? String(driver.vtcCardExpiresAt).slice(0, 10)
      : "",
    driverLicenseNumber: driver.driverLicenseNumber ?? "",
    licenseCategory: driver.licenseCategory ?? "",
    licenseIssuedAt: driver.licenseIssuedAt
      ? String(driver.licenseIssuedAt).slice(0, 10)
      : "",
    licenseExpiresAt: driver.licenseExpiresAt
      ? String(driver.licenseExpiresAt).slice(0, 10)
      : "",
    drivingExperienceYears:
      driver.drivingExperienceYears != null
        ? String(driver.drivingExperienceYears)
        : "",
    hasVipExperience: driver.hasVipExperience ?? false,
    hasEventExperience: driver.hasEventExperience ?? false,
    languageLevel: driver.languageLevel ?? "",
    dressCodeReady: driver.dressCodeReady ?? false,
    passportProvided: driver.passportProvided ?? false,
    driverLicenseProvided: driver.driverLicenseProvided ?? false,
    vtcCardProvided: driver.vtcCardProvided ?? false,
    criminalRecordProvided: driver.criminalRecordProvided ?? false,
    medicalCertificateProvided: driver.medicalCertificateProvided ?? false,
    insuranceProofProvided: driver.insuranceProofProvided ?? false,
    profilePhotoProvided: driver.profilePhotoProvided ?? false,
    signedContractProvided: driver.signedContractProvided ?? false,
    baseCity: driver.baseCity ?? "",
    workingRadiusKm:
      driver.workingRadiusKm != null ? String(driver.workingRadiusKm) : "",
    acceptsLongDistance: driver.acceptsLongDistance ?? false,
    acceptsNightTrips: driver.acceptsNightTrips ?? false,
    acceptsAirportTransfers: driver.acceptsAirportTransfers ?? false,
    acceptsVipClients: driver.acceptsVipClients ?? false,
    availabilityDays: (driver.availabilityDays ?? []).join(", "),
    availabilityHours: driver.availabilityHours ?? "",
    hasOwnVehicle: driver.hasOwnVehicle ?? false,
    vehicleId: "",
    vehicleType: "",
    vehicle: driver.vehicle || "",
    vehiclePlate: driver.vehiclePlate ?? "",
    vehicleColor: driver.vehicleColor ?? "",
    status: driver.status,
    rides: String(driver.rides ?? 0),
    todayShift: driver.todayShift ?? "",
  };
}

