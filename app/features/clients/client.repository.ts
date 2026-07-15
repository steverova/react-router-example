import { db } from "~/db"
import { clients } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export async function getAllClients() {
  return db.select().from(clients)
}

export async function getClientById(id: number) {
  const result = await db.select().from(clients).where(eq(clients.id, id))
  return result[0] ?? null
}

export async function createClientInDb(data: {
  entityType: string
  legalName: string
  tradeName?: string
  taxId?: string
  country?: string
  address?: string
  postalCode?: string
  email: string
  phone?: string
  notes?: string
  status?: string
}) {
  return db.insert(clients).values(data)
}

export async function updateClientInDb(
  id: number,
  data: {
    entityType: string
    legalName: string
    tradeName?: string
    taxId?: string
    country?: string
    address?: string
    postalCode?: string
    email: string
    phone?: string
    notes?: string
    status?: string
  }
) {
  return db.update(clients).set(data).where(eq(clients.id, id))
}

export async function deleteClientInDb(id: number) {
  return db.delete(clients).where(eq(clients.id, id))
}
