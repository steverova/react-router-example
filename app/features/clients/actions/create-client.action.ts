import { requireAuth } from "~/session.server"
import { createClientSchema } from "../client.schema"
import { registerClient } from "../client.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const db = getDb(env.DB)
  const formData = await request.formData()

  const data = {
    entityType: formData.get("entityType") as string,
    legalName: formData.get("legalName") as string,
    tradeName: (formData.get("tradeName") as string) || undefined,
    taxId: (formData.get("taxId") as string) || undefined,
    country: formData.get("country") as string,
    address: (formData.get("address") as string) || undefined,
    postalCode: formData.get("postalCode") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    status: (formData.get("status") as "active" | "inactive") || "active",
  }

  const result = createClientSchema.safeParse(data)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  await registerClient(db, result.data)
  return { success: true }
}
