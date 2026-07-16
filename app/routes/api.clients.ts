import { listClients } from "~/features/clients"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function loader() {
  const db = getDb(env.DB)
  const clients = await listClients(db)
  return Response.json(clients)
}
