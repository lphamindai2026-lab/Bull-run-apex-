import { db }   from '@/db';
import { sql }  from 'drizzle-orm';
import { users } from '@/db/schema';

export const dynamic = 'force-dynamic';

// Safe diagnostic endpoint — shows config status without exposing secrets
export async function GET() {
  const result: Record<string, any> = {
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV,
    region:      process.env.VERCEL_REGION || 'local',
  };

  // 1. Environment variable presence check (never expose actual values)
  result.env = {
    DATABASE_URL:    !!process.env.DATABASE_URL,
    PASSWORD_SALT:   !!process.env.PASSWORD_SALT,
    SESSION_SECRET:  !!process.env.SESSION_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '(not set)',
    // Show partial DATABASE_URL host for debugging (not password)
    DATABASE_HOST: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace(/:[^@]+@/, ':***@').split('/').slice(0, 3).join('/')
      : null,
    // Show which salt fallback is active
    SALT_SOURCE: process.env.PASSWORD_SALT ? 'env var ✅' : 'hardcoded fallback ⚠️',
    SECRET_SOURCE: process.env.SESSION_SECRET ? 'env var ✅' : 'hardcoded fallback ⚠️',
  };

  // 2. Database connectivity test
  try {
    await db.execute(sql`SELECT 1 AS ping`);
    result.database = { connected: true, ssl: 'enabled (rejectUnauthorized: false)' };
  } catch (err: any) {
    result.database = { connected: false, error: err.message };
  }

  // 3. Table existence check
  if (result.database.connected) {
    try {
      const tables = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      result.tables = {
        found: (tables.rows as any[]).map((r: any) => r.table_name),
        count: tables.rows.length,
      };

      // Spot-check required tables
      const required = ['users', 'trades', 'chat_sessions', 'chat_messages',
                        'alerts', 'portfolios', 'system_logs', 'support_tickets'];
      const existing = new Set(result.tables.found);
      result.tables.missing = required.filter(t => !existing.has(t));
      result.tables.allPresent = result.tables.missing.length === 0;
    } catch (err: any) {
      result.tables = { error: err.message };
    }
  }

  // 4. User count (to verify registration is working)
  if (result.database?.connected) {
    try {
      const count = await db.execute(sql`SELECT COUNT(*) AS total FROM users`);
      result.users = { total: (count.rows[0] as any).total };
    } catch (err: any) {
      result.users = { error: err.message };
    }
  }

  // 5. Auth config consistency check
  result.authConfig = {
    saltIsDefault:   !process.env.PASSWORD_SALT,
    secretIsDefault: !process.env.SESSION_SECRET,
    cookieName:      'apex_session_token',
    cookieSecure:    process.env.NODE_ENV === 'production',
    warning: (!process.env.PASSWORD_SALT || !process.env.SESSION_SECRET)
      ? '⚠️ Using hardcoded fallback secrets. Add PASSWORD_SALT and SESSION_SECRET to Vercel env vars.'
      : '✅ All secrets loaded from environment variables.',
  };

  // Overall status
  result.status = result.database?.connected && result.tables?.allPresent
    ? '✅ All systems operational'
    : '❌ Issues detected — see details above';

  return Response.json(result, {
    status: 200,
    headers: { 'Cache-Control': 'no-store, no-cache' },
  });
}
