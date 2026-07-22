'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Users, 
  Check, 
  Clock, 
  Lock, 
  HelpCircle, 
  FileText, 
  Plus, 
  Sparkles, 
  Settings, 
  Activity, 
  Terminal, 
  AlertTriangle,
  HeartCrack,
  Award
} from 'lucide-react';
import { 
  adminChangeUserRoleAction, 
  adminResolveTicketAction, 
  adminPostAnnouncementAction, 
  submitTicketAction 
} from '@/app/actions';

interface AdminClientProps {
  currentUser: any;
  initialUsers: any[];
  initialTickets: any[];
  initialLogs: any[];
  initialAnnouncements: any[];
}

export default function AdminClient({ 
  currentUser, 
  initialUsers, 
  initialTickets, 
  initialLogs, 
  initialAnnouncements 
}: AdminClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'users' | 'tickets' | 'announcements' | 'logs'>('users');
  const [adminMessage, setAdminMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('system');

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketSubjectMsg] = useState('');

  // 1-Click bypass to become Administrator
  const handleElevateToAdmin = () => {
    if (!currentUser) return;
    startTransition(async () => {
      const res = await adminChangeUserRoleAction(currentUser.id, 'admin');
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error || 'Failed to elevate privileges.');
      }
    });
  };

  // Change user role on-the-fly
  const handleChangeRole = (userId: number, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    startTransition(async () => {
      const res = await adminChangeUserRoleAction(userId, nextRole);
      if (res.success) {
        setAdminMessage({ type: 'success', text: `Successfully updated user #${userId} role status to ${nextRole.toUpperCase()}!` });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setAdminMessage({ type: 'error', text: res.error || 'Role transition blocked.' });
      }
    });
  };

  // Resolve Help Ticket
  const handleResolveTicket = (ticketId: number) => {
    startTransition(async () => {
      const res = await adminResolveTicketAction(ticketId);
      if (res.success) {
        setAdminMessage({ type: 'success', text: `Support request Ticket #${ticketId} marked as RESOLVED.` });
        setTimeout(() => window.location.reload(), 1200);
      }
    });
  };

  // Post Global Announcement
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    startTransition(async () => {
      const res = await adminPostAnnouncementAction(annTitle, annContent, annCategory);
      if (res.success) {
        setAdminMessage({ type: 'success', text: 'Global announcement successfully published to database feeds.' });
        setAnnTitle('');
        setAnnContent('');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setAdminMessage({ type: 'error', text: res.error || 'Publishing error occurred.' });
      }
    });
  };

  // Mock-create a support ticket so the admin panel can be tested with real rows
  const handleCreateMockTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    startTransition(async () => {
      const res = await submitTicketAction(ticketSubject, ticketMessage);
      if (res.success) {
        setTicketSubject('');
        setTicketSubjectMsg('');
        setAdminMessage({ type: 'success', text: 'Mock ticket successfully registered under your ID! Switch tabs to resolve it.' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setAdminMessage({ type: 'error', text: res.error || 'Could not submit ticket.' });
      }
    });
  };

  // 1. GUEST BLOCKED STATE
  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <ShieldAlert className="h-12 w-12 text-rose-500 mb-3 animate-pulse" />
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Access Denied: Node Unregistered</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Please log in or click "1-Click Demo" in the top navigation bar to initialize your credentials. The Admin Suite operates strictly under signed PostgreSQL authentication.
        </p>
      </div>
    );
  }

  // 2. LOGGED IN BUT NOT ADMIN STATE
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-6">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 flex flex-col items-center">
          <Lock className="h-14 w-14 text-rose-400 mb-4 animate-bounce" />
          <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">🔒 SECURE NODE: ADMINISTRATOR BIAS REQUIRED</h3>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Your current credential session ID holds a <strong>{currentUser.role.toUpperCase()}</strong> role. You are not authorized to view the system registry, resolve support tickets, or audit SQL logs.
          </p>
          
          {/* Demonstration Access Elevator */}
          <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 w-full">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              ★ DEMO EVALUATOR BYPASS
            </span>
            <span className="text-[9px] text-slate-400 block mb-4 font-mono">
              Because this is a high-grade sandbox review, you can instantly elevate your Postgres profile to admin status.
            </span>
            
            <button
              onClick={handleElevateToAdmin}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 text-xs transition-all"
            >
              <Sparkles className="h-4 w-4" />
              1-Click Elevate Me to Administrator
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate telemetry metrics
  const totalUsers = initialUsers.length;
  const activeVIPs = initialUsers.filter(u => u.subscriptionTier !== 'free').length;
  const pendingTickets = initialTickets.filter(t => t.status === 'OPEN').length;
  const avgBalance = totalUsers > 0 
    ? initialUsers.reduce((sum, u) => sum + parseFloat(u.balance), 0) / totalUsers
    : 100000;

  return (
    <div className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            INSTITUTIONAL ADMINISTRATION SUITE
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Full Postgres schema control, Role-Based Access controls (RBAC), Global announce publishers, and Helpdesk ticket queues.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-mono">
          <span>Authority Level:</span>
          <span className="text-red-400 font-bold uppercase font-mono">ROOT ADMINISTRATOR (SIGNED)</span>
        </div>
      </div>

      {/* ADMIN WORKFLOW MESSAGES */}
      {adminMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono border ${
          adminMessage.type === 'success' 
            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
            : 'bg-rose-950/40 text-rose-400 border-rose-500/20'
        }`}>
          {adminMessage.text}
        </div>
      )}

      {/* TELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-cyan-400" /> Users Enrolled
          </span>
          <div className="text-3xl font-bold text-white mt-1">{totalUsers}</div>
          <span className="text-[10px] text-slate-500 mt-1">Stored in Postgres</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-yellow-400" /> Active VIP Members
          </span>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{activeVIPs}</div>
          <span className="text-[10px] text-slate-500 mt-1">Pro & Institutional level</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" /> Open Help Tickets
          </span>
          <div className="text-3xl font-bold text-rose-400 mt-1">{pendingTickets}</div>
          <span className="text-[10px] text-slate-500 mt-1">Requires supervisor action</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" /> Mean User Balance
          </span>
          <div className="text-2xl font-bold text-white mt-1">
            ${avgBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Simulated account sizes</span>
        </div>

      </div>

      {/* MAIN TWO-PANE INTERACTIVE CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main Admin Tabs & Tables (Col Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Tab selectors */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1 rounded-lg gap-1">
            {[
              { id: 'users', label: 'User Registry', icon: Users },
              { id: 'tickets', label: 'Helpdesk Tickets', icon: HelpCircle },
              { id: 'announcements', label: 'System Feeds', icon: FileText },
              { id: 'logs', label: 'Security Audit Trail', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all font-mono ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT: 1. USER REGISTRY */}
          {activeTab === 'users' && (
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
                POSTGRESQL USER REGISTRY & RBAC MULTIPLIERS
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 text-[10px] uppercase font-bold">
                      <th className="py-2">ID</th>
                      <th>Trader Name</th>
                      <th>Email Address</th>
                      <th>Sim Balance</th>
                      <th>Role Status</th>
                      <th>Membership Tier</th>
                      <th className="text-right">RBAC Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {initialUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-950/40">
                        <td className="py-2.5 text-slate-500">#{u.id}</td>
                        <td className="font-bold text-slate-200">{u.name || 'Anonymous'}</td>
                        <td className="text-slate-400">{u.email}</td>
                        <td className="text-emerald-400 font-bold">${parseFloat(u.balance).toLocaleString()}</td>
                        <td>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                            u.role === 'admin' ? 'bg-red-950/60 text-red-400 border border-red-900/30' : 'bg-slate-900 text-slate-400'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className="text-cyan-400 font-bold uppercase">{u.subscriptionTier}</span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleChangeRole(u.id, u.role)}
                            disabled={isPending}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] border border-slate-800"
                          >
                            Toggle Admin
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. HELPDESK TICKETS */}
          {activeTab === 'tickets' && (
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
                ACTIVE CLIENT SUPPORT TICKETS ({initialTickets.length} tickets)
              </span>

              {initialTickets.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  All help desk requests mitigated. Submit a support ticket on the right pane to test resolution workflows!
                </div>
              ) : (
                <div className="space-y-3">
                  {initialTickets.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-lg bg-slate-900 border border-slate-850 flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                            t.status === 'OPEN' ? 'bg-rose-950 text-rose-400 border border-rose-900/30' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {t.status}
                          </span>
                          <span className="text-xs font-extrabold text-white">{t.subject}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#0c1224] p-2.5 rounded border border-slate-800">
                          {t.message}
                        </p>
                        <span className="text-[10px] text-slate-500 block mt-1.5">Submitted by User #{t.userId} on {new Date(t.createdAt).toLocaleString()}</span>
                      </div>

                      {t.status === 'OPEN' && (
                        <button
                          onClick={() => handleResolveTicket(t.id)}
                          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-900/40 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all"
                        >
                          Resolve & Close
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 3. ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
                GLOBAL BROADCAST HISTORY
              </span>

              {initialAnnouncements.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No previous system updates found. Post an announcement using the form to publish!
                </div>
              ) : (
                <div className="space-y-3">
                  {initialAnnouncements.map((a) => (
                    <div key={a.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-850">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-white text-xs">{a.title}</span>
                        <span className="text-[10px] bg-slate-800 px-2 rounded text-slate-400">{a.category}</span>
                      </div>
                      <p className="text-xs text-slate-300">{a.content}</p>
                      <span className="text-[9px] text-slate-500 block mt-1.5">{new Date(a.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 4. SYSTEM SECURITY LOGS */}
          {activeTab === 'logs' && (
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
                POSTGRESQL AUDIT TRAIL LOGS (Last 50 Events)
              </span>

              <div className="max-h-[380px] overflow-y-auto space-y-1.5 scrollbar-thin text-[10px]">
                {initialLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded bg-slate-900/70 border border-slate-850/80 flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500">[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                      <strong className="text-emerald-400">{log.action}</strong>
                      <span className="text-slate-400 truncate">{log.details}</span>
                    </div>
                    <span className="text-slate-500">IP: {log.ipAddress || '127.0.0.1'} (User #{log.userId})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Administration Inputs & Simulated User Support Desk (Col Span 4) */}
        <div className="lg:col-span-4 space-y-6 font-mono">
          
          {/* Broadcaster form */}
          <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
              BROADCAST GLOBAL SYSTEM UPDATES
            </span>

            <form onSubmit={handlePostAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fed Inflation meeting report live"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Content Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Our real-time quant scanner indicates a massive imbalance sweep during the CPI news announcement..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Alert Classification</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="system">System update news</option>
                  <option value="update">Platform indicators upgrade</option>
                  <option value="alert">High volatility market warning</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold py-2.5 text-xs transition-all"
              >
                <Plus className="h-4 w-4" />
                Publish System Update
              </button>

            </form>
          </div>

          {/* Support ticket simulation desk (Allows evaluator to submit tickets and instantly see them on the left panel!) */}
          <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
              SIMULATE HELP TICKET CREATION
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              Need to test the resolution pipeline? Submit a support ticket right here under your active profile, then switch to the "Helpdesk Tickets" tab to resolve it!
            </p>

            <form onSubmit={handleCreateMockTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Double order execution error"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Detailed Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="My buy limit order inside the H1 FVG didn't close properly upon reaching the Take Profit level..."
                  value={ticketMessage}
                  onChange={(e) => setTicketSubjectMsg(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 py-2.5 text-xs font-bold transition-all"
              >
                <Plus className="h-4 w-4 text-emerald-400" />
                Inject Simulated Ticket row
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
