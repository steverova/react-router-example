import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema/mysql/**",
  out: "./drizzle/mysql",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
});
