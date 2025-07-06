// Service schema for MongoDB
// This is a helper for TypeScript and validation, not enforced by MongoDB itself
export interface Service {
  _id?: string;
  title: string;
  short_desc: string;
  long_desc: string;
  pdfUrl?: string; // URL or path to the PDF file (broucher)
}
