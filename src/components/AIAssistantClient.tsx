'use client';

import React, { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain, Sparkles, Trash2, Plus, Send, Mic, MicOff,
  Image as ImageIcon, FileText, Upload, X, Check,
  Code, LineChart, BookOpen, Zap, Volume2, VolumeX,
  ChevronRight, Clock, MessageSquare, AlertCircle,
  Lock, Library, TrendingUp, DollarSign
} from 'lucide-react';
import { createChatSessionAction, sendChatMessageAction, deleteChatSessionAction } from '@/app/actions';

interface Props {
  user: any;
  sessions: any[];
  activeSessionId: string | null;
  initialMessages: any[];
}

const MODELS = [
  { id: 'Gemini 1.5 Pro',       label: 'Gemini 1.5 Pro',       badge: 'Google',   color: 'text-blue-400' },
  { id: 'Claude 3.5 Sonnet',    label: 'Claude 3.5 Sonnet',    badge: 'Anthropic', color: 'text-orange-400' },
  { id: 'GPT-4o Enterprise',    label: 'GPT-4o Enterprise',    badge: 'OpenAI',   color: 'text-emerald-400' },
  { id: 'Multi-Model Hybrid',   label: 'Auto-Route',           badge: 'Hybrid',   color: 'text-purple-400' },
];

const PROMPT_LIBRARY = [
  { icon: Code,       label: 'Pine Script v5',        prompt: 'Generate a complete Pine Script v5 strategy using SMC Order Blocks and Fair Value Gaps with alerts', category: 'code' },
  { icon: LineChart,  label: 'SMC Analysis',          prompt: 'Explain BOS, CHoCH, Order Blocks, FVG, and liquidity sweeps with specific entry coordinates', category: 'analysis' },
  { icon: Brain,      label: 'Psychology Audit',      prompt: 'I traded emotionally today. Analyze my FOMO and over-leveraging patterns and give me a correction plan', category: 'psychology' },
  { icon: TrendingUp, label: 'BTC Order Flow',        prompt: 'Analyze Bitcoin order flow, funding rates, open interest and liquidation heatmaps for today', category: 'analysis' },
  { icon: DollarSign, label: 'Risk Calculator',       prompt: 'Calculate position size for 1% risk on XAUUSD with entry at 2340, stop loss at 2315, $100,000 account', category: 'math' },
  { icon: FileText,   label: 'Strategy Generator',    prompt: 'Create a complete trading strategy for Gold using SMC, kill zones, and volume profile confluence', category: 'strategy' },
  { icon: Zap,        label: 'Market Summary',        prompt: 'Give me a complete market summary for crypto, forex, gold and indices with institutional bias for each', category: 'summary' },
  { icon: BookOpen,   label: 'Journal Review',        prompt: 'Review my recent trades: I took 5 trades this week, 3 wins 2 losses. FOMO on BTC long, revenge trade on EUR. What should I fix?', category: 'journal' },
];

export default function AIAssistantClient({ user, sessions: initialSessions, activeSessionId: initSessionId, initialMessages }: Props) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  const [sessions,    setSessions]    = useState(initialSessions);
  const [sessionId,   setSessionId]   = useState(initSessionId);
  const [messages,    setMessages]    = useState<any[]>(initialMessages);
  const [input,       setInput]       = useState('');
  const [model,       setModel]       = useState('Gemini 1.5 Pro');
  const [isPending,   startTx]        = useTransition();

  // Attachments
  const [attachment,  setAttachment]  = useState<{name:string;type:string;preview?:string}|null>(null);

  // Voice
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);

  // UI state
  const [showPrompts, setShowPrompts] = useState(false);
  const [showModels,  setShowModels]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleNewSession = () => {
    if (!user) { alert('Please sign in to create sessions.'); return; }
    startTx(async () => {
      const res = await createChatSessionAction(`Chat ${sessions.length + 1}`) as any;
      if (res.success) {
        setSessions(prev => [{ id: res.sessionId, title: `Chat ${sessions.length + 1}`, createdAt: new Date() }, ...prev]);
        setSessionId(res.sessionId);
        setMessages([]);
        router.push(`/ai-assistant?session=${res.sessionId}`);
      }
    });
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startTx(async () => {
      await deleteChatSessionAction(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (sessionId === id) { setSessionId(null); setMessages([]); router.push('/ai-assistant'); }
    });
  };

  const handleSend = (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text && !attachment) return;
    if (!user) { alert('Sign in to chat.'); return; }
    if (!sessionId) { handleNewSession(); return; }

    const fullContent = attachment ? `[${attachment.type.toUpperCase()}: ${attachment.name}]\n${text}` : text;

    // Optimistic UI
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: fullContent, createdAt: new Date() }]);
    setInput('');
    setAttachment(null);
    setShowPrompts(false);

    startTx(async () => {
      const res = await sendChatMessageAction(sessionId, fullContent, model) as any;
      if (res.success) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: res.response, createdAt: new Date() }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: '⚠ Error: Could not reach AI. Please try again.', createdAt: new Date() }]);
      }
    });
  };

  // Voice recording simulation
  const handleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      setInput(prev => prev + (prev ? ' ' : '') + 'Analyze BTCUSD market structure on H4 timeframe');
    } else {
      setIsRecording(true);
      setTimeout(() => { setIsRecording(false); }, 5000);
    }
  };

  // File upload handler
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isPDF   = file.type === 'application/pdf';
    const isCSV   = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const type    = isImage ? 'image' : isPDF ? 'pdf' : isCSV ? 'csv' : isExcel ? 'excel' : 'file';

    if (isImage) {
      const reader = new FileReader();
      reader.onload = ev => setAttachment({ name: file.name, type, preview: ev.target?.result as string });
      reader.readAsDataURL(file);
    } else {
      setAttachment({ name: file.name, type });
    }
    e.target.value = '';
  };

  const activeModel = MODELS.find(m => m.id === model) ?? MODELS[0];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">

      {/* ═══ SIDEBAR ═══ */}
      <div className={`${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'} shrink-0 border-r border-[var(--apex-border)] bg-[#03060d] flex flex-col transition-all duration-300`}>
        <div className="p-3 border-b border-[var(--apex-border)]">
          <button onClick={handleNewSession} disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#03060d] font-bold py-2.5 text-xs transition-all disabled:opacity-50">
            <Plus className="h-4 w-4" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <Clock className="h-8 w-8 text-slate-700 mb-2" />
              <p className="text-xs text-slate-600">No conversations yet</p>
            </div>
          ) : (
            sessions.map(s => {
              const active = s.id === sessionId;
              return (
                <div key={s.id} onClick={() => { setSessionId(s.id); router.push(`/ai-assistant?session=${s.id}`); }}
                  className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${active ? 'bg-emerald-500/10 border border-emerald-500/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}>
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 text-xs font-medium truncate">{s.title}</span>
                  <button onClick={e => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-[var(--apex-border)] text-[9px] font-mono text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-500" /> PostgreSQL Encrypted</div>
          <div>AI Memory: <span className="text-emerald-400">{user ? 'Active' : 'Sign in to enable'}</span></div>
        </div>
      </div>

      {/* ═══ MAIN CHAT AREA ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-[var(--apex-border)] px-4 py-3 bg-[var(--apex-surface)]/60 shrink-0">
          <button onClick={() => setSidebarOpen(o => !o)}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all">
            <MessageSquare className="h-4 w-4" />
          </button>

          {/* Model selector */}
          <div className="relative">
            <button onClick={() => setShowModels(o => !o)}
              className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] bg-slate-900/60 px-3 py-1.5 text-xs font-bold transition-all hover:border-slate-600">
              <span className={activeModel.color}>●</span>
              <span className="text-slate-200">{activeModel.label}</span>
              <span className="text-[9px] text-slate-500 font-mono">{activeModel.badge}</span>
            </button>
            {showModels && (
              <div className="absolute top-full left-0 mt-1 w-52 rounded-xl border border-[var(--apex-border)] bg-[#04080f] shadow-2xl z-20 overflow-hidden">
                {MODELS.map(m => (
                  <button key={m.id} onClick={() => { setModel(m.id); setShowModels(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs hover:bg-slate-900/60 transition-all text-left ${model===m.id?'bg-slate-900/60 text-white':'text-slate-400'}`}>
                    <span className={m.color}>●</span>
                    <div><p className="font-bold">{m.label}</p><p className="text-[9px] text-slate-500">{m.badge}</p></div>
                    {model===m.id && <Check className="h-3.5 w-3.5 text-emerald-400 ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowPrompts(o => !o)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${showPrompts ? 'border-purple-500/40 bg-purple-500/10 text-purple-400' : 'border-[var(--apex-border)] text-slate-400 hover:text-white hover:border-slate-600'}`}>
              <Library className="h-3.5 w-3.5" /> Prompts
            </button>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">AI Active</span>
          </div>
        </div>

        {/* Prompt library overlay */}
        {showPrompts && (
          <div className="border-b border-[var(--apex-border)] bg-[#03060d] p-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Prompt Library</p>
              <button onClick={() => setShowPrompts(false)} className="text-slate-500 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROMPT_LIBRARY.map(p => {
                const Icon = p.icon;
                return (
                  <button key={p.label} onClick={() => handleSend(p.prompt)}
                    className="flex items-start gap-2 rounded-xl border border-[var(--apex-border)] bg-slate-900/40 hover:bg-slate-900 hover:border-emerald-500/20 p-3 text-left transition-all group">
                    <Icon className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-200 group-hover:text-white">{p.label}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">{p.prompt.slice(0, 60)}…</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 space-y-4">

          {!sessionId || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto pb-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-500/10 flex items-center justify-center text-3xl font-black text-emerald-400 mb-6 shadow-xl shadow-emerald-500/5">▲</div>
              <h2 className="text-xl font-black text-white mb-2">Apex AI Coach</h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Powered by <span className="text-blue-400 font-bold">Gemini</span>, <span className="text-orange-400 font-bold">Claude</span> & <span className="text-emerald-400 font-bold">GPT-4o</span>. Ask me anything about trading, SMC, Pine Script, or your journal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {PROMPT_LIBRARY.slice(0, 4).map(p => {
                  const Icon = p.icon;
                  return (
                    <button key={p.label} onClick={() => { if (!sessionId) handleNewSession(); else handleSend(p.prompt); }}
                      className="flex items-center gap-2.5 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/40 hover:bg-slate-900 hover:border-emerald-500/20 p-3.5 text-left transition-all group">
                      <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-200 group-hover:text-white">{p.label}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{p.prompt.slice(0,45)}…</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={i} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} max-w-4xl ${isUser ? 'ml-auto' : 'mr-auto'}`}>
                    {!isUser && (
                      <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-500/10 flex items-center justify-center text-sm font-black text-emerald-400 mt-0.5">▲</div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 max-w-[85%] ${isUser ? 'bg-slate-800 border border-slate-700/50 text-slate-200' : 'bg-[var(--apex-surface)]/60 border border-[var(--apex-border)] text-slate-100'}`}>
                      {msg.content.includes('@keyframes') || msg.content.includes('strategy(') || msg.content.includes('//@version') ? (
                        <pre className="text-[11px] font-mono whitespace-pre-wrap overflow-x-auto text-emerald-300 leading-relaxed">{msg.content}</pre>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                      <p className="text-[9px] text-slate-600 mt-2 font-mono">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                    </div>
                    {isUser && (
                      <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-400 mt-0.5">
                        {user ? (user.name ?? user.email)[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                );
              })}

              {isPending && (
                <div className="flex gap-3 justify-start max-w-4xl mr-auto">
                  <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-500/10 flex items-center justify-center text-sm font-black text-emerald-400 animate-pulse">▲</div>
                  <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{model} thinking…</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-[var(--apex-border)] bg-[var(--apex-surface)]/40 p-4 shrink-0">

          {/* Attachment preview */}
          {attachment && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
              {attachment.type === 'image' && attachment.preview
                ? <img src={attachment.preview} alt="" className="h-8 w-8 rounded object-cover" />
                : <FileText className="h-5 w-5 text-cyan-400" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{attachment.name}</p>
                <p className="text-[9px] text-slate-500 capitalize">{attachment.type} • Ready to analyze</p>
              </div>
              <button onClick={() => setAttachment(null)} className="text-slate-500 hover:text-rose-400 transition-colors"><X className="h-4 w-4" /></button>
            </div>
          )}

          {/* Voice recording indicator */}
          {isRecording && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs text-rose-400 font-mono">Recording… speak now</span>
              <div className="ml-auto flex gap-1">
                {[...Array(8)].map((_,i) => (
                  <div key={i} className="w-0.5 bg-rose-500 rounded-full animate-pulse" style={{ height: `${Math.random()*16+4}px`, animationDelay:`${i*0.1}s` }} />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* File upload button */}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.csv,.xlsx,.xls" onChange={handleFile} />
            <button onClick={() => fileInputRef.current?.click()}
              className="shrink-0 rounded-xl border border-[var(--apex-border)] bg-slate-900/60 p-2.5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all" title="Upload image, PDF, CSV or Excel">
              <Upload className="h-4 w-4" />
            </button>

            {/* Voice button */}
            <button onClick={handleVoice}
              className={`shrink-0 rounded-xl border p-2.5 transition-all ${isRecording ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse' : 'border-[var(--apex-border)] bg-slate-900/60 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30'}`}
              title="Voice input">
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={sessionId ? "Ask about SMC, Pine Script, trading psychology, or upload a chart…" : "Click 'New Chat' or type to start…"}
                rows={1}
                className="w-full resize-none rounded-xl border border-[var(--apex-border)] bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all max-h-32 overflow-y-auto"
                style={{ minHeight: '44px' }}
                onInput={e => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 128) + 'px';
                }}
              />
            </div>

            {/* Send button */}
            <button onClick={() => handleSend()} disabled={isPending || (!input.trim() && !attachment)}
              className="shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 p-2.5 text-[#03060d] transition-all">
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-600">
            <span>Enter ↵ to send · Shift+Enter for new line · Supports images, PDF, CSV, Excel</span>
            <span>{activeModel.label} · {user ? 'Memory Active' : 'Sign in for memory'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
