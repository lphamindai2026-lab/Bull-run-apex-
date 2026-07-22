import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { trades } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import TradingTerminalClient from '@/components/TradingTerminalClient';

export const metadata = {
  title: 'Trading Terminal — Live Charts & Paper Trading | Bull Run Apex AI',
  description: 'Real-time TradingView charts with Smart Money Concepts auto-detection (BOS, CHoCH, FVG, Order Blocks). Paper trading simulator with $100,000 balance. By Himanshu Bhmniya.',
  alternates: { canonical: '/terminal' },
  openGraph: {
    title: 'Trading Terminal — Live Charts & Paper Trading | Bull Run Apex AI',
    description: 'Real-time TradingView charts with Smart Money Concepts auto-detection (BOS, CHoCH, FVG, Order Blocks). Paper trading simulator with $100,000 balance. By Himanshu Bhmniya.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Terminal — Live Charts & Paper Trading | Bull Run Apex AI',
    description: 'Real-time TradingView charts with Smart Money Concepts auto-detection (BOS, CHoCH, FVG, Order Blocks). Paper trading simulator with $100,000 balance. By Himanshu Bhmniya.',
    images: ['/og-image.jpg'],
  },
};






export const dynamic = 'force-dynamic';

export default async function TerminalPage() {
  const user = await getCurrentUser();
  
  let initialOpenTrades: any[] = [];
  if (user) {
    try {
      initialOpenTrades = await db.select()
        .from(trades)
        .where(and(
          eq(trades.userId, user.id),
          eq(trades.status, 'OPEN')
        ))
        .orderBy(desc(trades.createdAt));
    } catch (err) {
      console.error('Error fetching open trades:', err);
    }
  }

  return (
    <div className="flex-1 bg-[#040712] min-h-[calc(100vh-4rem)] flex flex-col">
      <TradingTerminalClient user={user} initialOpenTrades={initialOpenTrades} />
    </div>
  );
}
