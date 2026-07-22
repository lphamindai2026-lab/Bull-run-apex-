import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bullrunapexai.com';

export const metadata: Metadata = {
  title: 'Bull Run Apex AI — AI-Powered Institutional Trading Platform by Himanshu Bhmniya',
  description: "The world's most advanced AI trading platform. TradingView charts, Smart Money Concepts (BOS, CHoCH, FVG, Order Blocks), Gemini/Claude/GPT-4o AI coaching, behavioral trade journal. Free $100K simulation. Founded by Himanshu Bhmniya.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Bull Run Apex AI — AI Trading Platform by Himanshu Bhmniya',
    description: "Trade smarter. TradingView + SMC auto-detection + AI coaching + trade journal. Free $100K paper trading by Himanshu Bhmniya.",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

export default function HomepageLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
