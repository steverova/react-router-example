import { db } from "~/db"
import { projects } from "~/db/schema/sqlite"
import { count } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

const sqlite = db as unknown as BetterSQLite3Database<Record<string, never>>

function padNumber(num: number, size: number = 4): string {
  return num.toString().padStart(size, "0")
}

export function generateProjectCode(): string {
  const result = sqlite.select({ value: count() }).from(projects).get()
  const nextNumber = (result?.value ?? 0) + 1
  return `PRJ-${padNumber(nextNumber)}`
}
