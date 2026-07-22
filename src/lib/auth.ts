import { cookies } from 'next/headers';
import { db }      from '@/db';
import { users }   from '@/db/schema';
import { eq }      from 'drizzle-orm';
import crypto      from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL: These values MUST match between Vercel env vars and local .env
//
// If PASSWORD_SALT changes after users have registered, their stored password
// hashes will not match and login will fail for ALL existing users.
//
// SESSION_SECRET must also be consistent — changing it invalidates all cookies.
//
// Production values (set identically in Vercel → Settings → Env Vars):
//   PASSWORD_SALT  = himanshu510@
//   SESSION_SECRET = hQ8xL2mP9vR4zN7aK1sW5eF8tY3uJ6cD0qB2gH9mX4pL7nV1rT5yU8iO3
// ─────────────────────────────────────────────────────────────────────────────

// Read from environment — MUST be set in Vercel for production
const PASSWORD_SALT  = process.env.PASSWORD_SALT  || 'himanshu510@';
const SESSION_SECRET = process.env.SESSION_SECRET || 'hQ8xL2mP9vR4zN7aK1sW5eF8tY3uJ6cD0qB2gH9mX4pL7nV1rT5yU8iO3';
const COOKIE_NAME    = 'apex_session_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Hash a password using PBKDF2-SHA512.
 * Uses PASSWORD_SALT from environment — must be identical in Vercel env vars.
 */
export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, PASSWORD_SALT, 1000, 64, 'sha512')
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
 * Read the session cookie, verify the HMAC signature, and return the user.
 * Returns null on any error — never throws.
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore    = await cookies();
    const sessionToken   = cookieStore.get(COOKIE_NAME)?.value;
    if (!sessionToken) return null;

    const dotIdx = sessionToken.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const userIdStr  = sessionToken.slice(0, dotIdx);
    const signature  = sessionToken.slice(dotIdx + 1);

    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(userIdStr)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSig, 'hex'))) {
      return null;
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId) || userId <= 0) return null;

    const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (rows.length === 0) return null;

    const u = rows[0];
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
  } catch {
    return null;
  }
}

/** Create a signed session cookie for the given user ID */
export async function setSessionCookie(userId: number): Promise<void> {
  const userIdStr = String(userId);
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(userIdStr)
    .digest('hex');

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${userIdStr}.${signature}`, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  'lax',
    maxAge:    COOKIE_MAX_AGE,
    path:      '/',
  });
}

/** Delete the session cookie on logout */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
