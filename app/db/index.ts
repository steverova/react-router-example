import { createDb } from './client'

export type AppDb = ReturnType<typeof createDb>

export function getDb(d1: D1Database): AppDb {
  return createDb(d1)
}
