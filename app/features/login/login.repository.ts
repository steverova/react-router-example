import { db } from "~/db"
import { users, credentials } from "~/db/schema/sqlite"
import { eq, and } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

const sqlite = db as unknown as BetterSQLite3Database<Record<string, never>>

export function getUserByEmail(email: string) {
  return sqlite.select().from(users).where(eq(users.email, email)).get()
}

export function getCredentialByUserId(userId: number) {
  return sqlite
    .select()
    .from(credentials)
    .where(and(eq(credentials.userId, userId), eq(credentials.provider, "password")))
    .get()
}
