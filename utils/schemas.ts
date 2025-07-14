import { z } from 'zod';

export const eventRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  pairingChoice: z.enum(['wine', 'juice'], {
    required_error: "Please select a pairing choice"
  }),
  hasAllergies: z.enum(['yes', 'no'], {
    required_error: "Please specify if you have allergies"
  }),
  allergies: z.string().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine((data) => {
  if (data.hasAllergies === 'yes' && (!data.allergies || data.allergies.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Please specify your allergies or dietary restrictions",
  path: ['allergies']
});

export type EventRegistrationForm = z.infer<typeof eventRegistrationSchema>;