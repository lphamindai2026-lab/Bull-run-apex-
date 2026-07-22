import { db } from '@/db';
import { appVersions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Zap, Star, Bug, TrendingUp, Shield, Brain } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: "What's New — Platform Updates & Changelog | Bull Run Apex AI",
  description:
    "Stay up to date with the latest Bull Run Apex AI features, improvements, and bug fixes. " +
    "Platform changelog, version history, and upcoming roadmap from founder Himanshu Bhmniya.",
  alternates: { canonical: '/whats-new' },
  openGraph: {
    title:       "What's New — Changelog & Updates | Bull Run Apex AI",
    description: "Latest features and improvements from Bull Run Apex AI v5.0 by Himanshu Bhmniya.",
    images:      [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default async function WhatsNewPage() {
  let versions: any[] = [];
  try {
    versions = await db.select().from(appVersions).orderBy(desc(appVersions.createdAt));
  } catch {}

  const TYPE_COLOR: Record<string,string> = {
    major: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    minor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    patch: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const featureIcons = [TrendingUp, Brain, Shield, Zap, Star, Bug];

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-mono text-emerald-400 mb-4">
          <Zap className="h-3 w-3" /> Platform Updates
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">What's New in Apex AI</h1>
        <p className="text-slate-400 text-sm">Stay up to date with the latest features, improvements and fixes from <span className="text-emerald-400 font-bold">Himanshu Bhmniya</span> and the Apex AI team.</p>
      </div>

      {/* Latest badge */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-[#03060d] font-black text-lg">▲</div>
          <div>
            <p className="text-lg font-black text-white">Bull Run Apex AI v5.0.0</p>
            <p className="text-xs text-emerald-400 font-mono">Latest Release — 2026</p>
          </div>
          <span className="ml-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[10px] font-black text-emerald-400 animate-pulse">LATEST</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {[
            '🎨 Complete UI overhaul',
            '📊 TradingView integration',
            '🧠 Multi-model AI routing',
            '📐 SMC auto-detection engine',
            '📓 Behavioral trade journal',
            '⚙️ Premium Settings page',
            '🔐 Google & GitHub OAuth',
            '🛡️ Rate limiting & 2FA',
            '📱 Full mobile responsive',
          ].map((f,i) => (
            <div key={i} className="rounded-lg border border-emerald-500/10 bg-[var(--apex-bg)]/40 px-3 py-2 text-xs text-slate-300">{f}</div>
          ))}
        </div>
      </div>

      {/* Version history */}
      {versions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">Release History</h2>
          {versions.map((v, i) => (
            <div key={v.id} className="relative pl-8">
              {/* Timeline line */}
              {i < versions.length - 1 && <div className="absolute left-2.5 top-8 bottom-0 w-px bg-[var(--apex-border)]" />}
              {/* Dot */}
              <div className={`absolute left-0 top-2 h-5 w-5 rounded-full border-2 flex items-center justify-center text-[8px] font-black ${v.isLatest ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-[var(--apex-border)] bg-[var(--apex-surface)] text-slate-500'}`}>
                {v.isLatest ? '★' : '○'}
              </div>

              <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-base font-black text-white">v{v.version}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${TYPE_COLOR[v.type] ?? TYPE_COLOR.patch}`}>{v.type}</span>
                  <span className="text-xs text-slate-500 ml-auto">{new Date(v.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{v.title}</h3>
                <div className="space-y-1.5">
                  {v.changelog.split('\n').filter((l:string)=>l.trim()).map((line:string, j:number) => (
                    <p key={j} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                      {line.replace(/^[-•]\s*/,'')}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roadmap */}
      <div className="mt-12 rounded-2xl border border-purple-500/15 bg-purple-500/5 p-6">
        <h2 className="text-base font-black text-white mb-1 flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" /> Coming Next</h2>
        <p className="text-xs text-slate-400 mb-4">Upcoming features from <span className="text-purple-400 font-bold">Himanshu Bhmniya</span>:</p>
        <div className="space-y-2">
          {[
            { title:'Social Trading',    desc:'Follow top traders and copy positions', status:'In Development' },
            { title:'Mobile App',        desc:'Native iOS & Android apps',             status:'Planned' },
            { title:'Advanced Backtesting', desc:'Test strategies on historical data',  status:'In Development' },
            { title:'API Access',        desc:'Full REST & WebSocket API for bots',     status:'Beta' },
          ].map(r => (
            <div key={r.title} className="flex items-center justify-between rounded-xl border border-[var(--apex-border)] bg-[var(--apex-bg)]/40 px-4 py-3">
              <div>
                <p className="text-xs font-bold text-white">{r.title}</p>
                <p className="text-[10px] text-slate-500">{r.desc}</p>
              </div>
              <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
