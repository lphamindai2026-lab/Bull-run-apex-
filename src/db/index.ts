import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE CONNECTION — RUNTIME ONLY
//
// ROOT CAUSE OF BUILD FAILURE:
//   The original file threw `throw new Error("DATABASE_URL is required")`
//   at module evaluation time (top-level). Next.js imports every module
//   during `next build` to collect page config and metadata — even for
//   dynamic pages. This caused the build to fail when DATABASE_URL is
//   not set in the build environment (e.g. Vercel build step).
//
// FIX:
//   Use a lazy getter. The Pool and db client are only created when
//   `db` is first accessed — which happens at request time (API routes,
//   server actions, server components rendering), never during the build.
//
// RESULT:
//   - `next build` succeeds without DATABASE_URL
//   - At runtime (on Vercel, in production), DATABASE_URL must be set
//     in environment variables — otherwise the first DB call throws a
//     clear, descriptive error instead of crashing the build process.
// ─────────────────────────────────────────────────────────────────────────────

const globalForDb = globalThis as typeof globalThis & {
  __apexDbPool?: Pool;
  __apexDb?: ReturnType<typeof drizzle>;
};

function getPool(): Pool {
  if (globalForDb.__apexDbPool) {
    return globalForDb.__apexDbPool;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // This error only fires at RUNTIME when a database query is made.
    // It will NOT fire during `next build`.
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Add it to your Vercel project: Settings → Environment Variables → DATABASE_URL"
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });

  // Cache in global to reuse across hot-reloads in development
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__apexDbPool = pool;
  }

  return pool;
}

function getDb(): ReturnType<typeof drizzle> {
  if (globalForDb.__apexDb) {
    return globalForDb.__apexDb;
  }

  const client = drizzle(getPool());

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__apexDb = client;
  }

  return client;
}

// Export a Proxy so that `db.select()`, `db.insert()`, etc.
// are intercepted and the real client is only created on first use.
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

// Also export pool for direct use if needed
export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    return (getPool() as any)[prop];
  },
});
