export type PartnerStatus = "active" | "inactive";

export type Partner = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  locationServiceArea: string;
  status: PartnerStatus;
};

export type BodyguardAvailabilityStatus = "available" | "on_assignment" | "off_duty";

export type Bodyguard = {
  id: string;
  partnerId: string;
  name: string;
  licenseCertification: string;
  experience: string;
  languages: string;
  availabilityStatus: BodyguardAvailabilityStatus;
  notes: string;
};
