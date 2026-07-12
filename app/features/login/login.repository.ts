import { db } from "~/db"
import { users } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email)).get()
}
