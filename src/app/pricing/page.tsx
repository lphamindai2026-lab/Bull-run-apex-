import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import PricingClient from '@/components/PricingClient';

export const metadata = {
  title: 'Pricing — Free Demo & Pro Plans | Bull Run Apex AI',
  description: 'Bull Run Apex AI pricing. Start completely free with $100,000 simulation balance. Upgrade to Pro or Institutional for advanced features. Referral program available.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — Free Demo & Pro Plans | Bull Run Apex AI',
    description: 'Bull Run Apex AI pricing. Start completely free with $100,000 simulation balance. Upgrade to Pro or Institutional for advanced features. Referral program available.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Free Demo & Pro Plans | Bull Run Apex AI',
    description: 'Bull Run Apex AI pricing. Start completely free with $100,000 simulation balance. Upgrade to Pro or Institutional for advanced features. Referral program available.',
    images: ['/og-image.jpg'],
  },
};






export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 bg-[#040712] min-h-[calc(100vh-4rem)] flex flex-col">
      <PricingClient user={user} />
    </div>
  );
}
