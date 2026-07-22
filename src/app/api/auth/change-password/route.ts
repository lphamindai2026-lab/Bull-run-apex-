import { db }   from '@/db';
import { users, systemLogs } from '@/db/schema';
import { eq }   from 'drizzle-orm';
import { getCurrentUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { success: false, error: 'You must be logged in to change your password.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate all fields present
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Response.json(
        { success: false, error: 'All three password fields are required.' },
        { status: 400 }
      );
    }

    // New password rules
    if (newPassword.length < 8) {
      return Response.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        { success: false, error: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    if (newPassword === currentPassword) {
      return Response.json(
        { success: false, error: 'New password must be different from your current password.' },
        { status: 400 }
      );
    }

    // Verify current password against stored hash
    const rows = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (rows.length === 0) {
      return Response.json({ success: false, error: 'Account not found.' }, { status: 404 });
    }

    const storedHash = rows[0].passwordHash;
    if (storedHash !== hashPassword(currentPassword)) {
      return Response.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 401 }
      );
    }

    // Hash and save new password
    const newHash = hashPassword(newPassword);
    await db.update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Audit log
    await db.insert(systemLogs).values({
      userId:    user.id,
      action:    'PASSWORD_CHANGE',
      details:   'Password changed successfully via API',
      ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0',
    });

    return Response.json({
      success: true,
      message: 'Password changed successfully. Use your new password next time you log in.',
    });

  } catch (err: any) {
    console.error('[/api/auth/change-password]', err);
    return Response.json(
      { success: false, error: err.message || 'Password change failed.' },
      { status: 500 }
    );
  }
}
