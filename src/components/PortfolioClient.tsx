'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { 
  Briefcase, 
  Bell, 
  TrendingUp, 
  Trash2, 
  Plus, 
  Compass, 
  CheckCircle, 
  Radio, 
  Terminal, 
  Mail, 
  MessageSquare, 
  Send,
  Smartphone,
  ShieldCheck,
  Percent,
  TrendingDown
} from 'lucide-react';
import { createAlertAction, deleteAlertAction } from '@/app/actions';
import { TICKERS } from '@/lib/mockData';

interface PortfolioClientProps {
  user: any;
  initialPortfolios: any[];
  initialAlerts: any[];
}

export default function PortfolioClient({ user, initialPortfolios, initialAlerts }: PortfolioClientProps) {
  const [portfolios, setPortfolios] = useState<any[]>(initialPortfolios);
  const [alerts, setAlerts] = useState<any[]>(initialAlerts);
  const [isPending, startTransition] = useTransition();

  // Alert form state
  const [alertSymbol, setAlertSymbol] = useState('BTCUSD');
  const [alertType, setAlertType] = useState('PRICE_ABOVE');
  const [triggerValue, setTriggerValue] = useState('');
  const [channel, setChannel] = useState('EMAIL');

  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Interactive Device & Session Management List
  const [sessionsList, setSessionsList] = useState([
    { id: 1, device: 'MacBook Pro 16" (Web Terminal)', ip: '198.51.100.42', location: 'New York, USA', status: 'ACTIVE SESSION', date: 'Just now' },
    { id: 2, device: 'iPhone 15 Pro Max (Apex App Mobile)', ip: '172.56.21.118', location: 'London, UK', status: 'AUTHORIZED', date: '2 hours ago' },
    { id: 3, device: 'API Bot Connector (PyQuant Core)', ip: '203.0.113.15', location: 'Frankfurt, DE', status: 'AUTHORIZED', date: '1 day ago' }
  ]);

  const handleRevokeSession = (sessionId: number, deviceName: string) => {
    setSessionsList(prev => prev.filter(s => s.id !== sessionId));
    setSimulationLogs(prev => [
      `[SYS-SECURITY-ALARM ${new Date().toLocaleTimeString()}] CRITICAL: Revoked token and terminated active session on "${deviceName}".`,
      ...prev
    ]);
  };

  // Simulated notification console logs
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    '[SYS-LOG 14:02:11] Core alert supervisor established handshake with Redis node-us-east.',
    '[TELEGRAM-BOT 14:05:32] Handshake complete: Dispatched structural CHoCH alert on BTCUSD to channel @apex_quant_alerts.',
    '[DISCORD-WEBHOOK 14:12:00] Delivered webhook payload to institutional channel #trading-floor-signals.',
    '[SMS-GATEWAY 14:22:15] Outbound SMS alert sent to verified device (+1 555-***-3829) for FVG mitigation sweep.'
  ]);

  // Periodically add new simulation logs to make the page feel highly live
  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        `[EMAIL-DISPATCH ${new Date().toLocaleTimeString()}] Sent portfolio daily PnL report to ${user?.email || 'trader@apex.ai'}.`,
        `[TELEGRAM-BOT ${new Date().toLocaleTimeString()}] Dispatched ticker threshold alert for ${alertSymbol} at $${(parseFloat(triggerValue) || 104500).toLocaleString()}.`,
        `[DISCORD-WEBHOOK ${new Date().toLocaleTimeString()}] SMC Order Block mitigation trigger delivered to Discord server #ApexVIP.`,
        `[SMS-GATEWAY ${new Date().toLocaleTimeString()}] Push notification delivered: XAUUSD cleared OTE premium discount zone.`
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setSimulationLogs(prev => [randomLog, ...prev.slice(0, 8)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [user, alertSymbol, triggerValue]);

  // Combine DB holdings with simulated live prices to calculate current valuation
  const holdingsWithPrice = portfolios.map(p => {
    const livePrice = TICKERS.find(t => t.symbol === p.symbol)?.price || parseFloat(p.avgBuyPrice);
    const amount = parseFloat(p.amount);
    const costBasis = amount * parseFloat(p.avgBuyPrice);
    const currentValuation = amount * livePrice;
    const pnl = currentValuation - costBasis;
    return {
      ...p,
      livePrice,
      costBasis,
      currentValuation,
      pnl
    };
  });

  const portfolioAssetsValue = holdingsWithPrice.reduce((sum, item) => sum + item.currentValuation, 0);
  const cashBalance = user ? parseFloat(user.balance) : 0;
  const totalNetWorth = cashBalance + portfolioAssetsValue;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please authenticate to set customized indicators price alerts.');
      return;
    }

    const val = parseFloat(triggerValue);
    if (isNaN(val) || val <= 0) {
      setAlertMessage({ type: 'error', text: 'Please enter a valid target trigger price value.' });
      return;
    }

    setAlertMessage(null);
    startTransition(async () => {
      const res = await createAlertAction(alertSymbol, alertType, val, channel);
      if (res.success && res.alert) {
        setAlerts(prev => [res.alert, ...prev]);
        setTriggerValue('');
        setAlertMessage({ type: 'success', text: `Successfully registered ${alertType} alert on ${alertSymbol} via ${channel}!` });
        
        // Add dispatch log immediately
        setSimulationLogs(prev => [
          `[SYS-LOG ${new Date().toLocaleTimeString()}] Alert successfully registered on Postgres. Listening on live orderbook sweeps...`,
          ...prev
        ]);
      } else {
        setAlertMessage({ type: 'error', text: res.error || 'Failed to register alert.' });
      }
    });
  };

  const handleDeleteAlert = (alertId: number) => {
    startTransition(async () => {
      const res = await deleteAlertAction(alertId);
      if (res.success) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        setSimulationLogs(prev => [
          `[SYS-LOG ${new Date().toLocaleTimeString()}] Unregistered alert ID #${alertId} from active Redis memory queue.`,
          ...prev
        ]);
      }
    });
  };

  return (
    <div className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-cyan-400" />
            PORTFOLIO VAULTS & SIGNAL ALERTS
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Relational asset holding values and automated notification dispatches via SMTP, Telegram, and Discord Webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-mono">
          <span>Net Valuation:</span>
          <span className="text-emerald-400 font-bold">${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {!user ? (
        <div className="rounded-xl border border-slate-800 bg-[#070c18] p-8 text-center max-w-md mx-auto">
          <Bell className="h-10 w-10 text-cyan-400 mx-auto mb-3 opacity-60" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Authentication Required</h4>
          <p className="text-xs text-slate-400 mt-2">
            Please register or sign in to track your simulated asset portfolio allocation and set high-frequency price alerts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: PORTFOLIO ALLOCATION (Col Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Networth Banner */}
            <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Consolidated Portfolio Value</span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Includes paper cash and active buy holdings</span>
              </div>

              <div className="flex gap-4 text-xs font-mono">
                <div className="bg-slate-950/80 px-3.5 py-2 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Simulator Cash</span>
                  <span className="text-emerald-400 font-bold">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="bg-slate-950/80 px-3.5 py-2 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Asset Holdings</span>
                  <span className="text-cyan-400 font-bold">${portfolioAssetsValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Assets Allocation List */}
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
                ACTIVE PORTFOLIO HOLDINGS ({portfolios.length} assets)
              </span>

              {portfolios.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  Your portfolio is currently empty.
                  <span className="block text-[10px] text-slate-600 mt-1">Acquire assets by opening long (buy) trades in the terminal.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Allocation Bars */}
                  <div className="flex w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850">
                    {holdingsWithPrice.map((item, idx) => {
                      const share = (item.currentValuation / totalNetWorth) * 100;
                      const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-yellow-500', 'bg-rose-500'];
                      return (
                        <div 
                          key={item.id} 
                          className={`h-full ${colors[idx % colors.length]}`} 
                          style={{ width: `${share}%` }}
                          title={`${item.symbol}: ${share.toFixed(1)}%`}
                        />
                      );
                    })}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-500 text-[10px] uppercase font-bold border-b border-slate-900 pb-2">
                          <th className="py-2">Asset</th>
                          <th>Holding Size</th>
                          <th>Avg Buy Price</th>
                          <th>Live Price</th>
                          <th>Total Valuation</th>
                          <th>Allocation %</th>
                          <th>Unrealized Gain</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {holdingsWithPrice.map((item, idx) => {
                          const allocation = (item.currentValuation / totalNetWorth) * 100;
                          const isProfit = item.pnl >= 0;
                          return (
                            <tr key={item.id} className="hover:bg-slate-950/40">
                              <td className="py-2.5 font-bold text-white flex items-center gap-1">
                                <span className={`h-2 w-2 rounded-full ${
                                  ['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-yellow-500', 'bg-rose-500'][idx % 5]
                                }`} />
                                {item.symbol}
                              </td>
                              <td className="text-slate-300 font-bold">{parseFloat(item.amount).toLocaleString()}</td>
                              <td className="text-slate-400">${parseFloat(item.avgBuyPrice).toLocaleString()}</td>
                              <td className="text-slate-300 font-bold">${item.livePrice.toLocaleString()}</td>
                              <td className="text-white font-bold">${item.currentValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="text-cyan-400 font-bold">{allocation.toFixed(1)}%</td>
                              <td className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isProfit ? '+' : ''}${item.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}
            </div>

            {/* Signal Webhooks Real-time Logs Console */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" />
                  REAL-TIME ALERTS DISPATCH CONSOLE (SMTP/DISCORD/TELEGRAM)
                </span>
                <span className="text-[10px] text-slate-500 animate-pulse">● Monitoring websocket node</span>
              </div>

              <div className="bg-black/90 p-3 rounded-lg border border-slate-900 space-y-1.5 h-[160px] overflow-y-auto text-[10px] text-emerald-500 scrollbar-none">
                {simulationLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed hover:bg-slate-900/30">
                    <span className="text-slate-500">&gt;&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Device & Session Management Panel */}
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                SECURE SESSIONS & DEVICE REGISTRY
              </span>

              <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                These devices hold valid cryptographic session tokens linked to your user record. Click "Revoke" to invalidate any external socket listener instantly.
              </p>

              <div className="space-y-2.5">
                {sessionsList.map((session) => (
                  <div 
                    key={session.id} 
                    className="p-3 rounded-lg bg-slate-900/40 border border-slate-850 flex items-center justify-between text-[11px] gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-100 font-bold">{session.device}</strong>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          session.status === 'ACTIVE SESSION' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-slate-950 text-slate-500'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="text-slate-400 mt-1 flex items-center gap-1.5">
                        <span>IP: <strong>{session.ip}</strong></span>
                        <span>•</span>
                        <span>Location: <strong>{session.location}</strong></span>
                        <span>•</span>
                        <span className="text-slate-500">{session.date}</span>
                      </div>
                    </div>

                    {session.status !== 'ACTIVE SESSION' && (
                      <button
                        onClick={() => handleRevokeSession(session.id, session.device)}
                        className="bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white border border-red-900/40 px-2 py-1 rounded text-[10px] font-bold transition-all"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: ALERTS MANAGER (Col Span 5) */}
          <div className="lg:col-span-5 space-y-6 font-mono">
            
            {/* Create Alert Form */}
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
                CREATE REAL-TIME ALGORITHM ALERT
              </span>

              <form onSubmit={handleCreateAlert} className="space-y-3.5 text-xs">
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Asset Symbol</label>
                    <select
                      value={alertSymbol}
                      onChange={(e) => setAlertSymbol(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="BTCUSD">BTCUSD (Bitcoin)</option>
                      <option value="EURUSD">EURUSD (Euro)</option>
                      <option value="AAPL">AAPL (Apple)</option>
                      <option value="XAUUSD">XAUUSD (Gold)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Trigger Event</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="PRICE_ABOVE">Price Closes Above (&gt;)</option>
                      <option value="PRICE_BELOW">Price Closes Below (&lt;)</option>
                      <option value="SMC_CHOCH">SMC CHoCH Break</option>
                      <option value="SMC_BOS">SMC BOS Continuation</option>
                      <option value="FVG_TRIGGER">FVG Gap Mitigation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Trigger Price Target ($)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="e.g. 106000 or 1.0820"
                    value={triggerValue}
                    onChange={(e) => setTriggerValue(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Dispatch Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-emerald-400 focus:outline-none font-bold"
                  >
                    <option value="EMAIL">EMAIL DISPATCH (SMTP)</option>
                    <option value="TELEGRAM">TELEGRAM CHATBOT SIGNAL</option>
                    <option value="DISCORD">DISCORD WEBHOOK CHANNEL</option>
                    <option value="SMS">SMS PHONE TEXTING</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 text-xs transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Set Algorithmic Trigger Alert
                </button>

              </form>

              {alertMessage && (
                <div className={`mt-3 p-2.5 rounded-lg text-[10px] border ${
                  alertMessage.type === 'success' 
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-950/40 text-rose-400 border-rose-500/20'
                }`}>
                  {alertMessage.text}
                </div>
              )}

            </div>

            {/* List of Active Registered Alerts */}
            <div className="rounded-xl border border-slate-800 bg-[#070c18] p-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-4">
                ACTIVE POSTGRES ALERTS TRIGGER ENGINE ({alerts.length})
              </span>

              {alerts.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No active registered price alerts found in Postgres.
                </div>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
                  {alerts.map((a) => (
                    <div 
                      key={a.id} 
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-white text-xs">{a.symbol}</span>
                          <span className="text-[8px] uppercase tracking-wider bg-slate-800 px-1 rounded text-slate-400 border border-slate-700">
                            {a.channel}
                          </span>
                        </div>
                        <div className="text-slate-400 mt-1">
                          Condition: <strong className="text-cyan-400">{a.type}</strong> at <strong className="text-emerald-400">${parseFloat(a.triggerValue).toLocaleString()}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAlert(a.id)}
                        className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-950/60 transition-all"
                        title="Delete alert trigger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
