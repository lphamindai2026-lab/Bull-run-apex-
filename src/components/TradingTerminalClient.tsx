'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import {
  Activity, Sliders, BookOpen, Layers, Flame,
  Calendar, Sparkles, Info, Award, Brain,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ChevronDown, Zap, Globe, BarChart3
} from 'lucide-react';
import { TICKERS, ECONOMIC_CALENDAR, WHALE_TRACKER, MOCK_SMC_STRUCTURES, generateDOM } from '@/lib/mockData';
import { openSimTradeAction, closeSimTradeAction } from '@/app/actions';
import TradingViewWidget from '@/components/TradingViewWidget';
import { runSMCEngine } from '@/lib/smcEngine';

interface Props { user: any; initialOpenTrades: any[]; }

export default function TradingTerminalClient({ user, initialOpenTrades }: Props) {
  const [selectedSymbol, setSelectedSymbol]   = useState('BTCUSD');
  const [timeframe,      setTimeframe]         = useState('1H');
  const [tickers,        setTickers]           = useState(TICKERS);
  const [openTrades,     setOpenTrades]        = useState<any[]>(initialOpenTrades);
  const [chartMode,      setChartMode]         = useState<'TV'|'SMC'>('TV');

  // SMC toggles
  const [showOB,  setShowOB]  = useState(true);
  const [showFVG, setShowFVG] = useState(true);
  const [showBOS, setShowBOS] = useState(true);

  // Order form
  const [side,       setSide]       = useState<'BUY'|'SELL'>('BUY');
  const [size,       setSize]       = useState(0.1);
  const [leverage,   setLeverage]   = useState(10);
  const [sl,         setSl]         = useState('');
  const [tp,         setTp]         = useState('');
  const [emotion,    setEmotion]    = useState('CALM');
  const [notes,      setNotes]      = useState('');

  // Close modal
  const [closeId,      setCloseId]      = useState<number|null>(null);
  const [closeMistake, setCloseMistake] = useState('NONE');

  const [msg,       setMsg]       = useState<{type:'success'|'error';text:string}|null>(null);
  const [isPending, startTx]      = useTransition();

  const active = tickers.find(t => t.symbol === selectedSymbol) ?? tickers[0];

  // Live tick engine
  useEffect(() => {
    const id = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const d = (Math.random() - 0.488) * 0.06;
        return {
          ...t,
          price: +(t.price * (1 + d / 100)).toFixed(t.price > 1000 ? 1 : t.price > 1 ? 3 : 5),
          change: +(t.change + d * 14).toFixed(2),
        };
      }));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Auto-fill SL/TP on asset or side change
  useEffect(() => {
    const p = active.price;
    setSl(side === 'BUY' ? (p * 0.95).toFixed(p > 1000 ? 0 : 2) : (p * 1.05).toFixed(p > 1000 ? 0 : 2));
    setTp(side === 'BUY' ? (p * 1.12).toFixed(p > 1000 ? 0 : 2) : (p * 0.88).toFixed(p > 1000 ? 0 : 2));
  }, [selectedSymbol, side]);

  // Derived calculations
  const notional      = size * active.price;
  const margin        = notional / leverage;
  const slRisk        = sl ? Math.abs(parseFloat(sl) - active.price) * size * leverage : 0;
  const tpReward      = tp ? Math.abs(parseFloat(tp) - active.price) * size * leverage : 0;
  const rr            = slRisk > 0 ? (tpReward / slRisk).toFixed(2) : '—';

  // SMC from engine
  const seedCandles = Array.from({ length: 18 }, (_, i) => {
    const p = active.price;
    const o = p * (1 + (Math.sin(i * 1.2) * 0.008 + (i - 9) * 0.002));
    const c = p * (1 + (Math.cos(i * 1.1) * 0.006 + (i - 9) * 0.0015));
    return { open: o, high: Math.max(o,c)*1.003, low: Math.min(o,c)*0.997, close: i===17?p:c, time: `${i}:00` };
  });
  const smcData = runSMCEngine(seedCandles);

  const smcTags = [
    ...smcData.bos.map(b => ({ label: `BOS ${b.type.toUpperCase()}`, color: b.type==='bullish'?'emerald':'rose' })),
    ...smcData.choch.map(c => ({ label: `CHoCH ${c.type.toUpperCase()}`, color: c.type==='bullish'?'cyan':'orange' })),
    ...smcData.fvg.map(f => ({ label: `FVG ${f.type.toUpperCase()}`, color: f.type==='bullish'?'yellow':'purple' })),
    ...smcData.orderBlocks.map(o => ({ label: `OB ${o.type.toUpperCase()}`, color: o.type==='demand'?'emerald':'rose' })),
  ].slice(0, 6);

  // DOM
  const dom = generateDOM(active.price, active.price > 10000 ? 10 : active.price > 100 ? 0.5 : 0.005);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setMsg({ type:'error', text:'Please log in to place trades.' }); return; }
    setMsg(null);
    startTx(async () => {
      const res = await openSimTradeAction(
        active.symbol, active.category, side,
        size, active.price, leverage,
        sl ? parseFloat(sl) : null,
        tp ? parseFloat(tp) : null,
        emotion, notes
      ) as any;
      if (res.success) {
        setMsg({ type:'success', text:`✓ ${side} ${size} ${active.symbol} @ $${active.price.toLocaleString()}` });
        if (res.trade) setOpenTrades(p => [res.trade, ...p]);
        setNotes('');
      } else {
        setMsg({ type:'error', text: res.error ?? 'Execution failed.' });
      }
    });
  };

  const handleClose = () => {
    if (!closeId) return;
    startTx(async () => {
      const res = await closeSimTradeAction(closeId, active.price, closeMistake) as any;
      if (res.success) {
        setOpenTrades(p => p.filter(t => t.id !== closeId));
        setMsg({ type:'success', text:`Position closed. PnL: ${res.pnl >= 0 ? '+' : ''}$${parseFloat(res.pnl).toFixed(2)}` });
        setCloseId(null);
      } else {
        setMsg({ type:'error', text: res.error ?? 'Failed to close.' });
      }
    });
  };

  const TF = ['1M','5M','15M','1H','4H','1D','1W'];

  return (
    <div className="flex-1 p-3 grid grid-cols-1 xl:grid-cols-12 gap-3 max-w-[1800px] mx-auto w-full">

      {/* ═══ LEFT: Watchlist + Whale Tracker ═══ */}
      <div className="xl:col-span-2 flex flex-col gap-3">

        {/* Watchlist */}
        <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] flex flex-col" style={{height:440}}>
          <div className="flex items-center gap-2 border-b border-[var(--apex-border)] px-3 py-2.5">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider">Markets</span>
            <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-1.5 space-y-0.5">
            {tickers.map(t => {
              const active_  = t.symbol === selectedSymbol;
              const up = t.change >= 0;
              return (
                <button key={t.symbol} onClick={() => setSelectedSymbol(t.symbol)}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-all ${active_ ? 'bg-emerald-500/10 border-l-2 border-emerald-500 pl-2' : 'hover:bg-slate-900/60 border-l-2 border-transparent'}`}>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">{t.symbol}</div>
                    <div className="text-[9px] text-slate-500 uppercase">{t.category}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono tabular-nums ${active_ ? 'text-emerald-400' : 'text-slate-200'}`}>
                      ${t.price.toLocaleString('en-US', { minimumFractionDigits: t.price > 100 ? 0 : 4 })}
                    </div>
                    <div className={`text-[9px] font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {up?'▲':'▼'} {Math.abs(t.change).toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Whale Tracker */}
        <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] flex flex-col" style={{maxHeight:320}}>
          <div className="flex items-center gap-2 border-b border-[var(--apex-border)] px-3 py-2.5">
            <Flame className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
            <span className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider">Whale Tracker</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
            {WHALE_TRACKER.map(w => (
              <div key={w.id} className="rounded-lg bg-slate-900/50 border border-[var(--apex-border)] p-2 text-[10px] font-mono">
                <div className="flex justify-between mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${w.type==='WITHDRAWAL'?'bg-amber-950 text-amber-400':'bg-indigo-950 text-indigo-400'}`}>{w.type}</span>
                  <span className="text-slate-500">{w.time}</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>{w.amount}</span><span className="text-emerald-400">{w.value}</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate">{w.fromTo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CENTER: Chart + DOM + Calendar ═══ */}
      <div className="xl:col-span-7 flex flex-col gap-3">

        {/* Chart panel */}
        <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] flex flex-col" style={{minHeight:480}}>

          {/* Chart toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--apex-border)] px-3 py-2.5">
            {/* Symbol + price */}
            <div className="flex items-center gap-2 mr-2">
              <span className="text-base font-black text-white font-mono">{active.symbol}</span>
              <span className={`text-sm font-bold font-mono tabular-nums ${active.change>=0?'text-emerald-400':'text-rose-400'}`}>
                ${active.price.toLocaleString('en-US',{minimumFractionDigits:active.price>100?1:4})}
              </span>
              <span className={`text-xs font-bold ${active.change>=0?'text-emerald-400':'text-rose-400'}`}>
                {active.change>=0?'▲':'▼'} {Math.abs(active.change).toFixed(2)}%
              </span>
            </div>

            {/* Chart mode toggle */}
            <div className="flex rounded-lg bg-slate-950/60 border border-[var(--apex-border)] p-0.5">
              <button onClick={()=>setChartMode('TV')} className={`px-3 py-1 rounded text-[11px] font-bold font-mono transition-all ${chartMode==='TV'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}>
                📊 TradingView
              </button>
              <button onClick={()=>setChartMode('SMC')} className={`px-3 py-1 rounded text-[11px] font-bold font-mono transition-all ${chartMode==='SMC'?'bg-slate-800 text-emerald-400':'text-slate-500 hover:text-slate-300'}`}>
                📐 SMC Overlay
              </button>
            </div>

            {/* Timeframes (only for SMC mode) */}
            {chartMode==='SMC' && (
              <div className="flex rounded-lg bg-slate-950/60 border border-[var(--apex-border)] p-0.5">
                {TF.map(tf => (
                  <button key={tf} onClick={()=>setTimeframe(tf)}
                    className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${timeframe===tf?'bg-slate-800 text-emerald-400':'text-slate-500 hover:text-slate-300'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            )}

            {/* SMC overlays */}
            {chartMode==='SMC' && (
              <div className="flex gap-1 ml-auto">
                {[['OB','OB Block',showOB,setShowOB,'emerald'],['FVG','FVG Zone',showFVG,setShowFVG,'yellow'],['BOS','CHoCH/BOS',showBOS,setShowBOS,'cyan']].map(([k,label,val,fn,col]:any) => (
                  <button key={k} onClick={()=>fn(!val)}
                    className={`px-2 py-1 text-[9px] font-mono font-bold rounded border transition-all ${val?`bg-${col}-950/50 text-${col}-400 border-${col}-800/60`:'bg-slate-950 text-slate-600 border-slate-800'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chart body */}
          <div className="flex-1 relative min-h-[380px]">
            {chartMode==='TV' ? (
              <div className="absolute inset-0">
                <TradingViewWidget symbol={selectedSymbol} />
              </div>
            ) : (
              <div className="absolute inset-0 p-3">
                <SMCChart active={active} showOB={showOB} showFVG={showFVG} showBOS={showBOS} smcTags={smcTags} seedCandles={seedCandles} />
              </div>
            )}
          </div>
        </div>

        {/* DOM + Calendar row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* DOM */}
          <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] flex flex-col" style={{height:260}}>
            <div className="flex items-center gap-2 border-b border-[var(--apex-border)] px-3 py-2.5">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider">Order Book / DOM</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-none p-2 font-mono text-[10px]">
              {dom.filter(r=>r.type==='ASK').map((r,i) => (
                <div key={i} className="relative flex justify-between px-2 py-0.5 text-rose-400">
                  <div className="absolute inset-y-0 right-0 bg-rose-950/15 rounded" style={{width:`${Math.min(100,(r.size/150)*100)}%`}} />
                  <span className="z-10">${r.price.toLocaleString()}</span>
                  <span className="z-10">{r.size}</span>
                </div>
              ))}
              <div className="flex justify-between px-2 py-1.5 border-y border-[var(--apex-border)] font-bold text-slate-200 bg-slate-900/40">
                <span>Mid:</span>
                <span className="text-cyan-400">${active.price.toLocaleString('en-US',{minimumFractionDigits:1})}</span>
              </div>
              {dom.filter(r=>r.type==='BID').map((r,i) => (
                <div key={i} className="relative flex justify-between px-2 py-0.5 text-emerald-400">
                  <div className="absolute inset-y-0 right-0 bg-emerald-950/15 rounded" style={{width:`${Math.min(100,(r.size/150)*100)}%`}} />
                  <span className="z-10">${r.price.toLocaleString()}</span>
                  <span className="z-10">{r.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Economic Calendar */}
          <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] flex flex-col" style={{height:260}}>
            <div className="flex items-center gap-2 border-b border-[var(--apex-border)] px-3 py-2.5">
              <Calendar className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider">Economic Calendar</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1.5">
              {ECONOMIC_CALENDAR.map(e => (
                <div key={e.id} className="p-2 rounded-lg bg-slate-900/50 border border-[var(--apex-border)] text-[10px] font-mono">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-slate-400 font-bold">{e.time} | {e.currency}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${e.importance==='HIGH'?'bg-rose-950 text-rose-400 animate-pulse':'bg-amber-950 text-amber-400'}`}>
                      {e.importance}
                    </span>
                  </div>
                  <div className="text-slate-200 font-semibold truncate">{e.event}</div>
                  <div className="flex gap-3 text-slate-500 mt-0.5">
                    <span>F: {e.forecast}</span><span>P: {e.previous}</span>
                    {e.actual && <span className="text-emerald-400 font-bold">A: {e.actual}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT: Order Form + Open Positions ═══ */}
      <div className="xl:col-span-3 flex flex-col gap-3">

        {/* Order Form */}
        <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] flex flex-col">
          <div className="flex items-center gap-2 border-b border-[var(--apex-border)] px-3 py-2.5">
            <Sliders className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider">Execute Order</span>
            {!user && <span className="ml-auto text-[9px] text-amber-400 font-mono">Login required</span>}
          </div>

          <div className="p-3">
            {/* BUY / SELL toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['BUY','SELL'] as const).map(s => (
                <button key={s} onClick={()=>setSide(s)}
                  className={`py-2.5 rounded-lg text-xs font-black transition-all ${side===s ? (s==='BUY'?'bg-emerald-500 text-[#03060d] glow-emerald':'bg-rose-500 text-white shadow-lg shadow-rose-500/20') : 'bg-slate-900 text-slate-400 hover:text-white border border-[var(--apex-border)]'}`}>
                  {s==='BUY'?'LONG ▲':'SHORT ▼'}
                </button>
              ))}
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs font-mono">
              {/* Size */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Position Size</span><span className="text-slate-500">Contracts</span>
                </div>
                <input type="number" step="0.01" min="0.01" required value={size}
                  onChange={e=>setSize(parseFloat(e.target.value)||0.01)}
                  className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900 px-3 py-2 text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all" />
              </div>

              {/* Leverage */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Leverage</span><span className={`font-bold ${leverage>25?'text-rose-400':leverage>10?'text-amber-400':'text-emerald-400'}`}>{leverage}×</span>
                </div>
                <input type="range" min="1" max="100" value={leverage}
                  onChange={e=>setLeverage(+e.target.value)}
                  className="w-full accent-emerald-500 cursor-pointer" />
                <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
                  <span>1×</span><span>25×</span><span>50×</span><span>100×</span>
                </div>
              </div>

              {/* SL / TP */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-rose-400/80 mb-1">Stop Loss</div>
                  <input type="number" step="0.01" value={sl} onChange={e=>setSl(e.target.value)}
                    className="w-full rounded-lg border border-rose-900/40 bg-rose-950/10 px-2.5 py-1.5 text-rose-400 focus:outline-none focus:border-rose-500/40 transition-all" />
                </div>
                <div>
                  <div className="text-emerald-400/80 mb-1">Take Profit</div>
                  <input type="number" step="0.01" value={tp} onChange={e=>setTp(e.target.value)}
                    className="w-full rounded-lg border border-emerald-900/40 bg-emerald-950/10 px-2.5 py-1.5 text-emerald-400 focus:outline-none focus:border-emerald-500/40 transition-all" />
                </div>
              </div>

              {/* Emotion */}
              <div>
                <div className="flex items-center gap-1 text-slate-400 mb-1"><Brain className="h-3 w-3 text-purple-400" />Emotion State</div>
                <select value={emotion} onChange={e=>setEmotion(e.target.value)}
                  className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900 px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/40 transition-all">
                  <option value="CALM">😌 Calm / Objective</option>
                  <option value="DISCIPLINED">🎯 Disciplined / Pre-planned</option>
                  <option value="GREEDY">🤑 Greedy / Overconfident</option>
                  <option value="FEARFUL">😨 Fearful / Hesitant</option>
                  <option value="ANXIOUS">😰 Anxious / FOMO</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <div className="text-slate-400 mb-1">Trade Notes</div>
                <textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)}
                  placeholder="e.g. Entering off H1 OB discount zone, swept EQL..."
                  className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900 px-2.5 py-1.5 text-slate-300 placeholder-slate-700 focus:outline-none resize-none transition-all text-[11px]" />
              </div>

              {/* Calculator summary */}
              <div className="rounded-lg bg-slate-950/60 border border-[var(--apex-border)] p-2.5 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-slate-500">Notional</span><span className="text-slate-200 font-bold">${notional.toLocaleString('en-US',{maximumFractionDigits:2})}</span></div>
                <div className="flex justify-between"><span className="text-emerald-400">Margin Required</span><span className="text-emerald-400 font-bold">${margin.toLocaleString('en-US',{maximumFractionDigits:2})}</span></div>
                {slRisk>0 && <div className="flex justify-between"><span className="text-rose-400">Risk (SL)</span><span className="text-rose-400 font-bold">-${slRisk.toLocaleString('en-US',{maximumFractionDigits:2})}</span></div>}
                {tpReward>0 && <div className="flex justify-between"><span className="text-emerald-400">Reward (TP)</span><span className="text-emerald-400 font-bold">+${tpReward.toLocaleString('en-US',{maximumFractionDigits:2})}</span></div>}
                {slRisk>0 && tpReward>0 && <div className="flex justify-between border-t border-[var(--apex-border)] pt-1"><span className="text-cyan-400 font-bold">R:R Ratio</span><span className="text-cyan-400 font-bold">1:{rr}</span></div>}
              </div>

              <button type="submit" disabled={isPending}
                className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${side==='BUY'?'bg-emerald-500 text-[#03060d] hover:bg-emerald-400 glow-emerald':'bg-rose-500 text-white hover:bg-rose-400'} disabled:opacity-50`}>
                {isPending ? <><Zap className="h-3.5 w-3.5 animate-spin" />Executing…</> : <><TrendingUp className="h-3.5 w-3.5" />{side} {active.symbol} · {leverage}×</>}
              </button>
            </form>

            {msg && (
              <div className={`mt-3 rounded-lg border p-2.5 text-[11px] font-mono ${msg.type==='success'?'bg-emerald-950/30 border-emerald-500/20 text-emerald-400':'bg-rose-950/30 border-rose-500/20 text-rose-400'}`}>
                {msg.text}
              </div>
            )}
          </div>
        </div>

        {/* Open Positions */}
        <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] flex flex-col flex-1" style={{minHeight:240}}>
          <div className="flex items-center gap-2 border-b border-[var(--apex-border)] px-3 py-2.5">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider">Open Positions</span>
            {openTrades.length > 0 && <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">{openTrades.length}</span>}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
            {openTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Info className="h-8 w-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-600">No open positions</p>
                <p className="text-[10px] text-slate-700 mt-1">Place a trade above to start</p>
              </div>
            ) : (
              openTrades.map(t => {
                const entry = parseFloat(t.entryPrice);
                const cur = tickers.find(tk=>tk.symbol===t.symbol)?.price ?? entry;
                const pnl = (t.type==='BUY' ? cur-entry : entry-cur) * parseFloat(t.size) * t.leverage;
                const profit = pnl >= 0;
                return (
                  <div key={t.id} className="rounded-xl bg-slate-900/60 border border-[var(--apex-border)] p-3 font-mono text-[11px]">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${t.type==='BUY'?'bg-emerald-950 text-emerald-400':'bg-rose-950 text-rose-400'}`}>{t.type}</span>
                        <span className="font-bold text-white">{t.symbol}</span>
                        <span className="text-slate-500">{t.leverage}×</span>
                      </div>
                      <span className={`text-xs font-bold tabular-nums ${profit?'text-emerald-400':'text-rose-400'}`}>
                        {profit?'+':''}{pnl.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 mb-2">
                      <span>Size: <b className="text-slate-200">{t.size}</b></span>
                      <span>Entry: <b className="text-slate-200">${entry.toLocaleString()}</b></span>
                      <span>Now: <b className="text-slate-200">${cur.toLocaleString()}</b></span>
                      <span>Mood: <b className="text-purple-400">{t.emotion}</b></span>
                    </div>
                    <button onClick={()=>setCloseId(t.id)}
                      className="w-full rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 border border-[var(--apex-border)] text-slate-300 py-1.5 text-[10px] font-bold transition-all">
                      Close Position
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ═══ CLOSE MODAL ═══ */}
      {closeId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--apex-border)] bg-[#07101f] p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">Trade Closing Audit</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Log any behavioral mistake to improve your AI coaching profile. Our engine will analyze your performance immediately.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1.5">Behavioral Mistake Committed</label>
                <select value={closeMistake} onChange={e=>setCloseMistake(e.target.value)}
                  className="w-full rounded-lg border border-[var(--apex-border)] bg-slate-900 px-3 py-2.5 text-sm text-white focus:outline-none">
                  <option value="NONE">✅ None — executed perfectly</option>
                  <option value="FOMO">📈 FOMO — chased a move</option>
                  <option value="OVER_LEVERAGING">⚠️ Over-leveraged — exceeded risk limit</option>
                  <option value="REVENGE_TRADING">😤 Revenge trading — after a loss</option>
                  <option value="EARLY_EXIT">🏃 Early exit — panicked out</option>
                  <option value="HOPE_TRADING">🙏 Hope trading — removed stop-loss</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setCloseId(null)} className="flex-1 rounded-lg border border-[var(--apex-border)] bg-slate-900 text-slate-300 py-2.5 text-xs font-bold hover:bg-slate-800 transition-all">Cancel</button>
                <button onClick={handleClose} disabled={isPending} className="flex-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#03060d] py-2.5 text-xs font-black transition-all disabled:opacity-50">
                  {isPending ? 'Closing…' : 'Close & Get AI Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SMC Canvas Overlay Chart ── */
function SMCChart({ active, showOB, showFVG, showBOS, smcTags, seedCandles }: any) {
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-950/50 border border-[var(--apex-border)]">
      {/* Grid */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 pointer-events-none">
        {Array.from({length:48}).map((_,i) => <div key={i} className="border-r border-b border-slate-900/40" />)}
      </div>

      {/* SMC Zones */}
      {showOB  && <div className="absolute left-[12%] right-[30%] top-[55%] h-[18%] border border-dashed border-emerald-500/50 bg-emerald-500/4 pointer-events-none z-10 flex items-center px-2"><span className="text-[8px] font-mono text-emerald-400 font-bold bg-slate-950/80 px-1 rounded">H4 DEMAND OB</span></div>}
      {showFVG  && <div className="absolute left-[40%] right-[15%] top-[28%] h-[10%] border border-dashed border-yellow-500/50 bg-yellow-500/4 pointer-events-none z-10 flex items-center px-2"><span className="text-[8px] font-mono text-yellow-400 font-bold bg-slate-950/80 px-1 rounded">H1 BULLISH FVG</span></div>}
      {showBOS && <>
        <div className="absolute left-[5%] right-[58%] top-[70%] border-t border-dashed border-rose-500/50 pointer-events-none z-10"><span className="absolute -top-3.5 left-2 text-[7px] font-mono text-rose-400 font-bold bg-slate-950 px-1 rounded">M15 CHoCH</span></div>
        <div className="absolute left-[45%] right-[5%] top-[22%] border-t border-dashed border-cyan-400/50 pointer-events-none z-10"><span className="absolute -top-3.5 left-2 text-[7px] font-mono text-cyan-400 font-bold bg-slate-950 px-1 rounded">H1 BOS</span></div>
      </>}

      {/* Candles */}
      <div className="absolute inset-0 flex items-end justify-between px-4 pb-8 pt-12 z-20">
        {seedCandles.map((c:any, i:number) => {
          const maxP = Math.max(...seedCandles.map((x:any)=>x.high));
          const minP = Math.min(...seedCandles.map((x:any)=>x.low));
          const range = maxP - minP || 1;
          const scale = (p:number) => ((p - minP) / range) * 100;
          const bodyH = Math.max(2, Math.abs(scale(c.close) - scale(c.open)));
          const bodyB = Math.min(scale(c.open), scale(c.close));
          const bull  = c.close >= c.open;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative" style={{height:'100%'}}>
              <div className={`absolute w-[1px] ${bull?'bg-emerald-500/60':'bg-rose-500/60'}`} style={{bottom:`${scale(c.low)}%`,height:`${scale(c.high)-scale(c.low)}%`}} />
              <div className={`w-[70%] absolute rounded-[1px] ${bull?'bg-emerald-500':'bg-rose-500'} hover:opacity-80 transition-opacity`} style={{bottom:`${bodyB}%`,height:`${bodyH}%`}} />
            </div>
          );
        })}
      </div>

      {/* Current price line */}
      <div className="absolute right-0 left-0 border-t border-dashed border-cyan-500/40 z-30" style={{bottom:'45%'}}>
        <span className="absolute right-2 -top-3.5 text-[9px] font-mono font-bold text-cyan-400 bg-slate-950 px-1 rounded border border-cyan-900/40">
          ${active.price.toLocaleString('en-US',{minimumFractionDigits:active.price>100?0:3})}
        </span>
      </div>

      {/* SMC tag badges */}
      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 z-30">
        <span className="text-[8px] font-mono text-slate-500 flex items-center gap-1"><Sparkles className="h-2.5 w-2.5 text-cyan-400" />AUTO-DETECTED:</span>
        {smcTags.map((tag:any,i:number) => (
          <span key={i} className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border bg-${tag.color}-950/30 text-${tag.color}-400 border-${tag.color}-900/30`}>{tag.label}</span>
        ))}
      </div>
    </div>
  );
}
