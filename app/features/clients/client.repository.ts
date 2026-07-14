import { db } from "~/db"
import { clients } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

const sqlite = db as unknown as BetterSQLite3Database<Record<string, never>>

export function getAllClients() {
  return sqlite.select().from(clients).all()
}

export function getClientById(id: number) {
  return sqlite.select().from(clients).where(eq(clients.id, id)).get()
}

export function createClientInDb(data: {
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
  return sqlite.insert(clients).values(data).run()
}

export function updateClientInDb(
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
  return sqlite.update(clients).set(data).where(eq(clients.id, id)).run()
}

export function deleteClientInDb(id: number) {
  return sqlite.delete(clients).where(eq(clients.id, id)).run()
}
