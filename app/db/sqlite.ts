import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema/sqlite'

const sqlite = new Database(process.env.SQLITE_PATH ?? './local.db')

export const sqliteDb = drizzle(sqlite, { schema })
