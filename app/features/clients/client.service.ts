import type { AppDb } from "~/db"
import {
  getAllClients,
  getClientById,
  createClientInDb,
  updateClientInDb,
  deleteClientInDb,
} from "./client.repository"

export async function listClients(db: AppDb) {
  return getAllClients(db)
}

export async function findClient(db: AppDb, id: number) {
  return getClientById(db, id)
}

export async function registerClient(db: AppDb, data: {
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
  return createClientInDb(db, data)
}

export async function updateClient(
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
  return updateClientInDb(db, id, data)
}

export async function removeClient(db: AppDb, id: number) {
  return deleteClientInDb(db, id)
}
