import { listClients } from "~/features/clients"

export async function loader() {
  const clients = listClients()
  return Response.json(clients)
}
