import { z } from "zod"

export const createClientSchema = z.object({
  entityType: z.enum(["legal_entity", "person"]).default("legal_entity"),
  legalName: z.string().min(1, "Legal name is required").max(255),
  tradeName: z.string().max(255).optional().or(z.literal("")),
  taxId: z.string().max(50).optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  address: z.string().max(500).optional().or(z.literal("")),
  postalCode: z.string().min(1, "Postal code is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
