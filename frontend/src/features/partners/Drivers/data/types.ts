export type DriverOrganizationStatus = "active" | "inactive";

export type DriverOrganization = {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceArea: string;
  status: DriverOrganizationStatus;
};

