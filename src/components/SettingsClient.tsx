'use client';

import React, { useState, useTransition } from 'react';
import {
  User, Shield, Bell, Palette, DollarSign, Brain,
  Key, Trash2, Save, Check, Copy, ExternalLink,
  MessageSquare, Smartphone, Mail,
  Eye, EyeOff, RefreshCw, AlertTriangle, Zap,
  Globe, Clock, CreditCard, ChevronRight
} from 'lucide-react';
import {
  toggle2FaAction,
  updateProfileAction,
  updateBalanceAction,
  updateNotificationsAction,
} from '@/app/actions';
import FounderPhoto from '@/components/FounderPhoto';

interface Props { user: any; }

const SECTIONS = [
  { id: 'profile',       icon: User,         label: 'Profile' },
  { id: 'account',       icon: DollarSign,   label: 'Paper Trading' },
  { id: 'security',      icon: Shield,       label: 'Security & 2FA' },
  { id: 'notifications', icon: Bell,         label: 'Notifications' },
  { id: 'ai',            icon: Brain,        label: 'AI Preferences' },
  { id: 'appearance',    icon: Palette,      label: 'Appearance' },
  { id: 'social',        icon: ExternalLink, label: 'Social & Links' },
  { id: 'danger',        icon: AlertTriangle,label: 'Danger Zone' },
];

export default function SettingsClient({ user }: Props) {
  const [section, setSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [isPending, startTx] = useTransition();
  const [msg, setMsg] = useState<{type:'success'|'error';text:string}|null>(null);
  const [copied, setCopied] = useState(false);

  // Profile form state
  const [name, setName] = useState(user.name ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [timezone, setTimezone] = useState(user.timezone ?? 'UTC');
  const [currency, setCurrency] = useState(user.currency ?? 'USD');

  // Balance
  const [newBalance, setNewBalance] = useState('');

  // Notifications
  const [emailNotif, setEmailNotif]  = useState(user.emailNotifications ?? true);
  const [telegramNotif, setTelegramNotif] = useState(user.telegramNotifications ?? false);
  const [discordNotif, setDiscordNotif]  = useState(user.discordNotifications ?? false);

  // AI
  const [aiMemory, setAiMemory]    = useState(user.aiMemoryEnabled ?? true);
  const [defaultModel, setDefaultModel] = useState('Gemini 1.5 Pro');

  // Security
  const [showSecret, setShowSecret] = useState(false);

  const show = (type:'success'|'error', text:string) => {
    setMsg({type,text});
    setTimeout(() => setMsg(null), 4000);
  };

  const handleSaveProfile = () => {
    startTx(async () => {
      const res = await updateProfileAction(name, bio, timezone, currency) as any;
      if (res.success) show('success', 'Profile updated successfully!');
      else show('error', res.error || 'Update failed.');
    });
  };

  const handleBalanceTopUp = () => {
    const val = parseFloat(newBalance);
    if (isNaN(val) || val <= 0 || val > 10000000) {
      show('error', 'Enter a valid amount between $1 and $10,000,000.');
      return;
    }
    startTx(async () => {
      const res = await updateBalanceAction(val) as any;
      if (res.success) { show('success', `✓ Balance set to $${val.toLocaleString()}`); setNewBalance(''); }
      else show('error', res.error || 'Failed.');
    });
  };

  const handle2FA = () => {
    startTx(async () => {
      const res = await toggle2FaAction() as any;
      if (res.success) show('success', `2FA ${res.enabled ? 'enabled' : 'disabled'}.`);
      else show('error', res.error || 'Failed.');
    });
  };

  const handleSaveNotifications = () => {
    startTx(async () => {
      const res = await updateNotificationsAction(emailNotif, telegramNotif, discordNotif) as any;
      if (res.success) show('success', 'Notification preferences saved!');
      else show('error', res.error || 'Failed.');
    });
  };

  const handleCopyAffiliateCode = () => {
    navigator.clipboard.writeText(user.affiliateCode ?? 'APEX-DEMO');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Section = ({ children }: {children:React.ReactNode}) => (
    <div className="space-y-6">{children}</div>
  );

  const Card = ({ title, desc, children }: {title:string;desc?:string;children:React.ReactNode}) => (
    <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {desc && <p className="text-xs text-slate-400 mt-1">{desc}</p>}
      </div>
      {children}
    </div>
  );

  const Field = ({ label, children }: {label:string;children:React.ReactNode}) => (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full rounded-xl border border-[var(--apex-border)] bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all";

  return (
    <div className="flex h-full min-h-screen">

      {/* Settings sidebar */}
      <div className="w-56 shrink-0 border-r border-[var(--apex-border)] bg-[#03060d]/60 p-4 hidden sm:flex flex-col">
        <div className="mb-6">
          <h1 className="text-base font-black text-white">Settings</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Manage your account</p>
        </div>
        <nav className="flex-1 space-y-0.5">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition-all ${
                  active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}>
                <Icon className="h-4 w-4 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-4 pt-4 border-t border-[var(--apex-border)] text-[10px] text-slate-600 font-mono">
          <p>Account ID: #{user.id}</p>
          <p>Role: {user.role.toUpperCase()}</p>
          <p>Joined: {new Date(user.createdAt ?? Date.now()).getFullYear()}</p>
        </div>
      </div>

      {/* Mobile section selector */}
      <div className="sm:hidden w-full border-b border-[var(--apex-border)] bg-[#03060d]/60 p-3">
        <select value={section} onChange={e=>setSection(e.target.value)}
          className="w-full rounded-xl border border-[var(--apex-border)] bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none">
          {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-3xl">

        {/* Global message */}
        {msg && (
          <div className={`mb-6 flex items-center gap-2 rounded-xl border p-3.5 text-sm font-semibold ${
            msg.type==='success' ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' : 'bg-rose-950/30 border-rose-500/20 text-rose-400'
          }`}>
            {msg.type==='success' ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {msg.text}
          </div>
        )}

        {/* ── PROFILE ── */}
        {section === 'profile' && (
          <Section>
            <Card title="Public Profile" desc="This information appears on your trading profile.">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border-2 border-emerald-500/20 flex items-center justify-center text-2xl font-black text-emerald-400">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user.name ?? 'Trader'}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <p className="text-[10px] text-slate-600 mt-1 font-mono">ID: #{user.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Field label="Display Name">
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your trading name" className={inputCls} />
                </Field>
                <Field label="Bio">
                  <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} placeholder="Tell the community about your trading style..." className={`${inputCls} resize-none`} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Timezone">
                    <select value={timezone} onChange={e=>setTimezone(e.target.value)} className={inputCls}>
                      {['UTC','America/New_York','America/Los_Angeles','Europe/London','Europe/Berlin','Asia/Kolkata','Asia/Tokyo','Asia/Singapore'].map(tz=>(
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Currency">
                    <select value={currency} onChange={e=>setCurrency(e.target.value)} className={inputCls}>
                      {['USD','EUR','GBP','JPY','INR','AUD','CAD','SGD'].map(c=>(
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              <button onClick={handleSaveProfile} disabled={isPending}
                className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#03060d] transition-all disabled:opacity-50">
                <Save className="h-4 w-4" />
                {isPending ? 'Saving…' : 'Save Profile'}
              </button>
            </Card>

            <Card title="Affiliate Program" desc="Share your referral code and earn rewards.">
              <div className="flex items-center gap-3 rounded-xl bg-slate-900/60 border border-[var(--apex-border)] p-4">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Your Referral Code</p>
                  <p className="text-lg font-black text-white font-mono tracking-widest mt-0.5">{user.affiliateCode ?? 'APEX-DEMO'}</p>
                </div>
                <button onClick={handleCopyAffiliateCode}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition-all">
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-3">Each successful referral gives your friend <span className="text-emerald-400 font-bold">+$5,000</span> simulation balance.</p>
            </Card>
          </Section>
        )}

        {/* ── PAPER TRADING ── */}
        {section === 'account' && (
          <Section>
            <Card title="Simulation Account Balance" desc="Adjust your paper trading balance for testing different strategies.">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-5">
                <p className="text-[10px] font-mono text-slate-500 uppercase">Current Balance</p>
                <p className="text-4xl font-black text-emerald-400 mt-1 tabular-nums">
                  ${parseFloat(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 mt-1">Paper trading funds only — no real money involved</p>
              </div>

              <Field label="Set New Balance (USD)">
                <div className="flex gap-3">
                  <input type="number" min="1" max="10000000" step="1000" value={newBalance}
                    onChange={e=>setNewBalance(e.target.value)} placeholder="e.g. 500000"
                    className={`${inputCls} flex-1`} />
                  <button onClick={handleBalanceTopUp} disabled={isPending || !newBalance}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#03060d] transition-all disabled:opacity-40 whitespace-nowrap flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Set Balance
                  </button>
                </div>
              </Field>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[100000, 500000, 1000000, 10000000].map(amt => (
                  <button key={amt} onClick={()=>setNewBalance(amt.toString())}
                    className="rounded-xl border border-[var(--apex-border)] bg-slate-900/40 hover:bg-slate-900 py-2.5 text-xs font-bold text-slate-300 transition-all hover:text-white hover:border-emerald-500/30">
                    ${(amt/1000).toFixed(0)}K
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">Demo Mode Active</span>
                </div>
                <p className="text-xs text-slate-400">All features including AI, charts, journal and alerts are completely free in demo mode. No subscription required.</p>
              </div>
            </Card>

            <Card title="Account Statistics" desc="Your trading performance overview.">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Account ID',    val: `#${user.id}`,         color: 'text-white' },
                  { label: 'Plan',          val: user.subscriptionTier.toUpperCase(), color: 'text-cyan-400' },
                  { label: 'Role',          val: user.role.toUpperCase(), color: 'text-purple-400' },
                  { label: '2FA Status',    val: user.twoFaEnabled ? 'ENABLED' : 'DISABLED', color: user.twoFaEnabled ? 'text-emerald-400' : 'text-rose-400' },
                  { label: 'Affiliate',     val: user.affiliateCode ?? 'N/A', color: 'text-yellow-400' },
                  { label: 'Referred By',   val: user.referredBy ?? 'Organic', color: 'text-slate-400' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-3">
                    <p className="text-[9px] font-mono text-slate-500 uppercase">{stat.label}</p>
                    <p className={`text-xs font-black mt-1 font-mono ${stat.color}`}>{stat.val}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Section>
        )}

        {/* ── SECURITY ── */}
        {section === 'security' && (
          <Section>
            <Card title="Two-Factor Authentication" desc="Add an extra layer of security to your account.">
              <div className={`rounded-xl border p-5 mb-5 ${user.twoFaEnabled ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-[var(--apex-border)] bg-slate-900/40'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{user.twoFaEnabled ? '✓ 2FA is Active' : '2FA is Disabled'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {user.twoFaEnabled ? 'Your account is protected with two-factor authentication.' : 'Enable 2FA for stronger account security.'}
                    </p>
                  </div>
                  <button onClick={handle2FA} disabled={isPending}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${user.twoFaEnabled ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20 hover:bg-rose-950' : 'bg-emerald-500 text-[#03060d] hover:bg-emerald-400'}`}>
                    {isPending ? 'Updating…' : user.twoFaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
                {user.twoFaEnabled && (
                  <div className="mt-4 rounded-lg bg-[var(--apex-bg)] border border-[var(--apex-border)] p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Demo 2FA Code</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black text-emerald-400 font-mono tracking-[0.3em]">
                        {showSecret ? '123456' : '••••••'}
                      </p>
                      <button onClick={() => setShowSecret(s=>!s)} className="text-slate-500 hover:text-slate-300">
                        {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-1">Use this code when prompted during login</p>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Active Sessions" desc="Manage devices logged in to your account.">
              <div className="space-y-3">
                {[
                  { device: 'Current Browser', ip: '198.51.100.1', location: 'Active Now', current: true },
                  { device: 'Mobile Device',   ip: '172.56.21.9',  location: '2h ago',      current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{s.device}</span>
                        {s.current && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">CURRENT</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">IP: {s.ip} · {s.location}</p>
                    </div>
                    {!s.current && (
                      <button className="rounded-lg bg-rose-950/40 text-rose-400 border border-rose-500/20 px-3 py-1.5 text-xs font-bold hover:bg-rose-950 transition-all">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Password" desc="Change your account password.">
              <div className="space-y-3">
                <Field label="Current Password">
                  <input type="password" placeholder="••••••••" className={inputCls} />
                </Field>
                <Field label="New Password">
                  <input type="password" placeholder="••••••••" className={inputCls} />
                </Field>
                <Field label="Confirm New Password">
                  <input type="password" placeholder="••••••••" className={inputCls} />
                </Field>
                <button className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-sm font-bold text-white transition-all border border-[var(--apex-border)]">
                  Change Password
                </button>
              </div>
            </Card>
          </Section>
        )}

        {/* ── NOTIFICATIONS ── */}
        {section === 'notifications' && (
          <Section>
            <Card title="Notification Channels" desc="Choose how you want to receive alerts and updates.">
              <div className="space-y-4">
                {[
                  { key:'email', label:'Email Notifications', desc:'Price alerts, trade closes, system updates', icon:Mail, val:emailNotif, fn:setEmailNotif },
                  { key:'telegram', label:'Telegram Alerts', desc:'Instant alerts via @lphamindai_bot', icon:MessageSquare, val:telegramNotif, fn:setTelegramNotif },
                  { key:'discord', label:'Discord Webhooks', desc:'Alerts sent to your Discord channel', icon:MessageSquare, val:discordNotif, fn:setDiscordNotif },
                ].map(n => {
                  const Icon = n.icon;
                  return (
                    <div key={n.key} className="flex items-center justify-between rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{n.label}</p>
                          <p className="text-xs text-slate-500">{n.desc}</p>
                        </div>
                      </div>
                      <button onClick={()=>n.fn(!n.val)}
                        className={`relative h-6 w-11 rounded-full transition-all duration-300 ${n.val ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${n.val ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button onClick={handleSaveNotifications} disabled={isPending}
                className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#03060d] transition-all disabled:opacity-50">
                <Save className="h-4 w-4" />
                {isPending ? 'Saving…' : 'Save Preferences'}
              </button>
            </Card>

            <Card title="Alert Types" desc="Control which types of alerts you receive.">
              <div className="space-y-3">
                {['Price Alerts','SMC Pattern Detection','Trade Closes','News Events','System Updates'].map(type => (
                  <div key={type} className="flex items-center justify-between py-2 border-b border-[var(--apex-border)] last:border-0">
                    <span className="text-sm text-slate-300">{type}</span>
                    <button className="relative h-5 w-9 rounded-full bg-emerald-500">
                      <span className="absolute top-0.5 left-[18px] h-4 w-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </Section>
        )}

        {/* ── AI PREFERENCES ── */}
        {section === 'ai' && (
          <Section>
            <Card title="AI Model Preferences" desc="Configure your default AI assistant behavior.">
              <div className="space-y-4">
                <Field label="Default AI Model">
                  <select value={defaultModel} onChange={e=>setDefaultModel(e.target.value)} className={inputCls}>
                    <option>Gemini 1.5 Pro</option>
                    <option>Claude 3.5 Sonnet</option>
                    <option>GPT-4o Enterprise</option>
                    <option>Multi-Model Auto-Route</option>
                  </select>
                </Field>

                <div className="flex items-center justify-between rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-4">
                  <div>
                    <p className="text-sm font-bold text-white">AI Memory</p>
                    <p className="text-xs text-slate-500">Remember context from previous conversations</p>
                  </div>
                  <button onClick={()=>setAiMemory(!aiMemory)}
                    className={`relative h-6 w-11 rounded-full transition-all duration-300 ${aiMemory ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${aiMemory ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label:'Trading Psychology Coach', active:true },
                    { label:'Pine Script Generator', active:true },
                    { label:'Chart Screenshot Analysis', active:true },
                    { label:'PDF Document Analysis', active:true },
                    { label:'Voice Chat', active:true },
                  ].map(f => (
                    <div key={f.label} className="flex items-center justify-between py-2 border-b border-[var(--apex-border)] last:border-0">
                      <span className="text-sm text-slate-300">{f.label}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${f.active?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':'bg-slate-800 text-slate-500 border-slate-700/40'}`}>
                        {f.active?'ENABLED':'DISABLED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Prompt Library" desc="Save your frequently used AI prompts.">
              <div className="space-y-2 text-xs font-mono">
                {[
                  'Generate Pine Script v5 SMC strategy with Order Blocks and FVG',
                  'Analyze my last 10 trades and identify psychological patterns',
                  'What is the institutional bias for BTCUSDT on H4?',
                  'Explain the difference between BOS and CHoCH in SMC',
                  'Calculate position size for 1% risk on XAUUSD',
                ].map((prompt, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-3 group hover:border-emerald-500/20 transition-all">
                    <span className="flex-1 text-slate-400 group-hover:text-slate-200 transition-colors truncate">{prompt}</span>
                    <a href={`/ai-assistant`} className="shrink-0 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded-xl border border-dashed border-[var(--apex-border)] py-3 text-xs text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-all">
                + Add Custom Prompt
              </button>
            </Card>
          </Section>
        )}

        {/* ── APPEARANCE ── */}
        {section === 'appearance' && (
          <Section>
            <Card title="Theme" desc="The platform uses a premium dark theme optimized for trading.">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Dark (Default)', preview: 'bg-[#03060d]', active: true },
                  { name: 'Midnight Blue', preview: 'bg-[#050a1a]', active: false },
                ].map(t => (
                  <button key={t.name}
                    className={`rounded-2xl border-2 p-4 text-left transition-all ${t.active ? 'border-emerald-500' : 'border-[var(--apex-border)] hover:border-slate-600'}`}>
                    <div className={`${t.preview} h-16 rounded-lg mb-3 border border-[var(--apex-border)] flex items-center justify-center`}>
                      <div className="w-8 h-1 rounded bg-emerald-500/60" />
                    </div>
                    <p className="text-xs font-bold text-white">{t.name}</p>
                    {t.active && <p className="text-[10px] text-emerald-400 mt-0.5">Active</p>}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400/80">
                Theme switching is coming in v5.1. The premium dark theme is currently the default and optimized for trading.
              </div>
            </Card>

            <Card title="Display Preferences" desc="Customize how data is displayed.">
              <div className="space-y-3">
                {[
                  { label:'Compact Mode', desc:'Denser layout for more data' },
                  { label:'Animations', desc:'Enable smooth transitions' },
                  { label:'Price Color Coding', desc:'Red/green P&L highlights' },
                  { label:'Show Portfolio Value', desc:'Display balance in header' },
                ].map(pref => (
                  <div key={pref.label} className="flex items-center justify-between py-2 border-b border-[var(--apex-border)] last:border-0">
                    <div>
                      <p className="text-sm text-white">{pref.label}</p>
                      <p className="text-[10px] text-slate-500">{pref.desc}</p>
                    </div>
                    <button className="relative h-5 w-9 rounded-full bg-emerald-500">
                      <span className="absolute top-0.5 left-[18px] h-4 w-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </Section>
        )}

        {/* ── SOCIAL ── */}
        {section === 'social' && (
          <Section>
            <Card title="Himanshu Bhmniya — Official Links" desc="Connect with the founder of Bull Run Apex AI.">
              <div className="space-y-3">
                {[
                  { name:'Instagram', handle:'@legacy_boy_1', url:'https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==', color:'text-pink-400', bg:'bg-pink-500/10', border:'border-pink-500/20' },
                  { name:'Telegram Bot', handle:'@lphamindai_bot', url:'https://t.me/lphamindai_bot', color:'text-blue-400', bg:'bg-blue-500/10', border:'border-blue-500/20' },
                  { name:'WhatsApp Channel', handle:'Bull Run Apex AI', url:'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i', color:'text-green-400', bg:'bg-green-500/10', border:'border-green-500/20' },
                  { name:'Email Support', handle:'bullrunapex@gmail.com', url:'mailto:bullrunapex@gmail.com', color:'text-emerald-400', bg:'bg-emerald-500/10', border:'border-emerald-500/20' },
                ].map(link => (
                  <a key={link.name} href={link.url} target={link.url.startsWith('http')?'_blank':undefined} rel="noopener noreferrer"
                    className={`flex items-center justify-between rounded-xl border ${link.border} ${link.bg} p-4 hover:opacity-80 transition-all`}>
                    <div>
                      <p className={`text-sm font-bold ${link.color}`}>{link.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{link.handle}</p>
                    </div>
                    <ExternalLink className={`h-4 w-4 ${link.color}`} />
                  </a>
                ))}
              </div>
            </Card>

            <Card title="About the Creator" desc="Learn more about the founder.">
              <div className="flex items-start gap-4">
                <FounderPhoto size="lg" showBorder showGlow className="shrink-0" />
                <div>
                  <p className="text-base font-black text-white">Himanshu Bhmniya</p>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">Founder & CEO · Bull Run Apex AI</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Visionary founder building the world's most advanced AI-powered institutional trading platform. Passionate about quantitative finance, AI, and democratizing professional trading tools.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <a href="https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==" target="_blank" rel="noopener noreferrer"
                      className="rounded-lg border border-pink-500/20 bg-pink-500/10 px-3 py-1.5 text-xs font-bold text-pink-400 hover:opacity-80 transition-all">Instagram</a>
                    <a href="https://t.me/lphamindai_bot" target="_blank" rel="noopener noreferrer"
                      className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400 hover:opacity-80 transition-all">Telegram</a>
                  </div>
                </div>
              </div>
            </Card>
          </Section>
        )}

        {/* ── DANGER ZONE ── */}
        {section === 'danger' && (
          <Section>
            <Card title="Reset Paper Trading Account" desc="Reset your simulation balance to $100,000 and clear all open positions.">
              <button onClick={()=>{ setNewBalance('100000'); handleBalanceTopUp(); }} className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 px-5 py-2.5 text-sm font-bold hover:bg-amber-500/10 transition-all">
                <RefreshCw className="h-4 w-4" />
                Reset to $100,000
              </button>
            </Card>

            <Card title="Export Data" desc="Download all your trading data, journal entries and chat history.">
              <button className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] bg-slate-900/40 text-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-900 transition-all">
                Export All Data (JSON)
              </button>
            </Card>

            <Card title="Delete Account" desc="Permanently delete your account and all associated data. This cannot be undone.">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 mb-4">
                <p className="text-xs text-rose-400 font-semibold">⚠ This will permanently delete your account, trades, journal, and chat history.</p>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-400 px-5 py-2.5 text-sm font-bold hover:bg-rose-950 transition-all">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </Card>
          </Section>
        )}
      </div>
    </div>
  );
}
