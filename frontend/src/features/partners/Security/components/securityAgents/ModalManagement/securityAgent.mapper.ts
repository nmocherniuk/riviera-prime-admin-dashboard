import { toNumber } from "../../../../../../utils/transform";

import {
  defaultSecurityAgentFormValues,
  type SecurityAgent,
  type SecurityAgentFormValues,
} from "./securityAgentForm.types";
import { csvToStringArray, dateInput, dateOnlyForApi, employmentFromApi, languagesFromApi, numStr, physicalFromApi, specializationsFromApi, str } from "./utils";

function buildSecurityAgentPayload(
  v: SecurityAgentFormValues,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    firstName: v.firstName.trim() || "Unnamed",
    lastName: v.lastName.trim() || "Agent",
    languages: v.languages ?? [],
    specializations: csvToStringArray(v.specializations),
    hasVipExperience: v.hasVipExperience,
    hasEventExperience: v.hasEventExperience,
    hasDriverLicenseB: v.hasDriverLicenseB,
    hasFirstAidTraining: v.hasFirstAidTraining,
    weaponExperience: v.weaponExperience,
    readyForTravel: v.readyForTravel,
    readyForNightShifts: v.readyForNightShifts,
    passportProvided: v.passportProvided,
    professionalCardProvided: v.professionalCardProvided,
    cnapsProvided: v.cnapsProvided,
    cvProvided: v.cvProvided,
    certificatesProvided: v.certificatesProvided,
    firstAidCertificateProvided: v.firstAidCertificateProvided,
    driverLicenseProvided: v.driverLicenseProvided,
    backgroundCheckProvided: v.backgroundCheckProvided,
    profilePhotoProvided: v.profilePhotoProvided,
    signedContractProvided: v.signedContractProvided,
    canWorkInTeam: v.canWorkInTeam,
    canTravelWithClient: v.canTravelWithClient,
    canDoDriverSecurity: v.canDoDriverSecurity,
    status: v.status,
  };

  const birthDate = dateOnlyForApi(v.birthDate);
  if (birthDate !== undefined) payload.birthDate = birthDate;
  const cardIssuedAt = dateOnlyForApi(v.cardIssuedAt);
  if (cardIssuedAt !== undefined) payload.cardIssuedAt = cardIssuedAt;
  const cardExpiresAt = dateOnlyForApi(v.cardExpiresAt);
  if (cardExpiresAt !== undefined) payload.cardExpiresAt = cardExpiresAt;

  if (v.employmentStatus) {
    payload.employmentStatus = v.employmentStatus;
  }
  if (v.physicalLevel) {
    payload.physicalLevel = v.physicalLevel;
  }

  payload.nationality = v.nationality?.trim() || undefined;
  payload.profilePhotoUrl = v.profilePhotoUrl?.trim() || undefined;
  payload.phone = v.phone?.trim() || undefined;
  payload.email = v.email?.trim() || undefined;
  payload.address = v.address?.trim() || undefined;
  payload.emergencyContact = v.emergencyContact?.trim() || undefined;
  payload.professionalCardNumber = v.professionalCardNumber?.trim() || undefined;
  payload.cnapsNumber = v.cnapsNumber?.trim() || undefined;
  payload.additionalLicenses = v.additionalLicenses?.trim() || undefined;
  payload.baseCity = v.baseCity?.trim() || undefined;
  payload.availability = v.availability?.trim() || undefined;

  const ey = toNumber(v.experienceYears);
  if (ey !== undefined) payload.experienceYears = ey;
  const wr = toNumber(v.workingRadiusKm);
  if (wr !== undefined) payload.workingRadiusKm = wr;
  const hr = toNumber(v.hourlyRate);
  const dr = toNumber(v.dailyRate);
  const nr = toNumber(v.nightRate);
  if (hr !== undefined) payload.hourlyRate = hr;
  if (dr !== undefined) payload.dailyRate = dr;
  if (nr !== undefined) payload.nightRate = nr;
  payload.notes = v.notes?.trim() || undefined;

  return payload;
}

export function formValuesToSecurityAgent(
  v: SecurityAgentFormValues,
  organizationId: string,
): SecurityAgent {
  return {
    organizationId,
    ...buildSecurityAgentPayload(v),
  } as unknown as SecurityAgent;
}

export function securityAgentFormToUpdateBody(
  v: SecurityAgentFormValues,
): Record<string, unknown> {
  return buildSecurityAgentPayload(v);
}


export function securityAgentToFormValues(
  agent: Record<string, unknown>,
): SecurityAgentFormValues {
  const d = defaultSecurityAgentFormValues;
  const id = str(agent.id);
  return {
    ...d,
    ...(id ? { id } : {}),
    firstName: str(agent.firstName),
    lastName: str(agent.lastName),
    birthDate: dateInput(agent.birthDate),
    nationality: str(agent.nationality),
    profilePhotoUrl: str(agent.profilePhotoUrl),
    phone: str(agent.phone),
    email: str(agent.email),
    address: str(agent.address),
    languages: languagesFromApi(agent.languages),
    emergencyContact: str(agent.emergencyContact),
    employmentStatus: employmentFromApi(agent.employmentStatus),
    professionalCardNumber: str(agent.professionalCardNumber),
    cnapsNumber: str(agent.cnapsNumber),
    cardIssuedAt: dateInput(agent.cardIssuedAt),
    cardExpiresAt: dateInput(agent.cardExpiresAt),
    specializations: specializationsFromApi(agent.specializations),
    experienceYears: numStr(agent.experienceYears),
    hasVipExperience: Boolean(agent.hasVipExperience),
    hasEventExperience: Boolean(agent.hasEventExperience),
    hasDriverLicenseB: Boolean(agent.hasDriverLicenseB),
    additionalLicenses: str(agent.additionalLicenses),
    physicalLevel: physicalFromApi(agent.physicalLevel),
    hasFirstAidTraining: Boolean(agent.hasFirstAidTraining),
    weaponExperience: Boolean(agent.weaponExperience),
    readyForTravel: Boolean(agent.readyForTravel),
    readyForNightShifts: Boolean(agent.readyForNightShifts),
    passportProvided: Boolean(agent.passportProvided),
    professionalCardProvided: Boolean(agent.professionalCardProvided),
    cnapsProvided: Boolean(agent.cnapsProvided),
    cvProvided: Boolean(agent.cvProvided),
    certificatesProvided: Boolean(agent.certificatesProvided),
    firstAidCertificateProvided: Boolean(agent.firstAidCertificateProvided),
    driverLicenseProvided: Boolean(agent.driverLicenseProvided),
    backgroundCheckProvided: Boolean(agent.backgroundCheckProvided),
    profilePhotoProvided: Boolean(agent.profilePhotoProvided),
    signedContractProvided: Boolean(agent.signedContractProvided),
    baseCity: str(agent.baseCity),
    workingRadiusKm: numStr(agent.workingRadiusKm),
    availability: str(agent.availability),
    hourlyRate: numStr(agent.hourlyRate),
    dailyRate: numStr(agent.dailyRate),
    nightRate: numStr(agent.nightRate),
    canWorkInTeam:
      agent.canWorkInTeam != null ? Boolean(agent.canWorkInTeam) : true,
    canTravelWithClient:
      agent.canTravelWithClient != null ? Boolean(agent.canTravelWithClient) : true,
    canDoDriverSecurity: Boolean(agent.canDoDriverSecurity),
    status: agent.status != null ? Boolean(agent.status) : true,
    notes: str(agent.notes),
  };
}
