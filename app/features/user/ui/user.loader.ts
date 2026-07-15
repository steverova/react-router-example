import { listUsers, findUser } from "../user.service"

export async function userLoader({ params }: { params: { id?: string } }) {
  // Si hay un ID en los parámetros, cargar solo ese usuario
  if (params.id) {
    const user = await findUser(Number(params.id))
    return { users: user ? [user] : [], user }
  }
  
  // otherwise, load all users
  const users = await listUsers()
  return { users, user: null }
}