import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema/sqlite/index.ts",
  out: "./drizzle/sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url: "./local.db",
  },
});
