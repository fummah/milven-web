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

export const DELIVERY_MODES = [
  "In-house",
  "Open programme",
  "Online",
  "Blended",
  "Board session"
]

export const SENIORITY_LEVELS = [
  "Board",
  "Executive / C-suite",
  "Senior management",
  "Management",
  "Finance team",
  "Mixed"
]

export const trainingSchema = z.object({
  programme: z.string().max(160).optional().or(z.literal("")),
  organisation: z.string().min(2, "Please enter your organisation").max(160),
  contactName: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email address"),
  telephone: z.string().max(40).optional().or(z.literal("")),
  delegateCount: z.string().max(40).optional().or(z.literal("")),
  seniority: z.string().max(60).optional().or(z.literal("")),
  preferredDates: z.string().max(120).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  deliveryMode: z.string().max(60).optional().or(z.literal("")),
  objectives: z.string().min(10, "Please describe your learning objectives").max(4000),
  honeypot: z.string().optional()
})

export type TrainingInput = z.infer<typeof trainingSchema>
