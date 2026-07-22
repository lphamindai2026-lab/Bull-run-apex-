import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient from '@/components/SettingsClient';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Account Settings | Bull Run Apex AI',
  description:
    'Manage your Bull Run Apex AI account. Update profile, adjust paper trading balance, ' +
    'enable 2FA security, configure notifications, AI preferences and appearance.',
  alternates: { canonical: '/settings' },
  robots: { index: false, follow: false }, // Private — do not index
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  return <SettingsClient user={user} />;
}
