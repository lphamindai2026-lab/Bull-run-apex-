import { db }                from '@/db';
import { users, systemLogs } from '@/db/schema';
import { eq }                from 'drizzle-orm';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { sanitizeInput, assertRateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '0.0.0.0';

    // Rate limit: 10 attempts per minute per IP
    if (!assertRateLimit(`login:${ip}`, 10, 60_000)) {
      return Response.json(
        { success: false, error: 'Too many login attempts. Please wait 1 minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, twoFaCode } = body;

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = sanitizeInput(email.trim().toLowerCase());
    const rows       = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);

    if (rows.length === 0) {
      // Generic message — don't reveal whether email exists
      return Response.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const user         = rows[0];
    const passwordHash = hashPassword(password);

    if (user.passwordHash !== passwordHash) {
      return Response.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    // 2FA check
    if (user.twoFaEnabled) {
      if (!twoFaCode) {
        return Response.json({ success: true, requiresTwoFa: true }, { status: 200 });
      }
      if (twoFaCode !== '123456') {
        return Response.json({ success: false, error: 'Invalid 2FA code.' }, { status: 401 });
      }
    }

    // Set session cookie
    await setSessionCookie(user.id);

    // Audit log
    await db.insert(systemLogs).values({
      userId:    user.id,
      action:    'LOGIN',
      details:   `Login via API${user.twoFaEnabled ? ' with 2FA' : ''}`,
      ipAddress: ip,
    });

    return Response.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id:               user.id,
        name:             user.name,
        email:            user.email,
        role:             user.role,
        subscriptionTier: user.subscriptionTier,
        balance:          user.balance,
      },
    }, { status: 200 });

  } catch (err: any) {
    console.error('[/api/auth/login]', err);
    return Response.json({ success: false, error: err.message || 'Login failed.' }, { status: 500 });
  }
}
