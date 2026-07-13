import { getAllUsers, getUserById, createUser, deleteUser, updateUser as updateUserInDb } from "./user.repository"

export function listUsers() {
  return getAllUsers()
}

export function findUser(id: number) {
  return getUserById(id)
}

export function registerUser(name: string, email: string) {
  return createUser(name, email)
}

export function removeUser(id: number) {
  return deleteUser(id)
}

export function updateUser(id: number, name: string, email: string) {
  return updateUserInDb(id, name, email)
}
