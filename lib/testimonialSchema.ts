// Testimonial schema for MongoDB
// This is a helper for TypeScript and validation, not enforced by MongoDB itself
export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  star: number;
  testimonial: string;
}
