// Contact submission schema for MongoDB (TypeScript only)
// This is a helper for TypeScript and validation, not enforced by MongoDB itself
export interface ContactSubmission {
  _id?: string;
  fullName: string;
  mobile: string;
  email: string;
  businessName: string;
  businessType: string;
  businessTypeOther?: string;
  services: string[];
  servicesOther?: string;
  turnover?: string;
  contactModes: string[];
  requirement: string;
  bookConsultation: string;
  createdAt?: Date | string;
  contacted?: boolean;
  contactedAt?: Date | string;
} 