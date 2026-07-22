import { sql } from 'drizzle-orm';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result: Record<string, any> = {
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV,
    region:      process.env.VERCEL_REGION || process.env.VERCEL_REGION || 'unknown',
  };

  // 1. Env variable check
  const dbUrl = process.env.DATABASE_URL || '';
  result.env = {
    DATABASE_URL:    !!dbUrl,
    PASSWORD_SALT:   !!process.env.PASSWORD_SALT,
    SESSION_SECRET:  !!process.env.SESSION_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '(not set)',
    // Masked host — no password exposed
    DATABASE_HOST: dbUrl
      ? dbUrl.replace(/:[^:@]+@/, ':***@')
      : null,
    SALT_SOURCE:   process.env.PASSWORD_SALT   ? 'env var ✅' : 'hardcoded fallback ⚠️',
    SECRET_SOURCE: process.env.SESSION_SECRET  ? 'env var ✅' : 'hardcoded fallback ⚠️',
  };

  // 2. Raw pg connection test — bypasses drizzle proxy to get real error
  if (dbUrl) {
    try {
      const isExternal = !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1');
      const pool = new Pool({
        connectionString: dbUrl,
        ssl: isExternal ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 8000,
      });
      const res = await pool.query('SELECT 1 AS ping, current_database() AS db, version() AS ver');
      await pool.end();
      result.database = {
        connected:  true,
        db:         res.rows[0].db,
        ping:       res.rows[0].ping,
        ssl:        isExternal ? 'enabled (rejectUnauthorized:false)' : 'disabled (localhost)',
        pgVersion:  res.rows[0].ver?.split(' ').slice(0,2).join(' '),
      };
    } catch (err: any) {
      result.database = {
        connected:    false,
        errorCode:    err.code,
        errorMessage: err.message,
        errorDetail:  err.detail || null,
        hint:         err.hint || null,
      };
    }
  } else {
    result.database = { connected: false, errorMessage: 'DATABASE_URL not set' };
  }

  // 3. Table check (only if connected)
  if (result.database?.connected) {
    try {
      const pool2 = new Pool({
        connectionString: dbUrl,
        ssl: !dbUrl.includes('localhost') ? { rejectUnauthorized: false } : false,
      });
      const tables = await pool2.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      await pool2.end();
      const found = tables.rows.map((r: any) => r.table_name);
      const required = ['users','trades','chat_sessions','chat_messages',
                        'alerts','portfolios','system_logs','support_tickets',
                        'feature_flags','app_versions','announcements',
                        'feedback_items','ai_memory'];
      const missing = required.filter(t => !found.includes(t));
      result.tables = { found, count: found.length, missing, allPresent: missing.length === 0 };
    } catch (err: any) {
      result.tables = { error: err.message };
    }

    // 4. User count
    try {
      const pool3 = new Pool({
        connectionString: dbUrl,
        ssl: !dbUrl.includes('localhost') ? { rejectUnauthorized: false } : false,
      });
      const countRes = await pool3.query('SELECT COUNT(*) AS total FROM users');
      await pool3.end();
      result.users = { total: parseInt(countRes.rows[0].total, 10) };
    } catch (err: any) {
      result.users = { error: err.message };
    }
  }

  // 5. Auth config
  result.authConfig = {
    saltIsDefault:   !process.env.PASSWORD_SALT,
    secretIsDefault: !process.env.SESSION_SECRET,
    cookieName:      'apex_session_token',
    cookieSecure:    process.env.NODE_ENV === 'production',
    warning: (!process.env.PASSWORD_SALT || !process.env.SESSION_SECRET)
      ? '⚠️ Add PASSWORD_SALT and SESSION_SECRET to Vercel env vars.'
      : '✅ All secrets from environment.',
  };

  result.status = (result.database?.connected && result.tables?.allPresent)
    ? '✅ All systems operational'
    : '❌ Issues detected — see details above';

  return Response.json(result, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}
