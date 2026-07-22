import { drizzle } from "drizzle-orm/node-postgres";
import { Pool }   from "pg";

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE CONNECTION — LAZY + SSL-READY
//
// Key behaviours:
//  1. Lazy initialization — no DB code runs at build time (fixes Next.js build)
//  2. SSL enabled for Supabase — required for all Supabase PostgreSQL connections
//  3. Singleton pool — one pool reused across all requests in a serverless function
//  4. Graceful error — clear message if DATABASE_URL not set in Vercel env vars
// ─────────────────────────────────────────────────────────────────────────────

const globalForDb = globalThis as typeof globalThis & {
  __apexPool?: Pool;
  __apexDb?:   ReturnType<typeof drizzle>;
};

function createPool(): Pool {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL is not set.\n" +
      "→ Vercel: Project Settings → Environment Variables → Add DATABASE_URL\n" +
      "→ Value:  postgresql://postgres:[password]@db.ftebjjgbtwpfwyyelvei.supabase.co:5432/postgres"
    );
  }

  // Detect Supabase / any external PostgreSQL host — always enable SSL
  // ssl.rejectUnauthorized = false is required for Supabase connections
  // from serverless environments (Vercel) which don't have the CA cert bundled
  const isSupabase = url.includes('supabase.co') || url.includes('supabase.com');
  const isExternal = !url.includes('localhost') && !url.includes('127.0.0.1');

  return new Pool({
    connectionString: url,
    ssl: (isSupabase || isExternal)
      ? { rejectUnauthorized: false }
      : false,
    // Serverless-friendly pool settings
    max:              10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

function getPool(): Pool {
  if (!globalForDb.__apexPool) {
    globalForDb.__apexPool = createPool();
  }
  return globalForDb.__apexPool;
}

function getDb(): ReturnType<typeof drizzle> {
  if (!globalForDb.__apexDb) {
    globalForDb.__apexDb = drizzle(getPool());
  }
  return globalForDb.__apexDb;
}

// Proxy: the real pool and db are only instantiated on first actual use
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    return (getPool() as any)[prop];
  },
});
