import { z } from 'zod';

// Agency schemas
export const agencySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  state: z.string().nullable(),
  stateCode: z.string().nullable(),
  type: z.string().nullable(),
  population: z.number().int().positive().nullable(),
  website: z.string().url().nullable(),
  county: z.string().nullable(),
  phone: z.string().nullable(),
});

export const agencyFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  search: z.string().optional(),
  state: z.string().optional(),
  pageSize: z.number().int().positive().default(20),
});

// Contact schemas
export const contactSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  title: z.string().nullable(),
  department: z.string().nullable(),
  agencyId: z.string().uuid().nullable(),
});

export const contactFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  search: z.string().optional(),
  agency: z.string().optional(),
  pageSize: z.number().int().positive().default(20),
});

// Contact view tracking
export const trackViewSchema = z.object({
  contactId: z.string().uuid(),
});

// Export types
export type Agency = z.infer<typeof agencySchema>;
export type AgencyFilter = z.infer<typeof agencyFilterSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ContactFilter = z.infer<typeof contactFilterSchema>;
export type TrackView = z.infer<typeof trackViewSchema>;
