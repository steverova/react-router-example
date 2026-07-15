import { db } from "~/db"
import { projects } from "~/db/schema/sqlite"
import { count } from "drizzle-orm"

function padNumber(num: number, size: number = 4): string {
  return num.toString().padStart(size, "0")
}

export async function generateProjectCode(): Promise<string> {
  const result = await db.select({ value: count() }).from(projects)
  const nextNumber = (result[0]?.value ?? 0) + 1
  return `PRJ-${padNumber(nextNumber)}`
}
