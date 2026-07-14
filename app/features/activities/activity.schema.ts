import { z } from "zod"

export const createActivitySchema = z.object({
  projectId: z.coerce.number().min(1, "Project is required"),
  parentActivityId: z.coerce.number().optional().nullable(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["pending", "in_progress", "blocked", "completed", "cancelled"]),
  estimatedHours: z.coerce.number().positive().optional().nullable(),
  startDate: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
})

export type CreateActivityInput = z.infer<typeof createActivitySchema>
