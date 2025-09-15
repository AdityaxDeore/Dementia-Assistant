import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

// Check if we're using SQLite (for local development)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let db: ReturnType<typeof drizzle>;

if (databaseUrl.startsWith('sqlite:')) {
  // SQLite configuration for local development
  const dbPath = databaseUrl.replace('sqlite:', '');
  const sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });
} else {
  // PostgreSQL configuration for production (Neon)
  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const { drizzle: drizzleNeon } = await import('drizzle-orm/neon-serverless');
  const ws = await import("ws");

  neonConfig.webSocketConstructor = ws.default;
  const pool = new Pool({ connectionString: databaseUrl });
  db = drizzleNeon({ client: pool, schema });
}

export { db };
export const pool = db; // For backward compatibility