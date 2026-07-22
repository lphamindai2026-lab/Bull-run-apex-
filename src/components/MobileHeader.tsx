'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Home, TrendingUp, Brain, BookOpen, Briefcase,
  CreditCard, Shield, Settings, HelpCircle, Zap, LogOut, Sparkles
} from 'lucide-react';
import { registerAction, loginAction, logoutAction } from '@/app/actions';

interface MobileHeaderProps { user: any; }

export default function MobileHeader({ user }: MobileHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [error, setError] = useState<string|null>(null);
  const [isPending, startTx] = useTransition();

  const links = [
    { href:'/', icon:Home, label:'Home' },
    { href:'/terminal', icon:TrendingUp, label:'Terminal' },
    { href:'/ai-assistant', icon:Brain, label:'AI Coach' },
    { href:'/journal', icon:BookOpen, label:'Journal' },
    { href:'/portfolio', icon:Briefcase, label:'Portfolio' },
    { href:'/pricing', icon:CreditCard, label:'Pricing' },
    { href:'/whats-new', icon:Zap, label:"What's New" },
    { href:'/support', icon:HelpCircle, label:'Help Center' },
    { href:'/settings', icon:Settings, label:'Settings' },
  ];

  const handleLogout = () => { startTx(async()=>{ await logoutAction(); window.location.href='/'; }); };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null);
    const fd = new FormData(e.currentTarget);
    startTx(async () => {
      const res = mode==='register' ? await registerAction(fd) as any : await loginAction(fd) as any;
      if (res.success) { setShowAuth(false); window.location.href='/terminal'; }
      else setError(res.error || 'Failed.');
    });
  };

  const handleDemo = () => {
    startTx(async () => {
      const fd = new FormData();
      fd.append('name','Demo Trader'); fd.append('email',`demo_${Date.now()}@apex.ai`); fd.append('password','ApexDemo2026!');
      const res = await registerAction(fd) as any;
      if (res.success) { setShowAuth(false); window.location.href='/terminal'; }
      else setError(res.error || 'Demo failed.');
    });
  };

  return (
    <header className="md:hidden sticky top-0 z-50 border-b border-[var(--apex-border)] bg-[#03060d]/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-[#03060d] font-black text-xs flex items-center justify-center shadow-lg">▲</div>
          <span className="text-sm font-black text-white">Apex AI</span>
        </Link>
        <div className="flex items-center gap-2">
          {!user && <button onClick={()=>setShowAuth(true)} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#03060d]">Sign In</button>}
          <button onClick={()=>setOpen(o=>!o)} className="p-1.5 text-slate-400">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--apex-border)] bg-[#03060d] px-3 pb-4 pt-2">
          {user && (
            <div className="mb-3 rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-3 flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
                {(user.name ?? user.email)[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{user.name ?? 'Trader'}</p>
                <p className="text-[9px] text-emerald-400 font-mono">Sim: ${parseFloat(user.balance).toLocaleString('en-US',{maximumFractionDigits:0})}</p>
              </div>
            </div>
          )}
          <nav className="space-y-0.5">
            {links.map(l => {
              const Icon = l.icon;
              const active = pathname===l.href || (l.href!=='/' && pathname.startsWith(l.href));
              return (
                <Link key={l.href} href={l.href} onClick={()=>setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${active?'bg-emerald-500/10 text-emerald-400':'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
                  <Icon className="h-4 w-4" /> {l.label}
                </Link>
              );
            })}
            {user?.role==='admin' && (
              <Link href="/admin" onClick={()=>setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900">
                <Shield className="h-4 w-4" /> Admin Suite
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-950/20 transition-all">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            ) : (
              <div className="pt-2 flex gap-2">
                <button onClick={handleDemo} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-xs font-bold text-[#03060d]">
                  <Sparkles className="h-3 w-3" />1-Click Demo
                </button>
                <button onClick={()=>setShowAuth(true)} className="flex-1 rounded-xl border border-[var(--apex-border)] text-slate-200 py-2.5 text-xs font-bold">
                  Sign In
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={e=>{if(e.target===e.currentTarget){setShowAuth(false);setError(null);}}}>
          <div className="w-full max-w-sm rounded-2xl border border-[var(--apex-border)] bg-[#07101f] p-6">
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded mb-5" />
            <h2 className="text-base font-black text-white mb-4">{mode==='login'?'Sign In':'Create Account'}</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <a href="/api/auth/google" className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--apex-border)] bg-slate-900 py-2.5 text-xs font-semibold text-slate-300">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.694 0-8.503-3.809-8.503-8.503s3.809-8.503 8.503-8.503c2.28 0 4.013.826 5.375 2.1l3.057-3.057C18.232 1.954 15.422 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.896 0 10.864-4.114 10.864-11.24 0-.768-.068-1.393-.193-1.954H12.24z"/></svg>
                Google
              </a>
              <a href="/api/auth/github" className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--apex-border)] bg-slate-900 py-2.5 text-xs font-semibold text-slate-300">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.59.1 3.22.84.091-.647.452-1.09.842-1.342-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                GitHub
              </a>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-950/30 border border-rose-500/20 p-2.5 text-xs text-rose-400">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode==='register' && <input name="name" type="text" required placeholder="Full name" className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />}
              <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />
              <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />
              <button type="submit" disabled={isPending} className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-sm font-bold text-[#03060d] disabled:opacity-50">
                {isPending ? 'Loading…' : mode==='login'?'Sign In':'Create Account'}
              </button>
            </form>
            <button onClick={handleDemo} className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg border border-[var(--apex-border)] bg-slate-900/40 py-2.5 text-xs font-semibold text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />Instant Demo
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              {mode==='login'?"No account? ":"Have one? "}
              <button onClick={()=>{setMode(m=>m==='login'?'register':'login');setError(null);}} className="text-emerald-400 font-semibold">
                {mode==='login'?'Sign up':'Sign in'}
              </button>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
