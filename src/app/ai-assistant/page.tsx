import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { chatSessions, chatMessages } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import AIAssistantClient from '@/components/AIAssistantClient';

export const metadata = {
  title: 'AI Trading Coach — Gemini, Claude & GPT-4o | Bull Run Apex AI',
  description: 'Multi-model AI trading coach powered by Google Gemini 1.5, Claude 3.5 Sonnet and GPT-4o. Pine Script v5 generator, chart analysis, psychology coaching, voice input, PDF upload.',
  alternates: { canonical: '/ai-assistant' },
  openGraph: {
    title: 'AI Trading Coach — Gemini, Claude & GPT-4o | Bull Run Apex AI',
    description: 'Multi-model AI trading coach powered by Google Gemini 1.5, Claude 3.5 Sonnet and GPT-4o. Pine Script v5 generator, chart analysis, psychology coaching, voice input, PDF upload.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trading Coach — Gemini, Claude & GPT-4o | Bull Run Apex AI',
    description: 'Multi-model AI trading coach powered by Google Gemini 1.5, Claude 3.5 Sonnet and GPT-4o. Pine Script v5 generator, chart analysis, psychology coaching, voice input, PDF upload.',
    images: ['/og-image.jpg'],
  },
};






export const dynamic = 'force-dynamic';

interface AssistantPageProps {
  searchParams: Promise<{ session?: string }>;
}

export default async function AssistantPage({ searchParams }: AssistantPageProps) {
  const user = await getCurrentUser();
  const resolvedParams = await searchParams;
  const currentSessionId = resolvedParams.session || null;

  let sessions: any[] = [];
  let initialMessages: any[] = [];

  if (user) {
    try {
      // Fetch all sessions for this user
      sessions = await db.select()
        .from(chatSessions)
        .where(eq(chatSessions.userId, user.id))
        .orderBy(desc(chatSessions.createdAt));

      // Fetch messages if a session is active
      if (currentSessionId) {
        initialMessages = await db.select()
          .from(chatMessages)
          .where(and(
            eq(chatMessages.sessionId, currentSessionId),
            eq(chatMessages.userId, user.id)
          ))
          .orderBy(chatMessages.createdAt);
      } else if (sessions.length > 0) {
        // Default to the latest session if none specified
        const latestSessionId = sessions[0].id;
        initialMessages = await db.select()
          .from(chatMessages)
          .where(and(
            eq(chatMessages.sessionId, latestSessionId),
            eq(chatMessages.userId, user.id)
          ))
          .orderBy(chatMessages.createdAt);
      }
    } catch (err) {
      console.error('Error fetching AI history:', err);
    }
  }

  // Fallback default session ID if none exists yet and user wants to talk
  const activeSessionId = currentSessionId || (sessions.length > 0 ? sessions[0].id : null);

  return (
    <div className="flex-1 bg-[#040712] min-h-[calc(100vh-4rem)] flex flex-col">
      <AIAssistantClient 
        user={user} 
        sessions={sessions} 
        activeSessionId={activeSessionId} 
        initialMessages={initialMessages} 
      />
    </div>
  );
}
