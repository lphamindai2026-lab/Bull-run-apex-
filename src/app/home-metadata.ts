import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bullrunapexai.com';

export const homeMetadata: Metadata = {
  title: 'Bull Run Apex AI — AI-Powered Institutional Trading Platform by Himanshu Bhmniya',
  description: "The world's most advanced AI trading platform. TradingView charts, Smart Money Concepts auto-detection (BOS, CHoCH, FVG, Order Blocks), Gemini/Claude/GPT-4o AI coaching, trade journal & portfolio analytics. Start free with $100,000 simulation. Founded by Himanshu Bhmniya.",
  keywords: [
    'Bull Run Apex AI', 'Himanshu Bhmniya', 'AI trading platform',
    'institutional trading', 'Smart Money Concepts', 'SMC trading',
    'TradingView charts', 'order blocks', 'fair value gap', 'BOS CHoCH',
    'trade journal AI', 'crypto trading platform', 'forex trading AI',
    'paper trading simulator', 'trading psychology coach',
    'Pine Script generator', 'free trading platform', 'AI stock analysis',
    'quantitative trading tool', 'bull run apex',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Bull Run Apex AI — AI-Powered Institutional Trading Platform',
    description: "Trade smarter with Bull Run Apex AI by Himanshu Bhmniya. TradingView charts, SMC auto-detection, multi-model AI coaching, behavioral journal & analytics. Free $100K simulation.",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Bull Run Apex AI by Himanshu Bhmniya' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bull Run Apex AI — AI Institutional Trading Platform',
    description: "The world's most advanced AI trading platform by Himanshu Bhmniya. Free $100K simulation.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};
