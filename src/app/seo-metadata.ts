/**
 * Centralized SEO metadata for every page.
 * Imported by page.tsx files to ensure consistent,
 * unique, optimized metadata across the entire platform.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bullrunapexai.com';
export const SITE_NAME = 'Bull Run Apex AI';
export const FOUNDER = 'Himanshu Bhmniya';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const SUPPORT_EMAIL = 'bullrunapex@gmail.com';

export const PAGE_METADATA = {
  home: {
    title: 'Bull Run Apex AI — AI-Powered Institutional Trading Platform',
    description: 'The world\'s most advanced AI trading platform by Himanshu Bhmniya. TradingView charts, Smart Money Concepts auto-detection, Gemini/Claude/GPT-4o AI coaching, trade journal, portfolio analytics. Start free with $100K.',
    keywords: 'Bull Run Apex AI, Himanshu Bhmniya, AI trading platform, smart money concepts, TradingView charts, institutional trading, crypto forex gold',
  },
  terminal: {
    title: 'Trading Terminal — Live Charts, SMC & Paper Trading | Bull Run Apex AI',
    description: 'Real-time TradingView charts with Smart Money Concepts auto-detection (BOS, CHoCH, FVG, Order Blocks). Paper trading simulator with $100K balance. Crypto, forex, gold, stocks.',
    keywords: 'trading terminal, TradingView charts, smart money concepts, BOS CHoCH order blocks FVG, paper trading, crypto forex simulator',
  },
  aiAssistant: {
    title: 'AI Trading Coach — Gemini, Claude & GPT-4o | Bull Run Apex AI',
    description: 'Multi-model AI coaching powered by Google Gemini 1.5, Claude 3.5 Sonnet, and GPT-4o. Pine Script v5 generator, chart analysis, trade psychology coaching, voice input, PDF upload.',
    keywords: 'AI trading coach, Gemini trading, Claude trading AI, GPT-4o finance, Pine Script generator, trading psychology AI, chart analysis AI',
  },
  journal: {
    title: 'AI Trade Journal — Behavioral Analysis & Performance | Bull Run Apex AI',
    description: 'Smart trade journal with emotion tracking, mistake analysis (FOMO, revenge trading), win rate analytics, calendar view, and AI psychology coaching. Improve your trading psychology.',
    keywords: 'trade journal, trading psychology, emotion tracking, FOMO trading, win rate calculator, behavioral finance, trading mistakes analysis',
  },
  portfolio: {
    title: 'Portfolio & Price Alerts — Analytics & Signals | Bull Run Apex AI',
    description: 'Portfolio analytics, asset allocation visualization, P&L tracking, price alerts via Telegram, Discord, Email, WhatsApp. SMC pattern alerts, liquidation heatmaps.',
    keywords: 'portfolio analytics, trading alerts, price alerts, Telegram trading signals, Discord alerts, asset allocation, portfolio tracker',
  },
  pricing: {
    title: 'Pricing — Free Demo, Pro & Institutional Plans | Bull Run Apex AI',
    description: 'Bull Run Apex AI pricing plans. Start completely free with $100,000 simulation. Upgrade to Pro or Institutional for advanced features. Affiliate program available.',
    keywords: 'trading platform pricing, free trading platform, paper trading free, institutional trading subscription, trading affiliate program',
  },
  support: {
    title: 'Help Center & Support | Bull Run Apex AI by Himanshu Bhmniya',
    description: 'Get help with Bull Run Apex AI. Comprehensive FAQ, support tickets, feedback system. Contact founder Himanshu Bhmniya directly at bullrunapex@gmail.com or Instagram @legacy_boy_1.',
    keywords: 'Bull Run Apex AI support, Himanshu Bhmniya contact, trading platform help, FAQ trading platform, bullrunapex@gmail.com',
  },
  whatsNew: {
    title: "What's New — Changelog & Platform Updates | Bull Run Apex AI",
    description: "Latest features, improvements, and updates in Bull Run Apex AI v5.0. Platform changelog, roadmap, and upcoming features from founder Himanshu Bhmniya.",
    keywords: 'Bull Run Apex AI updates, trading platform changelog, new trading features, AI trading updates, Himanshu Bhmniya updates',
  },
  about: {
    title: 'About Himanshu Bhmniya — Founder & CEO | Bull Run Apex AI',
    description: 'Meet Himanshu Bhmniya, founder and CEO of Bull Run Apex AI. Building the world\'s most advanced AI-powered institutional trading platform. Instagram: @legacy_boy_1. Email: bullrunapex@gmail.com.',
    keywords: 'Himanshu Bhmniya, Bull Run Apex AI founder, trading platform CEO, Himanshu Bhmniya Instagram, legacy_boy_1 trading, bullrunapex founder',
  },
  admin: {
    title: 'Admin Dashboard | Bull Run Apex AI',
    description: 'Administrative control panel for Bull Run Apex AI. Manage users, subscriptions, support tickets, announcements, feature flags, and audit logs.',
    keywords: 'admin dashboard, trading platform administration, user management',
  },
  settings: {
    title: 'Account Settings | Bull Run Apex AI',
    description: 'Manage your Bull Run Apex AI account. Profile, paper trading balance, security, 2FA, notifications, AI preferences, and theme settings.',
    keywords: 'account settings, paper trading balance, 2FA security, notification settings',
  },
} as const;
