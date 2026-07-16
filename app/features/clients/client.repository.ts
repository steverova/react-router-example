import type { AppDb } from "~/db"
import { clients } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export async function getAllClients(db: AppDb) {
  return db.select().from(clients)
}

export async function getClientById(db: AppDb, id: number) {
  const result = await db.select().from(clients).where(eq(clients.id, id))
  return result[0] ?? null
}

export async function createClientInDb(db: AppDb, data: {
  entityType: "legal_entity" | "person"
  legalName: string
  tradeName?: string
  taxId?: string
  country?: string
  address?: string
  postalCode?: string
  email: string
  phone?: string
  notes?: string
  status?: "active" | "inactive"
}) {
  return db.insert(clients).values(data)
}

export async function updateClientInDb(
  db: AppDb,
  id: number,
  data: {
    entityType: "legal_entity" | "person"
    legalName: string
    tradeName?: string
    taxId?: string
    country?: string
    address?: string
    postalCode?: string
    email: string
    phone?: string
    notes?: string
    status?: "active" | "inactive"
  }
) {
  return db.update(clients).set(data).where(eq(clients.id, id))
}

export async function deleteClientInDb(db: AppDb, id: number) {
  return db.delete(clients).where(eq(clients.id, id))
}
