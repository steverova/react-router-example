import {
  getAllClients,
  getClientById,
  createClientInDb,
  updateClientInDb,
  deleteClientInDb,
} from "./client.repository"

export async function listClients() {
  return getAllClients()
}

export async function findClient(id: number) {
  return getClientById(id)
}

export async function registerClient(data: {
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
  return createClientInDb(data)
}

export async function updateClient(
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
  return updateClientInDb(id, data)
}

export async function removeClient(id: number) {
  return deleteClientInDb(id)
}
