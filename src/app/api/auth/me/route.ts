import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ authenticated: false, user: null }, { status: 401 });
  }
  return Response.json({ authenticated: true, user });
}
