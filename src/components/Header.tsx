'use client';

import React, { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp, Brain, BookOpen, Briefcase,
  CreditCard, Shield, LogOut, Sparkles,
  DollarSign, Menu, X, ChevronDown, User,
  Bell, Settings, AlertCircle
} from 'lucide-react';
import { registerAction, loginAction, logoutAction } from '@/app/actions';

interface HeaderUser {
  id: number;
  name: string | null;
  email: string;
  role: string;
  subscriptionStatus: string;
  subscriptionTier: string;
  balance: string;
  twoFaEnabled: boolean;
  affiliateCode: string | null;
  referredBy: string | null;
}

interface HeaderProps { user: HeaderUser | null; }

const NAV_ITEMS = [
  { name: 'Terminal',       href: '/terminal',     icon: TrendingUp,  badge: null },
  { name: 'AI Assistant',   href: '/ai-assistant', icon: Brain,       badge: 'AI' },
  { name: 'Journal',        href: '/journal',      icon: BookOpen,    badge: null },
  { name: 'Portfolio',      href: '/portfolio',    icon: Briefcase,   badge: null },
  { name: 'Pricing',        href: '/pricing',      icon: CreditCard,  badge: null },
];

const TIER_STYLES: Record<string, string> = {
  institutional: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
  pro:           'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  free:          'bg-slate-800/60 text-slate-400 border-slate-700/40',
};

export default function Header({ user }: HeaderProps) {
  const pathname  = usePathname();
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [showModal,      setShowModal]       = useState(false);
  const [authMode,       setAuthMode]        = useState<'login' | 'register'>('login');
  const [needs2fa,       setNeeds2fa]        = useState(false);
  const [error,          setError]           = useState<string | null>(null);
  const [isPending,      startTransition]    = useTransition();

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const openModal = (mode: 'login' | 'register') => {
    setAuthMode(mode); setError(null); setNeeds2fa(false); setShowModal(true);
  };

  const handleQuickDemo = () => {
    startTransition(async () => {
      setError(null);
      const fd = new FormData();
      fd.append('name',  'Apex Demo Trader');
      fd.append('email', `demo_${Date.now()}@apex.ai`);
      fd.append('password', 'ApexDemo2026!');
      const res = await registerAction(fd) as any;
      if (res.success) { setShowModal(false); window.location.href = '/terminal'; }
      else setError(res.error || 'Demo setup failed.');
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = authMode === 'register'
        ? await registerAction(fd) as any
        : await loginAction(fd) as any;
      if (res.success && res.requiresTwoFa) {
        setNeeds2fa(true);
        setError('Enter your 6-digit 2FA code below (use 123456 for demo).');
      } else if (res.success) {
        setShowModal(false); window.location.href = '/terminal';
      } else {
        setError(res.error || 'Authentication failed.');
      }
    });
  };

  const handleLogout = () => {
    startTransition(async () => { await logoutAction(); window.location.href = '/'; });
  };

  const tierStyle = TIER_STYLES[user?.subscriptionTier ?? 'free'] ?? TIER_STYLES.free;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--apex-border)] bg-[#03060d]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-[#03060d] font-black text-sm shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                ▲
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[13px] font-black tracking-widest text-white uppercase">
                  Bull Run <span className="gradient-text">Apex AI</span>
                </span>
                <span className="text-[8px] font-mono tracking-[0.2em] text-slate-500 uppercase">Institutional Suite</span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${active ? 'bg-slate-800/80 text-emerald-400 nav-active' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-0.5 rounded-full bg-emerald-500/15 px-1.5 py-px text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              {user?.role === 'admin' && (
                <Link href="/admin"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${pathname === '/admin' ? 'bg-slate-800/80 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}>
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <>
                  {/* Balance chip */}
                  <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-[var(--apex-border)] bg-slate-900/60 px-3 py-1.5 font-mono text-xs tabular-nums">
                    <DollarSign className="h-3 w-3 text-emerald-400" />
                    <span className="text-slate-400">Sim:</span>
                    <span className="font-bold text-emerald-400">
                      ${parseFloat(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {/* Tier badge */}
                  <span className={`hidden sm:inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tierStyle}`}>
                    {user.subscriptionTier}
                  </span>
                  {/* User chip */}
                  <div className="flex items-center gap-2 border-l border-[var(--apex-border)] pl-3">
                    <div className="hidden md:flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      {(user.name ?? user.email)[0].toUpperCase()}
                    </div>
                    <button onClick={handleLogout} title="Sign out"
                      className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={handleQuickDemo} disabled={isPending}
                    className="hidden sm:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1.5 text-xs font-bold text-[#03060d] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity disabled:opacity-50">
                    <Sparkles className="h-3 w-3" />
                    {isPending ? 'Loading…' : '1-Click Demo'}
                  </button>
                  <button onClick={() => openModal('login')}
                    className="rounded-lg border border-[var(--apex-border)] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-900/60 hover:text-white transition-all">
                    Sign In
                  </button>
                  <button onClick={() => openModal('register')}
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#03060d] hover:bg-emerald-400 transition-all">
                    Get Started
                  </button>
                </>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(o => !o)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white transition-colors">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[var(--apex-border)] bg-[#03060d] px-4 py-3 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${active ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
                  <Icon className="h-4 w-4" /> {item.name}
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900">
                <Shield className="h-4 w-4" /> Admin Suite
              </Link>
            )}
            {!user && (
              <div className="pt-2 flex gap-2 border-t border-[var(--apex-border)] mt-2">
                <button onClick={() => openModal('login')} className="flex-1 rounded-lg border border-[var(--apex-border)] py-2 text-sm text-slate-300 font-semibold">Sign In</button>
                <button onClick={() => openModal('register')} className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm text-[#03060d] font-bold">Sign Up</button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Auth Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setNeeds2fa(false); setError(null); } }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--apex-border)] bg-[#07101f] shadow-2xl overflow-hidden">

            {/* Modal header gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500" />

            <div className="p-7">
              <button onClick={() => { setShowModal(false); setNeeds2fa(false); setError(null); }}
                className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors text-lg">✕</button>

              <div className="text-center mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 text-emerald-400 text-xl font-black mb-3">▲</div>
                <h2 className="text-lg font-black text-white">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {authMode === 'login' ? 'Sign in to your institutional dashboard' : 'Start with $100,000 simulation balance'}
                </p>
              </div>

              {/* Social OAuth */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <a href="/api/auth/google"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[var(--apex-border)] bg-slate-900/60 hover:bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 transition-all">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.694 0-8.503-3.809-8.503-8.503s3.809-8.503 8.503-8.503c2.28 0 4.013.826 5.375 2.1l3.057-3.057C18.232 1.954 15.422 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.896 0 10.864-4.114 10.864-11.24 0-.768-.068-1.393-.193-1.954H12.24z"/></svg>
                  Google
                </a>
                <a href="/api/auth/github"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[var(--apex-border)] bg-slate-900/60 hover:bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 transition-all">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.59.1 3.22.84.091-.647.452-1.09.842-1.342-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  GitHub
                </a>
              </div>

              <div className="relative mb-5 flex items-center">
                <div className="flex-1 border-t border-[var(--apex-border)]" />
                <span className="mx-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">or continue with email</span>
                <div className="flex-1 border-t border-[var(--apex-border)]" />
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-950/30 border border-rose-500/20 p-3 text-xs text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                    <input name="name" type="text" required placeholder="Alex Trader"
                      className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all" />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email</label>
                  <input name="email" type="email" required placeholder="trader@apex.ai"
                    className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                  <input name="password" type="password" required placeholder="••••••••••"
                    className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all" />
                </div>
                {needs2fa && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1.5">2FA Code (demo: 123456)</label>
                    <input name="twoFaCode" type="text" maxLength={6} required placeholder="123456"
                      className="w-full rounded-lg border border-amber-500/30 bg-amber-950/10 px-3.5 py-2.5 text-sm text-amber-400 placeholder-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all font-mono tracking-widest text-center" />
                  </div>
                )}
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Referral Code <span className="text-emerald-500/70 normal-case">(optional +$5,000)</span></label>
                    <input name="referralCode" type="text" placeholder="APEX-XXXX"
                      className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900/80 px-3.5 py-2.5 text-sm text-emerald-400 placeholder-slate-700 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono" />
                  </div>
                )}
                <button type="submit" disabled={isPending}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-sm font-bold text-[#03060d] hover:opacity-90 transition-opacity disabled:opacity-50 mt-1">
                  {isPending ? 'Authenticating…' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-5 space-y-3">
                <button onClick={handleQuickDemo} disabled={isPending}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[var(--apex-border)] bg-slate-900/40 hover:bg-slate-900 py-2.5 text-xs font-semibold text-slate-300 transition-all">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> Instant Demo (no signup needed)
                </button>
                <p className="text-center text-xs text-slate-500">
                  {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null); setNeeds2fa(false); }}
                    className="text-emerald-400 font-semibold hover:underline">
                    {authMode === 'login' ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
