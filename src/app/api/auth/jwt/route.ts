import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { assertRateLimit, sanitizeInput } from '@/lib/security';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Protection (Max 15 JWT tokens requests per minute per IP)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!assertRateLimit(`jwt-${ip}`, 15, 60000)) {
      return Response.json({ error: 'Too many authentication attempts. Rate limit exceeded.' }, { status: 429 });
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const results = await db.select().from(users).where(eq(users.email, sanitizedEmail)).limit(1);

    if (results.length === 0) {
      return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const user = results[0];
    const passwordHash = hashPassword(password);

    if (user.passwordHash !== passwordHash) {
      return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // 2. Build verified token header & payload
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.subscriptionTier,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours expiry
    };

    const secret = 'apex_jwt_secret_key_2026';

    const base64UrlEncode = (obj: object) => {
      const str = JSON.stringify(obj);
      return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const token = `${encodedHeader}.${encodedPayload}.${signature}`;

    return Response.json({
      success: true,
      token,
      expiresIn: 86400,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.subscriptionTier
      }
    });

  } catch (error: any) {
    console.error('JWT Token generation error:', error);
    return Response.json({ error: 'Internal system fault.' }, { status: 500 });
  }
}
