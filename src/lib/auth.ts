import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Hash passwords using Node's standard crypto PBKDF2
export function hashPassword(password: string): string {
  const salt = 'bull_run_apex_ai_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export interface UserSession {
  id: number;
  name: string | null;
  email: string;
  role: string;
  subscriptionStatus: string;
  subscriptionTier: string;
  balance: string;
  twoFaEnabled: boolean;
  affiliateCode: string | null;
  referredBy: string | null;
}

// Get current user from HTTP-only cookie
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('apex_session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Split token to extract ID and simple signature
    const [userIdStr, signature] = sessionToken.split('.');
    if (!userIdStr || !signature) return null;

    // Verify simple signature
    const expectedSig = crypto.createHmac('sha256', 'apex_jwt_secret_key_2026')
      .update(userIdStr)
      .digest('hex');

    if (signature !== expectedSig) {
      return null;
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) return null;

    const results = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (results.length === 0) return null;

    const u = results[0];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      subscriptionStatus: u.subscriptionStatus,
      subscriptionTier: u.subscriptionTier,
      balance: u.balance,
      twoFaEnabled: u.twoFaEnabled,
      affiliateCode: u.affiliateCode,
      referredBy: u.referredBy,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

// Helper to set session cookie
export async function setSessionCookie(userId: number) {
  const userIdStr = userId.toString();
  const signature = crypto.createHmac('sha256', 'apex_jwt_secret_key_2026')
    .update(userIdStr)
    .digest('hex');

  const sessionToken = `${userIdStr}.${signature}`;
  const cookieStore = await cookies();

  cookieStore.set('apex_session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

// Helper to clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('apex_session_token');
}
