import { getCurrentUser } from '@/lib/auth';
import SupportClient from '@/components/SupportClient';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Help Center & Support | Bull Run Apex AI',
  description:
    'Get help with Bull Run Apex AI. Browse the FAQ, submit a support ticket, ' +
    'or contact founder Himanshu Bhmniya directly at bullrunapex@gmail.com · Instagram: @legacy_boy_1.',
  alternates: { canonical: '/support' },
  openGraph: {
    title:       'Help Center & Support | Bull Run Apex AI',
    description: 'FAQ, support tickets, and direct contact with Himanshu Bhmniya — founder of Bull Run Apex AI.',
    images:      [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default async function SupportPage() {
  const user = await getCurrentUser();
  return <SupportClient user={user} />;
}
