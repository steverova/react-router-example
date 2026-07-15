import { getAllUsers, getUserById, createUser, deleteUser, updateUser as updateUserInDb } from "./user.repository"

export async function listUsers() {
  return getAllUsers()
}

export async function findUser(id: number) {
  return getUserById(id)
}

export async function registerUser(name: string, email: string) {
  return createUser(name, email)
}

export async function removeUser(id: number) {
  return deleteUser(id)
}

export async function updateUser(id: number, name: string, email: string) {
  return updateUserInDb(id, name, email)
}
