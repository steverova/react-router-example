import { db } from "~/db"
import { users } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

const sqlite = db as unknown as BetterSQLite3Database<Record<string, never>>

export function getAllUsers() {
  return sqlite.select().from(users).all()
}

export function getUserById(id: number) {
  return sqlite.select().from(users).where(eq(users.id, id)).get()
}

export function createUser(name: string, email: string) {
  return sqlite.insert(users).values({ name, email }).run()
}

export function deleteUser(id: number) {
  return sqlite.delete(users).where(eq(users.id, id)).run()
}

export function updateUser(id: number, name: string, email: string) {
  return sqlite.update(users).set({ name, email }).where(eq(users.id, id)).run()
}
