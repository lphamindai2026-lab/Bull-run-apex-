import { db }                from '@/db';
import { users, systemLogs } from '@/db/schema';
import { eq }                from 'drizzle-orm';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { sanitizeInput }     from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, referralCode } = body;

    if (!name || !email || !password) {
      return Response.json({ success: false, error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const cleanEmail = sanitizeInput(email.trim().toLowerCase());

    // Check duplicate
    const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (existing.length > 0) {
      return Response.json({ success: false, error: 'Email is already registered.' }, { status: 409 });
    }

    const passwordHash     = hashPassword(password);
    const affiliateCode    = 'APEX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    let   initialBalance   = '100000.00';
    let   referredBy: string | null = null;

    if (referralCode) {
      const referrer = await db.select().from(users).where(eq(users.affiliateCode, referralCode)).limit(1);
      if (referrer.length > 0) {
        referredBy     = referralCode;
        initialBalance = '105000.00';
      }
    }

    const [newUser] = await db.insert(users).values({
      name:          name.trim(),
      email:         cleanEmail,
      passwordHash,
      affiliateCode,
      referredBy,
      balance:       initialBalance,
    }).returning();

    // Set session cookie
    await setSessionCookie(newUser.id);

    // Audit log
    await db.insert(systemLogs).values({
      userId:    newUser.id,
      action:    'REGISTER',
      details:   `Registered via API. Balance: $${initialBalance}`,
      ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0',
    });

    return Response.json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id:               newUser.id,
        name:             newUser.name,
        email:            newUser.email,
        role:             newUser.role,
        subscriptionTier: newUser.subscriptionTier,
        balance:          newUser.balance,
        affiliateCode:    newUser.affiliateCode,
      },
    }, { status: 201 });

  } catch (err: any) {
    console.error('[/api/auth/register]', err);
    return Response.json({ success: false, error: err.message || 'Registration failed.' }, { status: 500 });
  }
}
