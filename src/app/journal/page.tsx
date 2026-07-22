import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { trades } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import TradeJournalClient from '@/components/TradeJournalClient';

export const metadata = {
  title: 'AI Trade Journal — Behavioral Analysis & Performance | Bull Run Apex AI',
  description: 'Smart trade journal with emotion tracking, FOMO & mistake analysis, win rate analytics, calendar heatmap, and AI psychology coaching. Built by Himanshu Bhmniya.',
  alternates: { canonical: '/journal' },
  openGraph: {
    title: 'AI Trade Journal — Behavioral Analysis & Performance | Bull Run Apex AI',
    description: 'Smart trade journal with emotion tracking, FOMO & mistake analysis, win rate analytics, calendar heatmap, and AI psychology coaching. Built by Himanshu Bhmniya.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trade Journal — Behavioral Analysis & Performance | Bull Run Apex AI',
    description: 'Smart trade journal with emotion tracking, FOMO & mistake analysis, win rate analytics, calendar heatmap, and AI psychology coaching. Built by Himanshu Bhmniya.',
    images: ['/og-image.jpg'],
  },
};






export const dynamic = 'force-dynamic';

export default async function JournalPage() {
  const user = await getCurrentUser();
  
  let journalTrades: any[] = [];
  let stats = {
    totalTrades: 0,
    winRate: 0,
    totalPnl: 0,
    averageWin: 0,
    averageLoss: 0,
    mistakeDistribution: {
      FOMO: 0,
      OVER_LEVERAGING: 0,
      REVENGE_TRADING: 0,
      EARLY_EXIT: 0,
      HOPE_TRADING: 0,
      NONE: 0
    }
  };

  if (user) {
    try {
      // Fetch all CLOSED trades for journaling
      journalTrades = await db.select()
        .from(trades)
        .where(and(
          eq(trades.userId, user.id),
          eq(trades.status, 'CLOSED')
        ))
        .orderBy(desc(trades.closedAt));

      if (journalTrades.length > 0) {
        stats.totalTrades = journalTrades.length;
        
        const winTrades = journalTrades.filter(t => parseFloat(t.pnl || '0') > 0);
        stats.winRate = Math.round((winTrades.length / journalTrades.length) * 100);

        let totalPnl = 0;
        let sumWins = 0;
        let sumLosses = 0;
        let winCount = 0;
        let lossCount = 0;

        journalTrades.forEach(t => {
          const pnlVal = parseFloat(t.pnl || '0');
          totalPnl += pnlVal;
          if (pnlVal > 0) {
            sumWins += pnlVal;
            winCount++;
          } else if (pnlVal < 0) {
            sumLosses += pnlVal;
            lossCount++;
          }

          // Count mistakes
          const mist = (t.mistake || 'NONE') as keyof typeof stats.mistakeDistribution;
          if (stats.mistakeDistribution[mist] !== undefined) {
            stats.mistakeDistribution[mist]++;
          } else {
            stats.mistakeDistribution.NONE++;
          }
        });

        stats.totalPnl = totalPnl;
        stats.averageWin = winCount > 0 ? (sumWins / winCount) : 0;
        stats.averageLoss = lossCount > 0 ? (sumLosses / lossCount) : 0;
      }
    } catch (err) {
      console.error('Error loading journal analytics:', err);
    }
  }

  return (
    <div className="flex-1 bg-[#040712] min-h-[calc(100vh-4rem)] flex flex-col">
      <TradeJournalClient 
        user={user} 
        journalTrades={journalTrades} 
        stats={stats} 
      />
    </div>
  );
}
