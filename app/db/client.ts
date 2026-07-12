import { env } from '~/config/env';

type BetterSqlite3Constructor = typeof import('better-sqlite3');

export async function createDb() {
  if (env.DB_DRIVER === 'sqlite') {
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const { default: Database } = (await import('better-sqlite3')) as { default: BetterSqlite3Constructor };
    const schema = await import('./schema/sqlite');

    const sqlite = new Database(env.SQLITE_PATH);
    return drizzle(sqlite, { schema });
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

  return drizzle(pool, { schema, mode: 'default' });
}
