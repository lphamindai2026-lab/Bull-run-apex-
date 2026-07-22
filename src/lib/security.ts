import crypto from 'crypto';
import { cookies } from 'next/headers';

// Sliding Window Rate Limiter in-memory cache
interface RateLimitBucket {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitBucket>();

/**
 * Asserts rate limit policy. Returns true if request is allowed, false if limited.
 * Default: Maximum 100 requests per 60 seconds
 */
export function assertRateLimit(key: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { timestamps: [now] });
    return true;
  }

  const bucket = rateLimitMap.get(key)!;
  // Filter out timestamps outside the sliding window
  bucket.timestamps = bucket.timestamps.filter(ts => now - ts < windowMs);

  if (bucket.timestamps.length >= limit) {
    return false;
  }

  bucket.timestamps.push(now);
  return true;
}

/**
 * XSS Sanitizer: Escape dangerous HTML tags and event listeners from user-supplied text
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // Remove script tags
    .replace(/on\w+\s*=/gi, '') // Remove onmouseover, onload, etc.
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '') // Remove iframes
    .replace(/javascript:/gi, '') // Remove js links
    .replace(/<\/?[^>]+(>|$)/g, ''); // Strip standard HTML tags
}

/**
 * Cryptographic CSRF Token Generator
 */
export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set('apex_csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/',
  });
  return token;
}

/**
 * Cryptographic CSRF Token Verifier
 */
export async function verifyCsrfToken(submittedToken: string | null): Promise<boolean> {
  if (!submittedToken) return false;
  const cookieStore = await cookies();
  const savedToken = cookieStore.get('apex_csrf_token')?.value;
  return savedToken === submittedToken;
}

/**
 * Anti-SQL Injection validation shield: Ensure strings do not contain explicit raw SQL commands.
 * This works hand-in-hand with Drizzle ORM's native parameterized prepared statements.
 */
export function checkSqlInjection(input: string): boolean {
  if (!input) return false;
  const sqlKeywords = [
    /union\s+select/i,
    /insert\s+into/i,
    /drop\s+table/i,
    /select\s+\*\s+from/i,
    /or\s+['"]1['"]\s*=\s*['"]1/i,
    /exec\s*\(/i,
    /sysdatabases/i,
    /sysobjects/i
  ];

  return sqlKeywords.some(pattern => pattern.test(input));
}
