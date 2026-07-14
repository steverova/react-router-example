import {
  getAllClients,
  getClientById,
  createClientInDb,
  updateClientInDb,
  deleteClientInDb,
} from "./client.repository"

export function listClients() {
  return getAllClients()
}

export function findClient(id: number) {
  return getClientById(id)
}

export function registerClient(data: {
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
}) {
  return createClientInDb(data)
}

export function updateClient(
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
  }
) {
  return updateClientInDb(id, data)
}

export function removeClient(id: number) {
  return deleteClientInDb(id)
}
