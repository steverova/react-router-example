import { listClients, findClient } from "../client.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function clientLoader({ params }: { params: { id?: string } }) {
  const db = getDb(env.DB)

  if (params.id) {
    const client = await findClient(db, Number(params.id))
    return { clients: client ? [client] : [], client }
  }

  const clients = await listClients(db)
  return { clients, client: null }
}
