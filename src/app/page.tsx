'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Brain, BookOpen, Briefcase, Zap,
  ArrowRight, Shield, Activity, LineChart, Code,
  Globe, ChevronRight, Star, Users, BarChart2, Lock
} from 'lucide-react';
import { TICKERS } from '@/lib/mockData';

function CountUp({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return; ref.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

function TickerBar() {
  const [tickers, setTickers] = useState(TICKERS.slice(0, 8));
  useEffect(() => {
    const id = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const d = (Math.random() - 0.485) * 0.06;
        return { ...t,
          price: +(t.price * (1 + d / 100)).toFixed(t.price > 1000 ? 1 : t.price > 1 ? 3 : 5),
          change: +(t.change + d * 15).toFixed(2),
        };
      }));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-y border-[var(--apex-border)] bg-[#050a15]/80 py-2 overflow-hidden" role="marquee" aria-label="Live market prices">
      <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...tickers, ...tickers].map((t, i) => {
          const up = t.change >= 0;
          return (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-mono">
              <span className="font-bold text-white">{t.symbol}</span>
              <span className="tabular-nums text-slate-200">
                ${t.price.toLocaleString('en-US', { minimumFractionDigits: t.price > 100 ? 1 : 4 })}
              </span>
              <span className={`font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {up ? '▲' : '▼'} {Math.abs(t.change).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) {
  return (
    <article className="group relative rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-6 hover:border-slate-600 transition-all duration-300 hover:-translate-y-0.5">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-4`} aria-hidden="true">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </article>
  );
}

function MarketGrid() {
  const [tickers, setTickers] = useState(TICKERS);
  useEffect(() => {
    const id = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const d = (Math.random() - 0.485) * 0.05;
        return { ...t,
          price: +(t.price * (1 + d / 100)).toFixed(t.price > 1000 ? 1 : t.price > 1 ? 3 : 5),
          change: +(t.change + d * 12).toFixed(2),
        };
      }));
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3" role="list" aria-label="Live market prices">
      {tickers.slice(0, 7).map(t => {
        const up = t.change >= 0;
        return (
          <Link key={t.symbol} href="/terminal" role="listitem"
            className="group rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-3.5 hover:border-slate-600 hover:bg-slate-900/60 transition-all cursor-pointer"
            aria-label={`${t.name}: $${t.price} (${t.change >= 0 ? '+' : ''}${t.change}%)`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-slate-400">{t.symbol}</span>
              <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                t.institutionalBias.includes('BULLISH') ? 'bg-emerald-500/10 text-emerald-400' :
                t.institutionalBias.includes('BEARISH') ? 'bg-rose-500/10 text-rose-400' :
                'bg-slate-800 text-slate-400'
              }`}>{t.category.toUpperCase()}</span>
            </div>
            <div className="font-mono text-sm font-bold text-white tabular-nums">
              ${t.price.toLocaleString('en-US', { minimumFractionDigits: t.price > 100 ? 0 : 3 })}
            </div>
            <div className={`mt-1 font-mono text-xs font-bold flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span aria-hidden="true">{up ? '▲' : '▼'}</span>
              <span>{up ? '+' : ''}{t.change.toFixed(2)}%</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* Live Ticker */}
      <TickerBar />

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden" aria-labelledby="hero-heading">
        <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-mono text-emerald-400 mb-8">
          <Zap className="h-3 w-3" aria-hidden="true" />
          <span>Institutional-Grade AI Trading Platform — v5.0 Live · by Himanshu Bhmniya</span>
        </div>

        <h1 id="hero-heading" className="max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
          Trade Smarter with<br />
          <span className="gradient-text">AI-Powered Precision</span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
          <strong className="text-slate-300">Bull Run Apex AI</strong> — combining TradingView charts, automated Smart Money Concepts (SMC), real-time order flow, multi-model AI coaching (Gemini, Claude, GPT-4o), and behavioral trade journaling in one platform. Founded by <strong className="text-purple-400">Himanshu Bhmniya</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/terminal"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-3.5 text-sm font-bold text-[#03060d] shadow-xl shadow-emerald-500/20 hover:opacity-90 transition-all hover:scale-[1.02]"
            aria-label="Launch the trading terminal">
            Launch Terminal <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/ai-assistant"
            className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] bg-slate-900/60 px-7 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-900 hover:text-white transition-all"
            aria-label="Talk to the AI trading coach">
            <Brain className="h-4 w-4 text-purple-400" aria-hidden="true" /> Talk to AI Coach
          </Link>
          <Link href="/about"
            className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 px-7 py-3.5 text-sm font-bold text-purple-400 hover:bg-purple-500/10 transition-all"
            aria-label="Learn about founder Himanshu Bhmniya">
            About Himanshu
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16" role="list" aria-label="Platform statistics">
          {[
            { label: 'Markets Covered',    end: 14,     suffix: '+',    prefix: '' },
            { label: 'SMC Detections/hr',  end: 2400,   suffix: '',     prefix: '' },
            { label: 'AI Models',          end: 4,      suffix: '',     prefix: '' },
            { label: 'Start Balance',      end: 100000, suffix: '',     prefix: '$' },
          ].map(s => (
            <div key={s.label} className="text-center" role="listitem">
              <div className="text-3xl sm:text-4xl font-black tabular-nums gradient-text" aria-label={`${s.prefix}${s.end}${s.suffix} ${s.label}`}>
                <CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE MARKETS ── */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full" aria-labelledby="markets-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="markets-heading" className="text-sm font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Live Markets
          </h2>
          <Link href="/terminal" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold">
            Full Terminal <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <MarketGrid />
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full" aria-labelledby="features-heading">
        <div className="text-center mb-12">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-black text-white mb-3">
            Everything you need to trade professionally
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Built by quant traders for quant traders. Founded by <strong className="text-purple-400">Himanshu Bhmniya</strong>.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard icon={LineChart}  color="bg-emerald-500/10 text-emerald-400" title="TradingView Advanced Charts"   desc="Full interactive charts with 100+ indicators, drawing tools, and multi-timeframe SMC auto-detection." />
          <FeatureCard icon={Brain}      color="bg-purple-500/10 text-purple-400"   title="Multi-Model AI Coaching"       desc="Switch between Gemini 1.5, Claude 3.5, and GPT-4o. Generate Pine Script, analyze setups, get coaching." />
          <FeatureCard icon={BarChart2}  color="bg-cyan-500/10 text-cyan-400"      title="SMC Auto-Detection"            desc="Automated BOS, CHoCH, Order Blocks, FVG, Liquidity Sweeps, Kill Zones drawn on your charts." />
          <FeatureCard icon={BookOpen}   color="bg-yellow-500/10 text-yellow-400"  title="Behavioral Trade Journal"      desc="Track emotions, mistakes, and performance. AI psychology coaching on every closed trade." />
          <FeatureCard icon={Globe}      color="bg-rose-500/10 text-rose-400"      title="14 Global Markets"             desc="Crypto, Forex, Stocks, Gold, Silver, Oil, Indices — all in one unified scanner and terminal." />
          <FeatureCard icon={Activity}   color="bg-orange-500/10 text-orange-400"  title="Order Flow & DOM"              desc="Live depth-of-market order books, whale wallet tracker, liquidation heatmaps and footprint charts." />
          <FeatureCard icon={Shield}     color="bg-indigo-500/10 text-indigo-400"  title="Enterprise Security"           desc="PBKDF2 hashing, HMAC sessions, 2FA, OAuth, rate limiting, XSS/SQLi protection and audit logs." />
          <FeatureCard icon={Code}       color="bg-teal-500/10 text-teal-400"      title="Pine Script Generator"         desc="Describe your strategy in plain English and get production-ready Pine Script v5 code instantly." />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-[var(--apex-surface)] to-cyan-500/5 p-10 sm:p-16 text-center relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-mono text-emerald-400 mb-6">
            <Star className="h-3 w-3" aria-hidden="true" /> Start free — no credit card required
          </div>
          <h2 id="cta-heading" className="text-3xl sm:text-5xl font-black text-white mb-4">
            Ready to trade at an<br />institutional level?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm">
            Created by <strong className="text-purple-400">Himanshu Bhmniya</strong>. Get instant access with $100,000 in simulated funds. Full platform, zero risk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/terminal"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-sm font-bold text-[#03060d] shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all">
              Start Trading Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/about"
              className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 px-8 py-3.5 text-sm font-bold text-purple-400 hover:bg-purple-500/10 transition-all">
              Meet Himanshu Bhmniya
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-xs text-slate-500 font-mono flex-wrap">
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-500" aria-hidden="true" /> Encrypted sessions</span>
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-cyan-500" aria-hidden="true" /> No KYC required</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-purple-500" aria-hidden="true" /> Instant setup</span>
          </div>
        </div>
      </section>
    </>
  );
}
