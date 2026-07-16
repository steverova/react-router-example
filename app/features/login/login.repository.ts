import type { AppDb } from "~/db"
import { users, credentials } from "~/db/schema/sqlite"
import { eq, and } from "drizzle-orm"

export async function getUserByEmail(db: AppDb, email: string) {
  const result = await db.select().from(users).where(eq(users.email, email))
  return result[0] ?? null
}

export async function getCredentialByUserId(db: AppDb, userId: number) {
  const result = await db
    .select()
    .from(credentials)
    .where(and(eq(credentials.userId, userId), eq(credentials.provider, "password")))
  return result[0] ?? null
}
