// Blog schema for MongoDB
// This is a helper for TypeScript and validation, not enforced by MongoDB itself
export interface Blog {
  _id?: string;
  title: string;
  description: string;
  pdfUrl?: string; // URL or path to the PDF file
  keywords?: string[]; // Array of keywords for searching
}
