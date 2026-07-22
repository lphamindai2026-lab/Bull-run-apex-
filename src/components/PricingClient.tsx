'use client';

import React, { useState, useTransition } from 'react';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Copy, 
  Gift, 
  UserPlus, 
  DollarSign, 
  Activity, 
  ShieldCheck,
  Percent,
  Compass,
  ArrowRight
} from 'lucide-react';
import { updateSubscriptionAction, applyReferralCodeAction } from '@/app/actions';

interface PricingClientProps {
  user: any;
}

export default function PricingClient({ user }: PricingClientProps) {
  const [isPending, startTransition] = useTransition();
  const [couponCode, setCouponCode] = useState('');
  const [activePromoDiscount, setActivePromoDiscount] = useState<boolean>(false);
  const [currentTier, setCurrentTier] = useState<string>(user ? user.subscriptionTier : 'free');
  
  // Checkout simulation modal states
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Copy referral link to clipboard helper
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    if (!user) return;
    const refLink = `${window.location.origin}?ref=${user.affiliateCode}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'Please log in to apply discount structures.' });
      return;
    }

    setMessage(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'APEX50' || code === 'BULLRUN') {
      setActivePromoDiscount(true);
      setMessage({ type: 'success', text: 'PROMO CODE APPLIED! 50% discount registered for upcoming Stripe checkouts.' });
      setCouponCode('');
    } else {
      // Otherwise treat as affiliate reference code to grant simulation cash
      startTransition(async () => {
        const res = await applyReferralCodeAction(code);
        if (res.success) {
          setMessage({ type: 'success', text: res.message || 'Affiliate code verified! Sim funds added.' });
          setCouponCode('');
        } else {
          setMessage({ type: 'error', text: res.error || 'Invalid promotional or referral code.' });
        }
      });
    }
  };

  const handleUpgradeTier = (tier: 'free' | 'pro' | 'institutional') => {
    if (!user) {
      setMessage({ type: 'error', text: 'You must log in to upgrade subscription tiers.' });
      return;
    }

    setCheckoutPlan(tier);
    setCheckoutSuccess(null);
  };

  const handleConfirmStripeCheckout = () => {
    if (!checkoutPlan) return;

    startTransition(async () => {
      const res = await updateSubscriptionAction(checkoutPlan as any);
      if (res.success) {
        setCurrentTier(checkoutPlan);
        setCheckoutSuccess(`Successfully updated membership level to ${checkoutPlan.toUpperCase()}! Your account balance holds full privileges.`);
        setTimeout(() => {
          setCheckoutPlan(null);
          setCheckoutSuccess(null);
          window.location.reload(); // Reload to refresh the top header balance / badges
        }, 2200);
      } else {
        setMessage({ type: 'error', text: 'Payment verification failed.' });
        setCheckoutPlan(null);
      }
    });
  };

  const plans = [
    {
      name: 'Free Basic Tier',
      id: 'free',
      price: 0,
      desc: 'Introductory simulator plan designed for structural market observation.',
      features: [
        'Interactive candlestick charting',
        'Basic Smart Money indicator scanning',
        'Postgres DB-backed Trade Journaling',
        '1 simultaneous active Chat Session',
        'Standard Email dispatch alerts'
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      name: 'Professional Suite',
      id: 'pro',
      price: 49,
      desc: 'Complete quantitative dashboard engineered for active paper traders.',
      features: [
        'Advanced automated SMC CHoCH & BOS autoplots',
        'Unmitigated Order Block indicator scanning',
        'Full Multi-model AI Routing (Claude, Gemini, GPT)',
        'Built-in SL/TP risk & margin size calculators',
        'Simulated Discord & Telegram webhook dispatches',
        'No restriction on Chat Session storage counts'
      ],
      cta: 'Upgrade to Professional',
      popular: true
    },
    {
      name: 'Institutional VIP',
      id: 'institutional',
      price: 199,
      desc: 'Maximum limit allocation tier for elite financial engineers.',
      features: [
        'Ultra-density order book DOM & Liquidity heatmaps',
        'Geopolitical Whale Wallet on-chain tracker feed',
        'Automated Pine Script v5 algorithmic code generator',
        'Custom SMS telephony push notification alerts',
        'Continuous AI cognitive psychology mistake auditor',
        'Priority administrative system support queues'
      ],
      cta: 'Go Institutional VIP',
      popular: false
    }
  ];

  return (
    <div className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-400" />
            BILLING WORKSPACE & AFFILIATE COOPERATIVE
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Manage your subscription tier, simulate Stripe merchant checkouts, enter coupons, and share affiliate reference links.
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-mono">
            <span>Your Active Level:</span>
            <span className="text-cyan-400 font-extrabold uppercase font-mono">{currentTier} Member</span>
          </div>
        )}
      </div>

      {/* STRIPE PLAN PRICING CARD COHESION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isActive = currentTier === p.id;
          const discountedPrice = activePromoDiscount ? p.price * 0.5 : p.price;
          return (
            <div 
              key={p.id} 
              className={`rounded-2xl border p-6 flex flex-col justify-between relative transition-all ${
                isActive 
                  ? 'bg-gradient-to-b from-[#0c1c2e] to-[#040811] border-cyan-500 shadow-xl shadow-cyan-500/10' 
                  : p.popular 
                    ? 'bg-slate-950/80 border-emerald-500 shadow-lg shadow-emerald-500/5' 
                    : 'bg-[#070c18] border-slate-850'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-0.5 text-[9px] font-mono font-black text-slate-950 uppercase tracking-widest">
                  ★ Popular Pick
                </span>
              )}

              {isActive && (
                <span className="absolute -top-3 left-6 rounded-full bg-cyan-500 px-3 py-0.5 text-[9px] font-mono font-black text-slate-950 uppercase tracking-widest">
                  ✔ CURRENT TIER
                </span>
              )}

              <div>
                <h4 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold">{p.name}</h4>
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-3xl font-mono">$</span>
                  <span className="text-5xl font-black font-mono tracking-tight">{discountedPrice}</span>
                  <span className="ml-1 text-xs text-slate-400">/ month</span>
                </div>
                {activePromoDiscount && p.price > 0 && (
                  <span className="text-[10px] text-emerald-400 block font-mono font-bold mt-1 line-through decoration-red-400">
                    Was ${p.price}/mo (APEX50 applied)
                  </span>
                )}
                
                <p className="mt-3 text-xs text-slate-400 leading-relaxed font-sans">{p.desc}</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300 font-mono">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  disabled={isActive || (p.id === 'free' && currentTier !== 'free')}
                  onClick={() => handleUpgradeTier(p.id as any)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800' 
                      : p.popular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                        : 'bg-slate-850 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isActive ? 'Privileges Active' : p.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DUAL COLUMN: COUPONS & REFERRALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        
        {/* Coupon submission form (Col Span 5) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#070c18] p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-3 flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-emerald-400" />
              COUPONS & PROMOTION SYSTEMS
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              Enter promotional codes to claim a 50% discount on billing models or reference referral codes to obtain simulated paper funds.
            </p>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. APEX50 or APEX-LAUNCH"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white uppercase placeholder-slate-600 rounded-lg py-1.5 px-3 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Apply
              </button>
            </form>
          </div>

          {message && (
            <div className={`mt-3 p-2.5 rounded-lg text-[10px] border ${
              message.type === 'success' 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-950/40 text-rose-400 border-rose-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mt-4 p-2 rounded bg-slate-950/60 border border-slate-850 text-[9px] text-slate-500 leading-relaxed">
            💡 Try typing <strong>APEX50</strong> to claim half off subscriptions, or apply a friend's partner multiplier.
          </div>
        </div>

        {/* Affiliate Cooperative link & stats (Col Span 7) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#070c18] p-4 font-mono flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-3 mb-3 flex items-center gap-1.5">
              <UserPlus className="h-4 w-4 text-cyan-400" />
              AFFILIATE & PARTNER REBATE LINK
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              Share your individual referral code with fellow quantitative traders. Every registration grants your friend <strong>+$5,000</strong> simulation cash, while rewarding you with competitive system multipliers!
            </p>

            {user ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/80 border border-slate-900">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Your Partner Referral Code:</span>
                    <strong className="text-white tracking-widest text-sm">{user.affiliateCode || 'APEX-COOP'}</strong>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3 text-cyan-400" />
                    {copied ? 'Copied!' : 'Copy Partner Link'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-mono">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block text-[9px]">referred users</span>
                    <strong className="text-white text-xs">4 Traders</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block text-[9px]">rebate multiplier</span>
                    <strong className="text-emerald-400 text-xs">15% discount</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block text-[9px]">sim cash earned</span>
                    <strong className="text-cyan-400 text-xs">+$20,000.00</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 text-xs leading-relaxed">
                Log in to generate your customized partner link.
              </div>
            )}
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-slate-950/40 border border-slate-900 text-[10px] text-slate-400">
            Referred links route directly to the SHA-256 secure registration gateway with parameters tracked via relational database tables.
          </div>
        </div>

      </div>

      {/* STRIPE MOCK INTEGRATION CHECKOUT OVERLAY MODAL */}
      {checkoutPlan !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl font-mono">
            
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Stripe Secure Sandbox Billing
            </h3>
            
            <p className="text-[11px] text-slate-400 mb-4">
              Simulated institutional financial gateway checkout. No true credit cards are debited. Transactions are handled safely through relational Drizzle schemas.
            </p>

            {checkoutSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 text-center flex flex-col items-center gap-2">
                <Check className="h-8 w-8 text-emerald-400 animate-bounce" />
                <span>{checkoutSuccess}</span>
              </div>
            ) : (
              <div className="space-y-4">
                
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Plan Selected:</span>
                    <span className="text-white font-extrabold uppercase">{checkoutPlan}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-400 border-t border-slate-900 pt-1.5 mt-1.5">
                    <span>Stripe Collateral due:</span>
                    <span>
                      ${plans.find(p => p.id === checkoutPlan)?.price ? (
                        activePromoDiscount 
                          ? (plans.find(p => p.id === checkoutPlan)!.price * 0.5) 
                          : plans.find(p => p.id === checkoutPlan)!.price
                      ) : 0} / month
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500">MOCK PLATFORM CARD NUMBER</label>
                  <div className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-emerald-400 font-bold tracking-widest text-center select-none">
                    4242 •••• •••• 4242 (Stripe Sandbox Card)
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckoutPlan(null)}
                    className="flex-1 bg-slate-900 text-slate-300 hover:text-white py-2 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmStripeCheckout}
                    disabled={isPending}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2 rounded-lg text-xs font-bold"
                  >
                    {isPending ? 'Validating Token Block...' : 'Confirm Simulated Stripe Payment'}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
