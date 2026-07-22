import React from 'react';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Bull Run Apex AI',
  description: 'Administrative control panel for Bull Run Apex AI. Manage users, subscriptions, support tickets, feature flags and audit logs.',
  robots: { index: false, follow: false }, // Admin pages should NOT be indexed
};
import { db } from '@/db';
import { users, supportTickets, systemLogs, announcements } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import AdminClient from '@/components/AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();

  // If user is not logged in or is not an admin, we'll let the Client component know
  // so it can render the beautiful 1-Click "Elevate to Admin" option, preventing dead ends!
  let allUsers: any[] = [];
  let tickets: any[] = [];
  let logs: any[] = [];
  let announcementsList: any[] = [];

  if (user && user.role === 'admin') {
    try {
      allUsers = await db.select().from(users).orderBy(users.id);
      tickets = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
      logs = await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(50);
      announcementsList = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    } catch (err) {
      console.error('Error fetching admin panels:', err);
    }
  }

  return (
    <div className="flex-1 bg-[#040712] min-h-[calc(100vh-4rem)] flex flex-col">
      <AdminClient 
        currentUser={user} 
        initialUsers={allUsers} 
        initialTickets={tickets} 
        initialLogs={logs} 
        initialAnnouncements={announcementsList} 
      />
    </div>
  );
}
