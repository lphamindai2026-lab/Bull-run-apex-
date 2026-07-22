'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Award, 
  AlertTriangle,
  Info,
  ChevronRight,
  Eye,
  Activity,
  Smile,
  XCircle,
  TrendingUp as WinIcon
} from 'lucide-react';

interface TradeJournalClientProps {
  user: any;
  journalTrades: any[];
  stats: {
    totalTrades: number;
    winRate: number;
    totalPnl: number;
    averageWin: number;
    averageLoss: number;
    mistakeDistribution: {
      FOMO: number;
      OVER_LEVERAGING: number;
      REVENGE_TRADING: number;
      EARLY_EXIT: number;
      HOPE_TRADING: number;
      NONE: number;
    };
  };
}

export default function TradeJournalClient({ user, journalTrades, stats }: TradeJournalClientProps) {
  const [selectedAuditTrade, setSelectedAuditTrade] = useState<any | null>(null);

  // Simple static month calendar builder for visual evaluation
  const currentMonthYear = 'OCTOBER 2026';
  const calendarDays = Array.from({ length: 30 }).map((_, idx) => {
    const dayNum = idx + 1;
    // Map trades to specific calendar days for high-fidelity visualization
    const tradesOnDay = journalTrades.filter(t => {
      if (!t.closedAt) return false;
      const d = new Date(t.closedAt);
      return d.getDate() === dayNum;
    });

    const netPnl = tradesOnDay.reduce((acc, curr) => acc + parseFloat(curr.pnl || '0'), 0);
    return {
      day: dayNum,
      trades: tradesOnDay,
      netPnl
    };
  });

  return (
    <div className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            AI BEHAVIORAL TRADE JOURNAL
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Relational audit records of completed positions, cognitive bias analytics, and neural system evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-mono">
          <span>Simulation Mode:</span>
          <span className="text-emerald-400 font-bold font-mono">ACTIVE (POSTGRES DB-STORED)</span>
        </div>
      </div>

      {!user ? (
        <div className="rounded-xl border border-slate-800 bg-[#070c18] p-8 text-center max-w-md mx-auto">
          <Info className="h-10 w-10 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Authentication Required</h4>
          <p className="text-xs text-slate-400 mt-2">
            Please log in or click "1-Click Demo" in the navigation bar to provision a trading profile and begin journaling trades with AI psychology audits.
          </p>
        </div>
      ) : journalTrades.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-xl border border-slate-850 bg-[#070c18] p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Award className="h-12 w-12 text-slate-600 mb-3 animate-bounce" />
            <h4 className="text-sm font-bold text-white font-mono uppercase">Your Trade Journal is Currently Empty</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
              You haven't completed any simulated trades yet. Head over to the **Trading Terminal**, execute a buy/sell trade, and then close it to trigger your first AI psychology review!
            </p>
            <a 
              href="/terminal" 
              className="mt-6 inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-xs font-bold rounded-lg transition-all"
            >
              Go to Trading Terminal <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-xl border border-slate-850 bg-[#070c18] p-4 font-mono space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              🧠 WHY AI JOURNALING?
            </span>
            <div className="space-y-3 text-[11px] text-slate-300">
              <p>● <strong>Mistake Analysis:</strong> Pinpoints whether FOMO, panic exits, or sizing mistakes are draining your simulated funds.</p>
              <p>● <strong>Cognitive Tracking:</strong> Logs your exact execution state (e.g. Greed, Calm) to correlate emotions with negative win rates.</p>
              <p>● <strong>Continuous Feedback:</strong> Provides instant personalized neural summaries of your strategies to protect capital.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* STATS ANALYTICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Closed Executions</span>
              <div className="text-3xl font-bold text-white mt-1">{stats.totalTrades}</div>
              <span className="text-[10px] text-slate-500 mt-1">Stored in Postgres</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Calculated Win Rate</span>
              <div className="text-3xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <Percent className="h-6 w-6 text-emerald-400" />
                {stats.winRate}%
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Target threshold: 60%+</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Net Realized Profit</span>
              <div className={`text-2xl font-bold mt-1 ${stats.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Updates live on trade close</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Win / Loss Average Size</span>
              <div className="text-xs space-y-1 mt-1 font-bold">
                <div className="text-emerald-400">Avg Win: +${stats.averageWin.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                <div className="text-rose-400">Avg Loss: -${Math.abs(stats.averageLoss).toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Risk reward balance</span>
            </div>

          </div>

          {/* DUAL CONTENT COLUMN: Cognitive Mistakes Audit & Calendar View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Cognitive Mistakes (Col Span 5) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between font-mono">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  COGNITIVE BIAS & MISTAKE DISTRIBUTION
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                  These metrics illustrate the frequency of psychological trading mistakes committed. Utilize strict stop-losses to counteract these behaviors.
                </p>

                <div className="space-y-3 text-[11px]">
                  {Object.entries(stats.mistakeDistribution).map(([key, count]) => {
                    const pct = stats.totalTrades > 0 ? (count / stats.totalTrades) * 100 : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span className="font-semibold text-slate-200">{key.replace('_', ' ')}</span>
                          <span>{count} times ({Math.round(pct)}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800/85">
                          <div 
                            className={`h-full rounded-full ${
                              key === 'NONE' ? 'bg-emerald-500' : key === 'FOMO' ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 p-2 rounded bg-slate-950/60 border border-slate-850 text-[9px] text-slate-400 leading-relaxed">
                ℹ️ <strong>Quantitative insight:</strong> Reducing <strong>OVER LEVERAGING</strong> and <strong>FOMO</strong> by entering strictly at the <strong>SMC discount Fair Value Gaps</strong> improves profit factor by an average of 42%.
              </div>
            </div>

            {/* Calendar View (Col Span 7 - direct requirement) */}
            <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  MONTHLY PERFORMANCE CALENDAR
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                  {currentMonthYear}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                View your simulated trading P&L mapped on corresponding execution days. High performing days display green indicators.
              </p>

              {/* Grid of Calendar Days */}
              <div className="grid grid-cols-7 gap-2 flex-1">
                {/* Headers */}
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((h) => (
                  <div key={h} className="text-center text-[9px] font-bold text-slate-500 py-1">{h}</div>
                ))}

                {calendarDays.map((dayObj) => {
                  const hasTrades = dayObj.trades.length > 0;
                  const isProfitable = dayObj.netPnl >= 0;
                  
                  return (
                    <div 
                      key={dayObj.day} 
                      className={`min-h-[50px] p-1.5 rounded-lg border flex flex-col justify-between transition-all ${
                        hasTrades 
                          ? isProfitable 
                            ? 'bg-emerald-950/20 border-emerald-500/30' 
                            : 'bg-rose-950/20 border-rose-500/30'
                          : 'bg-slate-950/20 border-slate-900/60 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-[9px] font-extrabold text-slate-400">{dayObj.day}</span>
                      
                      {hasTrades ? (
                        <div className={`text-[8px] font-black text-right truncate ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfitable ? '+' : ''}${Math.round(dayObj.netPnl)}
                        </div>
                      ) : (
                        <span className="text-[7px] text-slate-700 text-right">-</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-[9px] text-slate-500 mt-3 font-semibold">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Profitable Days</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-rose-500 rounded-full" /> Drawdown Days</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-slate-800 rounded-full" /> No Active Closed Positions</span>
              </div>
            </div>

          </div>

          {/* COMPLETED TRADES AUDIT TABLE & DIRECT AI FEEDBACK EXPANSION */}
          <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-4 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-purple-400" />
              POSTGRES RELATIONAL AUDIT LOGS ({journalTrades.length} trades)
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                    <th className="py-2.5">Symbol</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Leverage</th>
                    <th>Entry Price</th>
                    <th>Exit Price</th>
                    <th>PnL ($)</th>
                    <th>Emotion</th>
                    <th>Mistake Committed</th>
                    <th>AI Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {journalTrades.map((t) => {
                    const pnlVal = parseFloat(t.pnl || '0');
                    const isProfit = pnlVal >= 0;
                    return (
                      <tr key={t.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 font-extrabold text-white">{t.symbol}</td>
                        <td className="font-bold">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            t.type === 'BUY' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="text-slate-300">{t.size}</td>
                        <td className="text-slate-300">{t.leverage}x</td>
                        <td className="text-slate-300">${parseFloat(t.entryPrice).toLocaleString()}</td>
                        <td className="text-slate-300">${parseFloat(t.exitPrice || '0').toLocaleString()}</td>
                        <td className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfit ? '+' : ''}${pnlVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-purple-400 font-bold">{t.emotion}</td>
                        <td className="text-slate-400 text-[10px] font-semibold">
                          <span className={`px-1 rounded ${t.mistake === 'NONE' ? 'bg-emerald-950/20 text-emerald-500' : 'bg-rose-950/20 text-rose-400'}`}>
                            {t.mistake || 'NONE'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedAuditTrade(t)}
                            className="bg-purple-950 hover:bg-purple-900 border border-purple-800/40 text-purple-300 px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <Brain className="h-3 w-3 text-purple-400" />
                            View Coach Audit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* AI PSYCHOLOGY FEEDBACK REVIEW POPUP MODAL */}
      {selectedAuditTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl font-mono overflow-y-auto max-h-[85vh]">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Brain className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Apex Quantitative Psychology Review
                  </h3>
                  <p className="text-[10px] text-slate-500">Trade ID: #{selectedAuditTrade.id} | Asset: {selectedAuditTrade.symbol}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAuditTrade(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            {/* Trade specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] p-3 rounded-lg bg-slate-950/60 border border-slate-900 mb-4">
              <div>
                <span className="text-slate-500 block">Execution Setup:</span>
                <span className="text-white font-bold">{selectedAuditTrade.type} {selectedAuditTrade.leverage}x</span>
              </div>
              <div>
                <span className="text-slate-500 block">Lot Position Size:</span>
                <span className="text-white font-bold">{selectedAuditTrade.size} Units</span>
              </div>
              <div>
                <span className="text-slate-500 block">PnL Realized:</span>
                <span className={`font-bold ${parseFloat(selectedAuditTrade.pnl || '0') >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${parseFloat(selectedAuditTrade.pnl || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Emotion & Mistake:</span>
                <span className="text-purple-400 font-bold block">{selectedAuditTrade.emotion} / {selectedAuditTrade.mistake || 'NONE'}</span>
              </div>
            </div>

            {/* AI Review Content block */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-slate-850">
              <span className="text-[10px] font-bold text-slate-400 block border-b border-slate-800 pb-1 flex items-center gap-1">
                <Smile className="h-3.5 w-3.5 text-purple-400" />
                PSYCHOLOGICAL AUDIT COACH FEEDBACK:
              </span>
              <div className="whitespace-pre-wrap font-mono text-[11px]">
                {selectedAuditTrade.aiFeedback || (
                  `Based on the structural coordinates of this trade, our cognitive expert system notes that you executed this setup with a ${selectedAuditTrade.emotion} mindset, logging a mistake of ${selectedAuditTrade.mistake || 'NONE'}. Utilizing leverage above 5x in high momentum volatility sweeps creates extreme psychological friction. Always prioritize placing stop-losses inside Fair Value Gaps and risk strictly 1% of equity.`
                )}
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedAuditTrade(null)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-xs font-bold rounded-lg transition-all"
              >
                Ack Review Log
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
