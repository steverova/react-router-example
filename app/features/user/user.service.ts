import type { AppDb } from "~/db"
import { getAllUsers, getUserById, createUser, deleteUser, updateUser as updateUserInDb } from "./user.repository"

export async function listUsers(db: AppDb) {
  return getAllUsers(db)
}

export async function findUser(db: AppDb, id: number) {
  return getUserById(db, id)
}

export async function registerUser(db: AppDb, name: string, email: string) {
  return createUser(db, name, email)
}

export async function removeUser(db: AppDb, id: number) {
  return deleteUser(db, id)
}

export async function updateUser(db: AppDb, id: number, name: string, email: string) {
  return updateUserInDb(db, id, name, email)
}
