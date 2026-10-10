import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  organisation: z.string().max(160).optional().or(z.literal("")),
  role: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  telephone: z.string().max(40).optional().or(z.literal("")),
  service: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10, "Please describe your requirement").max(4000),
  preferredMethod: z.string().max(40).optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
  honeypot: z.string().optional()
})

export type ContactInput = z.infer<typeof contactSchema>

export const SERVICE_TYPES = [
  "Strategy & Financial Advisory",
  "Business Systems & Transformation",
  "Executive Finance Academy",
  "General Enquiry"
]

export const CONTACT_METHODS = ["Email", "Telephone", "WhatsApp", "Microsoft Teams"]
