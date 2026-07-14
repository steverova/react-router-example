import { listClients, findClient } from "../client.service"

export async function clientLoader({ params }: { params: { id?: string } }) {
  if (params.id) {
    const client = findClient(Number(params.id))
    return { clients: client ? [client] : [], client }
  }

  const clients = listClients()
  return { clients, client: null }
}
