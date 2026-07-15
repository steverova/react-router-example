import { db } from "~/db"
import { users } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export async function getAllUsers() {
  return db.select().from(users)
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id))
  return result[0] ?? null
}

export async function createUser(name: string, email: string) {
  return db.insert(users).values({ name, email })
}

export async function deleteUser(id: number) {
  return db.delete(users).where(eq(users.id, id))
}

export async function updateUser(id: number, name: string, email: string) {
  return db.update(users).set({ name, email }).where(eq(users.id, id))
}
