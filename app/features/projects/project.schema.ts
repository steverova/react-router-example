import { z } from "zod"

export const createProjectSchema = z.object({
  clientEntityId: z.coerce.number().min(1, "Client is required"),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional().or(z.literal("")),
  projectManagerId: z.coerce.number().optional().nullable(),
  ownerId: z.coerce.number().optional().nullable(),
  status: z.enum(["draft", "active", "on_hold", "completed", "cancelled", "archived"]).default("draft"),
  startDate: z.string().optional().or(z.literal("")),
  targetEndDate: z.string().optional().or(z.literal("")),
  hoursBudget: z.coerce.number().positive().optional().nullable(),
  documentationUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  repositoryUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  contractReference: z.string().max(100).optional().or(z.literal("")),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
