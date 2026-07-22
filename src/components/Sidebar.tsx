'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp, Brain, BookOpen, Briefcase, CreditCard,
  Shield, Settings, Home, ChevronLeft, ChevronRight,
  LogOut, DollarSign, Zap, HelpCircle, Star,
  MessageSquare, Info
} from 'lucide-react';
import { logoutAction } from '@/app/actions';
import FounderPhoto from '@/components/FounderPhoto';

interface SidebarProps {
  user: any;
}

const NAV = [
  { href: '/',            icon: Home,         label: 'Home',        section: 'main' },
  { href: '/terminal',    icon: TrendingUp,   label: 'Terminal',    section: 'main', badge: 'LIVE' },
  { href: '/ai-assistant',icon: Brain,        label: 'AI Coach',    section: 'main', badge: 'AI' },
  { href: '/journal',     icon: BookOpen,     label: 'Journal',     section: 'main' },
  { href: '/portfolio',   icon: Briefcase,    label: 'Portfolio',   section: 'main' },
  { href: '/pricing',     icon: CreditCard,   label: 'Pricing',     section: 'main' },
  { href: '/whats-new',   icon: Zap,          label: "What's New",  section: 'main' },
  { href: '/support',     icon: HelpCircle,   label: 'Help Center', section: 'main' },
  { href: '/about',       icon: Info,         label: 'About & Founder', section: 'main' },
];

const BOTTOM_NAV = [
  { href: '/settings',    icon: Settings,     label: 'Settings' },
];

const ADMIN_NAV = [
  { href: '/admin',       icon: Shield,       label: 'Admin Suite' },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    await logoutAction();
    window.location.href = '/';
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const width = collapsed ? 'w-16' : 'w-60';

  return (
    <aside className={`${width} shrink-0 hidden md:flex flex-col border-r border-[var(--apex-border)] bg-[#04080f] transition-all duration-300 ease-in-out relative`} style={{minHeight:'calc(100vh - 0px)'}}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-14 border-b border-[var(--apex-border)] shrink-0 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-[#03060d] font-black text-sm shadow-lg shadow-emerald-500/20">
          ▲
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="text-[12px] font-black tracking-wider text-white uppercase whitespace-nowrap">
              Bull Run <span className="gradient-text">Apex AI</span>
            </span>
            <span className="text-[8px] text-slate-500 font-mono tracking-widest">by Himanshu Bhmniya</span>
          </div>
        )}
      </div>

      {/* User chip */}
      {user && !collapsed && (
        <div className="mx-3 mt-3 rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
              {(user.name ?? user.email)[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name ?? 'Trader'}</p>
              <p className="text-[9px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="text-[10px] font-mono">
              <span className="text-slate-500">Sim: </span>
              <span className="text-emerald-400 font-bold">${parseFloat(user.balance).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
              user.subscriptionTier === 'institutional' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
              user.subscriptionTier === 'pro'           ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                                          'bg-slate-800 text-slate-400 border-slate-700/40'
            }`}>{user.subscriptionTier}</span>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-2 py-3 space-y-0.5">
        {!collapsed && <p className="px-2 mb-2 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600">Navigation</p>}
        {NAV.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${collapsed ? 'justify-center px-0 w-full' : ''} ${
                active
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}>
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${
                      item.badge === 'LIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' :
                                              'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>{item.badge}</span>
                  )}
                </>
              )}
            </Link>
          );
        })}

        {user?.role === 'admin' && (
          <>
            {!collapsed && <p className="px-2 mt-4 mb-2 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600">Admin</p>}
            {ADMIN_NAV.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${collapsed ? 'justify-center px-0 w-full' : ''} ${
                    active ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="px-2 pb-4 pt-2 border-t border-[var(--apex-border)] space-y-0.5">
        {BOTTOM_NAV.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${collapsed ? 'justify-center px-0 w-full' : ''} ${
                active ? 'bg-slate-800 text-white border border-slate-700/40' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {user && (
          <button onClick={handleLogout} disabled={isPending} title={collapsed ? 'Sign out' : undefined}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all ${collapsed ? 'justify-center px-0' : ''}`}>
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{isPending ? 'Signing out…' : 'Sign Out'}</span>}
          </button>
        )}
      </div>

      {/* Founder card at very bottom */}
      {!collapsed && (
        <div className="mx-2 mb-3">
          <a href="/about" className="group flex items-center gap-2.5 rounded-xl border border-purple-500/15 bg-purple-500/5 hover:bg-purple-500/10 p-2.5 transition-all">
            <FounderPhoto size="sm" showBorder={false} showGlow={false} className="!h-8 !w-8 rounded-lg" />
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-slate-300 truncate group-hover:text-white transition-colors">Himanshu Bhmniya</p>
              <p className="text-[8px] text-purple-400 font-mono truncate">Founder · Bull Run Apex AI</p>
            </div>
          </a>
        </div>
      )}

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--apex-border)] bg-[#04080f] text-slate-400 hover:text-white transition-all shadow-lg">
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
