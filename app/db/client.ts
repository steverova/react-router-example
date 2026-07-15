import { env } from '~/config/env';

type BetterSqlite3Constructor = typeof import('better-sqlite3');

let dbInstance: any = null;

export async function createDb() {
  if (dbInstance) return dbInstance;

  if (env.DB_DRIVER === 'turso') {
    const { createClient } = await import('@libsql/client');
    const { drizzle } = await import('drizzle-orm/libsql');
    const schema = await import('./schema/sqlite');

    const client = createClient({
      url: env.TURSO_DATABASE_URL!,
      authToken: env.TURSO_AUTH_TOKEN,
      syncUrl: env.TURSO_DATABASE_URL,
      syncInterval: 60,
    });

    dbInstance = drizzle(client, { schema });
    return dbInstance;
  }

  if (env.DB_DRIVER === 'sqlite') {
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const { default: Database } = (await import('better-sqlite3')) as { default: BetterSqlite3Constructor };
    const schema = await import('./schema/sqlite');

    const sqlite = new Database(env.SQLITE_PATH);
    dbInstance = drizzle(sqlite, { schema });
    return dbInstance;
  }

  const { drizzle } = await import('drizzle-orm/mysql2');
  const mysql = await import('mysql2/promise');
  const schema = await import('./schema/mysql');

  const pool = mysql.createPool({
    host: env.DB_HOST!,
    user: env.DB_USER!,
    password: env.DB_PASSWORD!,
    database: env.DB_NAME!,
    connectionLimit: 5,
  });

  dbInstance = drizzle(pool, { schema, mode: 'default' });
  return dbInstance;
}
