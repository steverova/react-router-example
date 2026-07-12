import { db } from "~/db"
import { users } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export function getAllUsers() {
  return db.select().from(users).all()
}

export function getUserById(id: number) {
  return db.select().from(users).where(eq(users.id, id)).get()
}

export function createUser(name: string, email: string) {
  return db.insert(users).values({ name, email }).run()
}

export function deleteUser(id: number) {
  return db.delete(users).where(eq(users.id, id)).run()
}
