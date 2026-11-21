import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '../models/Lead.js';

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[0-9+\-()\s.]+$/, 'Phone number contains invalid characters'),
  company: z
    .string({ required_error: 'Company is required' })
    .trim()
    .min(1, 'Company is required')
    .max(100, 'Company cannot exceed 100 characters'),
  source: z.enum(LEAD_SOURCES, {
    errorMap: () => ({
      message: `Source must be one of: ${LEAD_SOURCES.join(', ')}`
    })
  }),
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({
      message: `Status must be one of: ${LEAD_STATUSES.join(', ')}`
    })
  }).default('New')
});

export const updateLeadSchema = createLeadSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({
      message: `Status must be one of: ${LEAD_STATUSES.join(', ')}`
    })
  })
});

export const queryLeadsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  search: z.string().optional().default(''),
  status: z
    .string()
    .optional()
    .refine((val) => !val || val === 'All' || LEAD_STATUSES.includes(val), {
      message: `Status filter must be All or one of: ${LEAD_STATUSES.join(', ')}`
    }),
  source: z
    .string()
    .optional()
    .refine((val) => !val || val === 'All' || LEAD_SOURCES.includes(val), {
      message: `Source filter must be All or one of: ${LEAD_SOURCES.join(', ')}`
    }),
  sortBy: z.enum(['createdAt', 'name', 'company', 'status', 'email']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

