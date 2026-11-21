import { z } from 'zod';

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Social Media',
  'Advertisement',
  'Other'
];

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Lost'
];

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address (e.g. name@company.com)'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[0-9+\-()\s.]+$/, 'Phone number can only contain digits, spaces, and + - ( ) .'),
  company: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(100, 'Company name cannot exceed 100 characters'),
  source: z.enum(LEAD_SOURCES, {
    errorMap: () => ({ message: 'Please select a valid lead source' })
  }),
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({ message: 'Please select a valid status' })
  })
});

export const validateLeadForm = (data) => {
  const result = leadFormSchema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors = {};
  result.error.errors.forEach((err) => {
    const field = err.path[0];
    if (!errors[field]) {
      errors[field] = err.message;
    }
  });

  return { isValid: false, errors };
};

