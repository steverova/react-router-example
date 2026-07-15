import { listClients } from "~/features/clients"

export async function loader() {
  const clients = await listClients()
  return Response.json(clients)
}
