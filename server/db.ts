import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("📝 Please create a .env file by copying .env.example:");
  console.error("   cp .env.example .env    (Linux/Mac)");
  console.error("   copy .env.example .env  (Windows)");
  console.error("🔧 Or run: npm run setup");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle> | ReturnType<typeof drizzleNeon>;
let pool: any;

if (databaseUrl.startsWith('sqlite:')) {
  // SQLite configuration for local development
  const dbPath = databaseUrl.replace('sqlite:', '');
  const sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });
  pool = db; // For backward compatibility
} else {
  // PostgreSQL configuration for production (Neon)
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzleNeon({ client: pool, schema });
}

export { db, pool };
