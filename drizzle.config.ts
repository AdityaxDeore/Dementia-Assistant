import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: databaseUrl.startsWith('sqlite:') ? "sqlite" : "postgresql",
  dbCredentials: databaseUrl.startsWith('sqlite:') 
    ? { url: databaseUrl.replace('sqlite:', '') }
    : { url: databaseUrl },
});
