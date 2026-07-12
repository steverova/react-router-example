import { listUsers } from "../user.service"

export function userLoader() {
  const users = listUsers()
  return { users }
}