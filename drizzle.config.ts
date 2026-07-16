import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./app/db/schema/sqlite/index.ts",
  out: "./drizzle/migrations",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: "6b4b6ee3-2fc1-4a63-be89-75eb58113228",
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});