import { Metadata } from 'next';
import FounderPhoto from '@/components/FounderPhoto';
import {
  Star, Zap, TrendingUp, Brain, Shield, Globe,
  ExternalLink, Mail, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Himanshu Bhmniya — Founder & CEO | Bull Run Apex AI',
  description:
    'Meet Himanshu Bhmniya, founder and CEO of Bull Run Apex AI — the world\'s most advanced AI-powered institutional trading platform. ' +
    'Contact: bullrunapex@gmail.com · Instagram: @legacy_boy_1 · Telegram: @lphamindai_bot.',
  alternates: { canonical: '/about' },
  openGraph: {
    title:       'About Himanshu Bhmniya — Founder & CEO | Bull Run Apex AI',
    description: 'Meet Himanshu Bhmniya, founder of Bull Run Apex AI. Building the world\'s most advanced AI trading platform.',
    images:      [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Himanshu Bhmniya — Founder of Bull Run Apex AI' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'About Himanshu Bhmniya — Founder of Bull Run Apex AI',
    description: 'Meet the founder building the world\'s most advanced AI trading platform.',
    images:      ['/og-image.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">

      {/* ── HERO SECTION ── */}
      <div className="relative rounded-3xl border border-purple-500/15 bg-gradient-to-br from-purple-950/30 via-[var(--apex-surface)] to-[var(--apex-surface)] overflow-hidden mb-12 p-8 sm:p-14">
        {/* BG glow */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-500/8 blur-[60px]" />
        </div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Photo */}
          <div className="shrink-0 relative">
            <FounderPhoto size="xl" showBorder showGlow />
            {/* Verified badge */}
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 border-2 border-[var(--apex-bg)] text-[#03060d] text-xs font-black shadow-lg">
              ✓
            </div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-mono text-purple-400 mb-4">
              <Star className="h-3 w-3" /> Verified Founder
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-2">
              Himanshu Bhmniya
            </h1>
            <p className="text-purple-400 font-bold text-base sm:text-lg font-mono mb-4">
              Founder & CEO — Bull Run Apex AI
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Visionary entrepreneur and quantitative finance innovator building the world's most advanced AI-powered institutional trading platform. Passionate about democratizing professional-grade trading tools for every trader on the planet.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 mt-6 justify-center sm:justify-start">
              <a href="https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-pink-500/25 bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-400 hover:opacity-80 transition-all">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                @legacy_boy_1
              </a>
              <a href="https://t.me/lphamindai_bot" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400 hover:opacity-80 transition-all">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram Bot
              </a>
              <a href="https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400 hover:opacity-80 transition-all">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href="mailto:bullrunapex@gmail.com"
                className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:opacity-80 transition-all">
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Platform Version',   val: 'v5.0',        color: 'text-emerald-400' },
          { label: 'AI Models Integrated', val: '4+',        color: 'text-purple-400' },
          { label: 'Markets Covered',    val: '14',          color: 'text-cyan-400' },
          { label: 'Sim Start Balance',  val: '$100K',       color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-5 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── ABOUT THE PLATFORM ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-base font-black text-white">The Vision</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Himanshu Bhmniya created Bull Run Apex AI with a single mission: to give every trader access to institutional-grade tools that were previously only available to hedge funds and professional trading desks.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mt-3">
            By combining real-time Smart Money Concepts automation, multi-model AI coaching, behavioral psychology tracking, and professional TradingView charts into one unified platform — the playing field is now level.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-base font-black text-white">The Technology</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Built with Next.js 15, PostgreSQL, Drizzle ORM, and integrated with Google Gemini, Claude, and GPT-4o — the platform leverages cutting-edge AI to provide real-time market analysis, Pine Script generation, and personalized trading coaching.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mt-3">
            Enterprise security standards including PBKDF2 hashing, HMAC signed sessions, rate limiting, XSS protection, and comprehensive audit logging keep your data safe.
          </p>
        </div>
      </div>

      {/* ── FOUNDER QUOTE ── */}
      <div className="relative rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-[var(--apex-surface)] p-8 sm:p-10 mb-12 overflow-hidden">
        <div aria-hidden className="absolute top-4 right-4 text-[100px] leading-none text-purple-500/5 font-black select-none">"</div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <FounderPhoto size="md" showBorder showGlow />
          <div>
            <blockquote className="text-lg sm:text-xl font-bold text-white leading-relaxed italic mb-4">
              "Trading without understanding market structure is gambling. Bull Run Apex AI gives traders the institutional edge — automated SMC detection, AI psychology coaching, and real-time market intelligence — all in one place."
            </blockquote>
            <p className="text-purple-400 font-bold text-sm">— Himanshu Bhmniya</p>
            <p className="text-slate-500 text-xs mt-0.5">Founder & CEO, Bull Run Apex AI</p>
          </div>
        </div>
      </div>

      {/* ── FEATURE HIGHLIGHTS ── */}
      <div className="mb-12">
        <h2 className="text-xl font-black text-white mb-6 text-center">Platform Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, title: 'Live TradingView Charts', desc: 'Full interactive charts with 100+ indicators, drawing tools, and multi-timeframe SMC auto-detection.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Brain,      title: 'Multi-Model AI Routing', desc: 'Seamlessly switch between Gemini, Claude, and GPT-4o for trading analysis, Pine Script, and psychology coaching.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Shield,     title: 'Enterprise Security',   desc: 'PBKDF2 hashing, HMAC sessions, rate limiting, 2FA, OAuth, and comprehensive security audit trails.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { icon: Globe,      title: '14 Global Markets',     desc: 'Crypto, Forex, Stocks, Gold, Silver, Oil, and Indices — all in one unified scanner and terminal.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { icon: Zap,        title: 'Behavioral Journal',    desc: 'Track emotions, mistakes, and patterns. Get AI psychology coaching on every closed trade.', color: 'text-rose-400', bg: 'bg-rose-500/10' },
            { icon: Star,       title: 'Always Free Demo',      desc: 'Start with $100,000 simulation funds. Every feature is accessible in demo mode — no credit card required.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-5 hover:border-slate-600 transition-all">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${f.bg} mb-3`}>
                  <Icon className={`h-4.5 w-4.5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-[var(--apex-surface)] p-8 text-center">
        <FounderPhoto size="sm" showBorder showGlow className="mx-auto mb-4" />
        <h2 className="text-xl font-black text-white mb-2">Start Trading with Apex AI Today</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Join the platform built by <span className="text-emerald-400 font-bold">Himanshu Bhmniya</span> to trade smarter, learn faster, and grow consistently.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/terminal"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-[#03060d] hover:opacity-90 transition-all">
            Launch Terminal <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/support"
            className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] bg-slate-900/40 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-900 transition-all">
            Contact Himanshu
          </Link>
        </div>
      </div>

    </div>
  );
}
