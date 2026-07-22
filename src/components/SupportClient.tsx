'use client';

import React, { useState, useTransition } from 'react';
import {
  HelpCircle, MessageSquare, Bug, Star, Lightbulb,
  Mail, Send, CheckCircle, ChevronDown, ChevronUp,
  ExternalLink, Brain, BookOpen, TrendingUp, Shield
} from 'lucide-react';
import { submitTicketAction, submitFeedbackAction } from '@/app/actions';
import FounderPhoto from '@/components/FounderPhoto';

interface Props { user: any; }

const FAQS = [
  { q: 'How do I start paper trading?', a: 'Click "1-Click Demo" in the navigation or sign up for a free account. You\'ll receive $100,000 in simulation funds immediately. Head to the Trading Terminal to open positions.' },
  { q: 'What is Smart Money Concepts (SMC)?', a: 'SMC is a trading methodology used by institutional traders. It focuses on Order Blocks, Fair Value Gaps, Break of Structure (BOS), Change of Character (CHoCH), and liquidity concepts. Our platform auto-detects these on charts.' },
  { q: 'How does the AI Psychology Coach work?', a: 'When you close a trade, you\'re asked to log your emotion and any mistakes made. The AI analyzes your trading patterns over time and provides personalized coaching to improve your decision-making.' },
  { q: 'Can I adjust my simulation balance?', a: 'Yes! Go to Settings → Paper Trading and set any balance between $1 and $10,000,000 for testing purposes. All features are free in demo mode.' },
  { q: 'Which AI models are supported?', a: 'We support Google Gemini 1.5 Pro, Claude 3.5 Sonnet, GPT-4o Enterprise, and a Multi-Model Auto-Route system that selects the best model for each query type.' },
  { q: 'How do I enable 2FA?', a: 'Go to Settings → Security and click "Enable 2FA". In demo mode, the verification code is 123456. In production, you\'d use a TOTP app like Google Authenticator.' },
  { q: 'How do I contact Himanshu Bhmniya?', a: 'You can reach the founder via Instagram @legacy_boy_1, Telegram @lphamindai_bot, WhatsApp channel, or email at bullrunapex@gmail.com.' },
  { q: 'Is my trading data safe?', a: 'Yes. All data is stored in a secure PostgreSQL database. Passwords are hashed with PBKDF2 (SHA-512). Sessions use HMAC-SHA256 signed cookies. The platform implements XSS and SQL injection protection.' },
];

export default function SupportClient({ user }: Props) {
  const [activeTab,  setActiveTab]  = useState<'faq'|'contact'|'feedback'>('faq');
  const [openFaq,    setOpenFaq]    = useState<number|null>(null);
  const [isPending,  startTx]       = useTransition();
  const [success,    setSuccess]    = useState(false);

  // Contact form
  const [subject,  setSubject]  = useState('');
  const [message,  setMessage]  = useState('');
  const [category, setCategory] = useState('general');

  // Feedback form
  const [fbType,    setFbType]    = useState('suggestion');
  const [fbSubject, setFbSubject] = useState('');
  const [fbMessage, setFbMessage] = useState('');
  const [fbRating,  setFbRating]  = useState(5);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert('Please sign in to submit a support ticket.'); return; }
    startTx(async () => {
      const res = await submitTicketAction(subject, message) as any;
      if (res.success) { setSuccess(true); setSubject(''); setMessage(''); }
    });
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert('Please sign in to submit feedback.'); return; }
    startTx(async () => {
      const res = await submitFeedbackAction(fbType, fbSubject, fbMessage, fbRating) as any;
      if (res.success) { setSuccess(true); setFbSubject(''); setFbMessage(''); }
    });
  };

  const inputCls = "w-full rounded-xl border border-[var(--apex-border)] bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all";

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-mono text-cyan-400 mb-4">
          <HelpCircle className="h-3 w-3" /> Help Center
        </div>
        <h1 className="text-3xl font-black text-white mb-2">How can we help you?</h1>
        <p className="text-slate-400 text-sm">Get help from the <span className="text-emerald-400 font-bold">Bull Run Apex AI</span> team or browse our FAQ.</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon:TrendingUp, label:'Terminal Guide',   href:'/terminal',     color:'text-emerald-400' },
          { icon:Brain,      label:'AI Chat Help',     href:'/ai-assistant', color:'text-purple-400' },
          { icon:BookOpen,   label:'Journal Tutorial', href:'/journal',      color:'text-cyan-400' },
          { icon:Shield,     label:'Security Help',    href:'/settings',     color:'text-amber-400' },
        ].map(l => {
          const Icon = l.icon;
          return (
            <a key={l.label} href={l.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-4 hover:border-slate-600 transition-all text-center">
              <Icon className={`h-6 w-6 ${l.color}`} />
              <span className="text-xs font-semibold text-slate-300">{l.label}</span>
            </a>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[var(--apex-border)] bg-slate-950/60 p-1 mb-6">
        {[
          { id:'faq',      label:'FAQ',            icon:HelpCircle },
          { id:'contact',  label:'Contact Support', icon:Mail },
          { id:'feedback', label:'Send Feedback',   icon:Star },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id as any);setSuccess(false);}}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${activeTab===tab.id?'bg-slate-900 text-white':'text-slate-500 hover:text-slate-300'}`}>
              <Icon className="h-3.5 w-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 overflow-hidden">
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-900/40 transition-all">
                <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                {openFaq===i ? <ChevronUp className="h-4 w-4 text-emerald-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />}
              </button>
              {openFaq===i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-6">
              <h2 className="text-base font-bold text-white mb-4">Submit a Support Ticket</h2>

              {success ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mb-3" />
                  <p className="text-base font-bold text-white">Ticket Submitted!</p>
                  <p className="text-sm text-slate-400 mt-1">We'll get back to you at <span className="text-emerald-400">{user?.email}</span></p>
                  <button onClick={()=>setSuccess(false)} className="mt-4 text-xs text-slate-500 hover:text-slate-300 underline">Submit another ticket</button>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)} className={inputCls}>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Subscriptions</option>
                      <option value="trading">Trading Terminal</option>
                      <option value="ai">AI Features</option>
                      <option value="account">Account & Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Subject</label>
                    <input value={subject} onChange={e=>setSubject(e.target.value)} required placeholder="Brief description of your issue" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Message</label>
                    <textarea value={message} onChange={e=>setMessage(e.target.value)} required rows={5} placeholder="Describe your issue in detail..." className={`${inputCls} resize-none`} />
                  </div>
                  {!user && <p className="text-xs text-amber-400">⚠ You must be signed in to submit a ticket.</p>}
                  <button type="submit" disabled={isPending || !user}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#03060d] font-bold py-3 text-sm transition-all disabled:opacity-50">
                    <Send className="h-4 w-4" />
                    {isPending ? 'Submitting…' : 'Send Support Request'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-purple-500/15 bg-purple-500/5 p-5 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <FounderPhoto size="sm" showBorder showGlow />
                <div>
                  <p className="text-sm font-black text-white">Himanshu Bhmniya</p>
                  <p className="text-[10px] text-purple-400 font-mono">Founder · Bull Run Apex AI</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have a question or issue? Reach out directly to the founder. Response within 24 hours guaranteed.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-5">
              <h3 className="text-sm font-bold text-white mb-3">Direct Contact</h3>
              <div className="space-y-3">
                {[
                  { icon:'📧', label:'Email', value:'bullrunapex@gmail.com', href:'mailto:bullrunapex@gmail.com' },
                  { icon:'📱', label:'Telegram', value:'@lphamindai_bot', href:'https://t.me/lphamindai_bot' },
                  { icon:'📸', label:'Instagram', value:'@legacy_boy_1', href:'https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==' },
                  { icon:'💬', label:'WhatsApp', value:'Channel', href:'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i' },
                ].map(c => (
                  <a key={c.label} href={c.href} target={c.href.startsWith('http')?'_blank':undefined} rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[var(--apex-border)] bg-slate-900/40 p-3 hover:border-emerald-500/20 transition-all">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{c.label}</p>
                      <p className="text-[10px] text-slate-400">{c.value}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-600 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-5">
              <h3 className="text-sm font-bold text-white mb-1">Response Time</h3>
              <p className="text-xs text-slate-400">We typically respond within <span className="text-emerald-400 font-bold">24 hours</span>. For urgent issues use Telegram for fastest response.</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {activeTab === 'feedback' && (
        <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 p-6 max-w-xl">
          <h2 className="text-base font-bold text-white mb-4">Share Your Feedback</h2>
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-400 mb-3" />
              <p className="text-base font-bold text-white">Thank you for your feedback!</p>
              <p className="text-sm text-slate-400 mt-1">Your input helps us improve Apex AI.</p>
              <button onClick={()=>setSuccess(false)} className="mt-4 text-xs text-slate-500 hover:text-slate-300 underline">Send more feedback</button>
            </div>
          ) : (
            <form onSubmit={handleFeedback} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Feedback Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id:'suggestion', icon:'💡', label:'Idea' },
                    { id:'bug',        icon:'🐛', label:'Bug' },
                    { id:'feature',    icon:'⚡', label:'Feature' },
                    { id:'review',     icon:'⭐', label:'Review' },
                  ].map(t => (
                    <button key={t.id} type="button" onClick={()=>setFbType(t.id)}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all ${fbType===t.id?'border-emerald-500/40 bg-emerald-500/10':'border-[var(--apex-border)] bg-slate-900/40 hover:border-slate-600'}`}>
                      <span className="text-lg">{t.icon}</span>
                      <span className={`text-[10px] font-bold ${fbType===t.id?'text-emerald-400':'text-slate-400'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {fbType === 'review' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={()=>setFbRating(n)}
                        className={`text-2xl transition-all ${n<=fbRating?'text-yellow-400':'text-slate-700 hover:text-yellow-400/50'}`}>★</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Subject</label>
                <input value={fbSubject} onChange={e=>setFbSubject(e.target.value)} required placeholder="Brief summary" className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Details</label>
                <textarea value={fbMessage} onChange={e=>setFbMessage(e.target.value)} required rows={4} placeholder="Share your thoughts..." className={`${inputCls} resize-none`} />
              </div>
              {!user && <p className="text-xs text-amber-400">⚠ Sign in to submit feedback.</p>}
              <button type="submit" disabled={isPending||!user}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#03060d] font-bold py-3 text-sm transition-all disabled:opacity-50">
                <Send className="h-4 w-4" />
                {isPending ? 'Sending…' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
