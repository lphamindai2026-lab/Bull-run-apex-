import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { portfolios, alerts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import PortfolioClient from '@/components/PortfolioClient';

export const metadata = {
  title: 'Portfolio & Price Alerts — Analytics & Signals | Bull Run Apex AI',
  description: 'Portfolio analytics, asset allocation, P&L tracking, and price alerts via Telegram, Discord, Email, SMS. SMC pattern alerts and liquidation heatmaps included.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio & Price Alerts — Analytics & Signals | Bull Run Apex AI',
    description: 'Portfolio analytics, asset allocation, P&L tracking, and price alerts via Telegram, Discord, Email, SMS. SMC pattern alerts and liquidation heatmaps included.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio & Price Alerts — Analytics & Signals | Bull Run Apex AI',
    description: 'Portfolio analytics, asset allocation, P&L tracking, and price alerts via Telegram, Discord, Email, SMS. SMC pattern alerts and liquidation heatmaps included.',
    images: ['/og-image.jpg'],
  },
};






export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const user = await getCurrentUser();

  let userPortfolios: any[] = [];
  let userAlerts: any[] = [];

  if (user) {
    try {
      userPortfolios = await db.select()
        .from(portfolios)
        .where(eq(portfolios.userId, user.id))
        .orderBy(portfolios.symbol);

      userAlerts = await db.select()
        .from(alerts)
        .where(eq(alerts.userId, user.id))
        .orderBy(desc(alerts.createdAt));
    } catch (err) {
      console.error('Error fetching portfolios/alerts:', err);
    }
  }

  return (
    <div className="flex-1 bg-[#040712] min-h-[calc(100vh-4rem)] flex flex-col">
      <PortfolioClient 
        user={user} 
        initialPortfolios={userPortfolios} 
        initialAlerts={userAlerts} 
      />
    </div>
  );
}
