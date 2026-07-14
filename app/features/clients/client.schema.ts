import { z } from "zod"

export const createClientSchema = z.object({
  entityType: z.enum(["legal_entity", "person"]).default("legal_entity"),
  legalName: z.string().min(1, "Legal name is required").max(255),
  tradeName: z.string().max(255).optional().or(z.literal("")),
  taxId: z.string().max(50).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  stateProvince: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional().or(z.literal("")),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
