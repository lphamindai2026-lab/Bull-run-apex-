import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH LIBRARY — RUNTIME ONLY
//
// All functions in this file only execute at REQUEST time, never at build time.
// The `db` import is safe because db/index.ts now uses lazy initialization.
// ─────────────────────────────────────────────────────────────────────────────

const HMAC_SECRET = process.env.SESSION_SECRET || 'apex_jwt_secret_key_2026';
const SALT        = process.env.PASSWORD_SALT  || 'bull_run_apex_ai_salt_2026';
const COOKIE_NAME = 'apex_session_token';

/** Hash a password with PBKDF2 + salt */
export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, SALT, 1000, 64, 'sha512')
    .toString('hex');
}

export interface UserSession {
  id:                 number;
  name:               string | null;
  email:              string;
  role:               string;
  subscriptionStatus: string;
  subscriptionTier:   string;
  balance:            string;
  twoFaEnabled:       boolean;
  affiliateCode:      string | null;
  referredBy:         string | null;
  createdAt?:         Date;
}

/**
 * Get the currently authenticated user from the HTTP-only session cookie.
 * Returns null if:
 *   - No cookie is present (not logged in)
 *   - Cookie signature is invalid (tampered)
 *   - User no longer exists in DB
 *   - DATABASE_URL is not set (build time or misconfigured environment)
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionToken) return null;

    const [userIdStr, signature] = sessionToken.split('.');
    if (!userIdStr || !signature) return null;

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(userIdStr)
      .digest('hex');

    if (signature !== expectedSig) return null;

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) return null;

    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (results.length === 0) return null;

    const u = results[0];
    return {
      id:                 u.id,
      name:               u.name,
      email:              u.email,
      role:               u.role,
      subscriptionStatus: u.subscriptionStatus,
      subscriptionTier:   u.subscriptionTier,
      balance:            u.balance,
      twoFaEnabled:       u.twoFaEnabled,
      affiliateCode:      u.affiliateCode,
      referredBy:         u.referredBy,
      createdAt:          u.createdAt,
    };
  } catch (error: any) {
    // Gracefully return null on any error:
    //   - DB not connected yet
    //   - Cookie API unavailable (should not happen at runtime)
    //   - Any network/query error
    // This prevents auth errors from crashing pages — they just show as "not logged in"
    if (process.env.NODE_ENV === 'development') {
      console.error('[auth] getCurrentUser error:', error.message);
    }
    return null;
  }
}

/** Set the session cookie after successful login */
export async function setSessionCookie(userId: number): Promise<void> {
  const userIdStr  = userId.toString();
  const signature  = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(userIdStr)
    .digest('hex');

  const sessionToken = `${userIdStr}.${signature}`;
  const cookieStore  = await cookies();

  cookieStore.set(COOKIE_NAME, sessionToken, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  'lax',
    maxAge:    60 * 60 * 24 * 7, // 7 days
    path:      '/',
  });
}

/** Clear the session cookie on logout */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
