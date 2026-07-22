import { db } from '@/db';
import { users, systemLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { setSessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mockEmail = `google_oauth_${Math.floor(Math.random() * 90000) + 10000}@gmail.com`;
    const mockName = 'Google Scholar Trader';

    // Check if user already exists
    let userRecord;
    const existing = await db.select().from(users).where(eq(users.email, mockEmail)).limit(1);

    if (existing.length > 0) {
      userRecord = existing[0];
    } else {
      const generatedAffCode = 'APEX-GOOG-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const [newUser] = await db.insert(users).values({
        name: mockName,
        email: mockEmail,
        passwordHash: 'MOCK_OAUTH_OAUTH_TOKEN_HASH_2026',
        affiliateCode: generatedAffCode,
        balance: '100000.00',
        subscriptionTier: 'pro' // Reward with pro tier for OAuth users
      }).returning();
      userRecord = newUser;

      // Log action to audit logs
      await db.insert(systemLogs).values({
        userId: newUser.id,
        action: 'OAUTH_REGISTER',
        details: 'User registered via Google OAuth simulation',
        ipAddress: '127.0.0.1'
      });
    }

    // Set secure session cookie
    await setSessionCookie(userRecord.id);

    // Redirect to terminal
    redirect('/terminal');

  } catch (error: any) {
    if (error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error; // Standard Next.js redirect mechanism
    }
    console.error('Google OAuth simulation error:', error);
    return Response.json({ error: 'OAuth redirect failure.' }, { status: 500 });
  }
}
