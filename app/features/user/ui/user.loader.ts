import { listUsers, findUser } from "../user.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function userLoader({ params }: { params: { id?: string } }) {
  const db = getDb(env.DB)

  if (params.id) {
    const user = await findUser(db, Number(params.id))
    return { users: user ? [user] : [], user }
  }

  const users = await listUsers(db)
  return { users, user: null }
}
