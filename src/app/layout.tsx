import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import FounderPhoto from "@/components/FounderPhoto";
import "./globals.css";

// ─────────────────────────────────────────────────────────────
// SITE URL RESOLUTION
//
// Priority order:
//   1. NEXT_PUBLIC_SITE_URL env var (set in hosting dashboard)
//   2. VERCEL_URL env var (auto-set by Vercel on every deploy)
//   3. Localhost fallback (development only)
//
// IMPORTANT: Never hardcode a real domain or an e2b.app URL here.
// Always resolve from environment variables.
// ─────────────────────────────────────────────────────────────
function getSiteUrl(): string {
  // Production domain configured by the owner
  if (process.env.NEXT_PUBLIC_SITE_URL &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('YOUR_PRODUCTION_DOMAIN') &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  // Vercel auto-provides this on every deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Development fallback — NOT used in production
  return 'http://localhost:3000';
}

const SITE_URL  = getSiteUrl();
const SITE_NAME = 'Bull Run Apex AI';
const FOUNDER   = 'Himanshu Bhmniya';
const OG_IMAGE  = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  // ── Title ──────────────────────────────────────────────────
  title: {
    default:  `${SITE_NAME} — AI-Powered Institutional Trading Platform`,
    template: `%s | ${SITE_NAME}`,
  },

  // ── Description (150-160 chars) ────────────────────────────
  description:
    `${SITE_NAME} by ${FOUNDER} — Advanced AI trading platform with TradingView charts, ` +
    `Smart Money Concepts auto-detection (BOS, CHoCH, FVG, Order Blocks), ` +
    `multi-model AI coaching (Gemini, Claude, GPT-4o), trade journal and portfolio analytics. ` +
    `Start free with $100,000 simulation balance.`,

  // ── Keywords ───────────────────────────────────────────────
  keywords: [
    'Bull Run Apex AI', 'Himanshu Bhmniya', 'AI trading platform',
    'institutional trading', 'Smart Money Concepts', 'SMC trading',
    'TradingView charts', 'order blocks trading', 'fair value gap',
    'BOS CHoCH trading', 'trade journal AI', 'crypto trading platform',
    'forex trading AI', 'paper trading simulator', 'trading psychology',
    'Pine Script generator', 'free trading platform', 'quantitative trading',
  ],

  // ── Authorship ─────────────────────────────────────────────
  authors:   [{ name: FOUNDER }],
  creator:   FOUNDER,
  publisher: SITE_NAME,

  // ── metadataBase: required for absolute OG/canonical URLs ──
  // Next.js uses this to resolve relative image/URL strings.
  // It resolves correctly from NEXT_PUBLIC_SITE_URL or VERCEL_URL.
  metadataBase: new URL(SITE_URL),

  // ── Canonical ──────────────────────────────────────────────
  alternates: {
    canonical: '/',
    languages: { 'en': '/', 'en-US': '/', 'en-GB': '/' },
  },

  // ── Open Graph ─────────────────────────────────────────────
  openGraph: {
    type:        'website',
    siteName:    SITE_NAME,
    title:       `${SITE_NAME} — AI-Powered Institutional Trading Platform`,
    description:
      `Trade smarter with ${SITE_NAME} by ${FOUNDER}. ` +
      `TradingView charts, SMC auto-detection, multi-model AI coaching, ` +
      `behavioral trade journal & portfolio analytics. Free $100K simulation.`,
    images: [{
      url:    '/og-image.jpg', // Relative — metadataBase resolves it correctly
      width:  1200,
      height: 630,
      alt:    `${SITE_NAME} — AI Trading Platform by ${FOUNDER}`,
      type:   'image/jpeg',
    }],
    locale: 'en_US',
  },

  // ── Twitter / X ────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    site:        '@BullRunApexAI',
    creator:     '@HimanshuBhmniya',
    title:       `${SITE_NAME} — AI-Powered Institutional Trading Platform`,
    description:
      `Advanced AI trading platform by ${FOUNDER}. ` +
      `SMC auto-detection, TradingView, AI coaching & free paper trading.`,
    images: ['/og-image.jpg'],
  },

  // ── Indexing ───────────────────────────────────────────────
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:             true,
      follow:            true,
      noimageindex:      false,
      'max-video-preview':  -1,
      'max-image-preview':  'large',
      'max-snippet':        -1,
    },
  },

  // ── App info ───────────────────────────────────────────────
  applicationName: SITE_NAME,
  generator:       'Next.js',
  referrer:        'origin-when-cross-origin',
  category:        'Finance & Trading',
  formatDetection: { email: false, address: false, telephone: false },

  // ── Icons ──────────────────────────────────────────────────
  icons: {
    icon:     [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple:    [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: '/favicon.svg',
  },

  // ── Google Search Console verification ────────────────────
  // Value comes from GOOGLE_SITE_VERIFICATION env var.
  // Empty string = no verification tag rendered (correct behaviour).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

export const viewport: Viewport = {
  width:          'device-width',
  initialScale:   1,
  maximumScale:   5,
  userScalable:   true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#03060d' },
    { media: '(prefers-color-scheme: light)', color: '#03060d' },
  ],
};

// ─────────────────────────────────────────────────────────────
// JSON-LD STRUCTURED DATA
// Helps Google understand the platform and show rich results.
// All URLs use SITE_URL resolved from env — never hardcoded.
// ─────────────────────────────────────────────────────────────
function buildStructuredData() {
  const org = {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    '@id':      `${SITE_URL}/#organization`,
    name:       SITE_NAME,
    url:        SITE_URL,
    logo: {
      '@type':       'ImageObject',
      url:           `${SITE_URL}/icon-512.png`,
      width:         512,
      height:        512,
    },
    image:   `${SITE_URL}/og-image.jpg`,
    description:
      'The world\'s most advanced AI-powered institutional trading platform.',
    founder: {
      '@type': 'Person',
      name:    FOUNDER,
      url:     `${SITE_URL}/about`,
      sameAs: [
        'https://www.instagram.com/legacy_boy_1',
        'https://t.me/lphamindai_bot',
      ],
    },
    contactPoint: {
      '@type':            'ContactPoint',
      email:              'bullrunapex@gmail.com',
      contactType:        'customer support',
      availableLanguage:  'English',
    },
    sameAs: [
      'https://www.instagram.com/legacy_boy_1',
      'https://t.me/lphamindai_bot',
      'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i',
    ],
  };

  const website = {
    '@context':    'https://schema.org',
    '@type':       'WebSite',
    '@id':         `${SITE_URL}/#website`,
    name:          SITE_NAME,
    url:           SITE_URL,
    description:   'AI-powered institutional trading platform by Himanshu Bhmniya.',
    inLanguage:    'en-US',
    publisher:     { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type':      'EntryPoint',
        urlTemplate:  `${SITE_URL}/terminal?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const software = {
    '@context':           'https://schema.org',
    '@type':              'SoftwareApplication',
    name:                 SITE_NAME,
    applicationCategory:  'FinanceApplication',
    operatingSystem:      'Web, iOS, Android',
    url:                  SITE_URL,
    image:                `${SITE_URL}/og-image.jpg`,
    description:
      'Institutional-grade AI trading platform with TradingView charts, ' +
      'Smart Money Concepts auto-detection, multi-model AI coaching, and behavioral trade journal.',
    author: { '@id': `${SITE_URL}/#organization` },
    offers: {
      '@type':      'Offer',
      price:        '0',
      priceCurrency:'USD',
      description:  'Free demo with $100,000 simulation balance.',
    },
    featureList: [
      'TradingView Advanced Charts',
      'Smart Money Concepts Auto-Detection (BOS, CHoCH, FVG, Order Blocks)',
      'Multi-Model AI Coaching (Gemini 1.5, Claude 3.5, GPT-4o)',
      'Behavioral Trade Journal with Psychology Coaching',
      'Portfolio Analytics & Price Alerts',
      'Paper Trading Simulator',
      'Pine Script v5 Generator',
      'Real-time Order Flow & DOM',
    ],
  };

  const person = {
    '@context':  'https://schema.org',
    '@type':     'Person',
    '@id':       `${SITE_URL}/#founder`,
    name:        FOUNDER,
    url:         `${SITE_URL}/about`,
    jobTitle:    'Founder & CEO',
    worksFor:    { '@id': `${SITE_URL}/#organization` },
    email:       'bullrunapex@gmail.com',
    sameAs: [
      'https://www.instagram.com/legacy_boy_1',
      'https://t.me/lphamindai_bot',
      'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i',
    ],
    knowsAbout: [
      'Algorithmic Trading', 'Smart Money Concepts',
      'Artificial Intelligence', 'Financial Technology',
      'Quantitative Finance', 'Trading Psychology',
    ],
  };

  return [org, website, software, person];
}

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const schemas = buildStructuredData();

  return (
    <html lang="en" dir="ltr">
      <head>
        {/* JSON-LD Structured Data — one <script> per schema type */}
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
          />
        ))}

        {/* Preconnect to external resources for LCP improvement */}
        <link rel="preconnect" href="https://s3.tradingview.com" />
        <link rel="dns-prefetch" href="https://s3.tradingview.com" />
        <link rel="preconnect" href="https://s.tradingview.com" />

        {/* SVG favicon fallback for browsers that don't pick up Next.js icon config */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>

      <body className="min-h-screen flex flex-col overflow-x-hidden"
            style={{ background: 'var(--apex-bg)' }}>

        {/* Decorative ambient background — aria-hidden, doesn't affect content */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/4 h-[700px] w-[700px] rounded-full bg-emerald-500/4 blur-[140px]" />
          <div className="absolute top-1/3 right-0 h-[600px] w-[600px] rounded-full bg-cyan-500/3 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-purple-500/3 blur-[120px]" />
        </div>

        {/* Skip to main content — accessibility */}
        <a href="#main-content"
           className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#03060d]">
          Skip to main content
        </a>

        {/* Mobile navigation header (md:hidden) */}
        <MobileHeader user={user} />

        {/* Main application shell */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar user={user} />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>

            {/* ── Site Footer ── */}
            <footer className="border-t border-[var(--apex-border)] bg-[#020509] py-8 mt-auto"
                    role="contentinfo"
                    aria-label="Site footer">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                  {/* Brand column */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-black text-sm"
                           aria-hidden="true">▲</div>
                      <span className="text-sm font-black text-white">Bull Run Apex AI</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                      The world&apos;s most advanced AI-powered institutional trading platform.
                    </p>
                    <a href="/about"
                       className="flex items-center gap-2 group w-fit"
                       aria-label="About Himanshu Bhmniya, Founder">
                      <FounderPhoto size="sm" showBorder showGlow className="!h-7 !w-7 rounded-lg" />
                      <div>
                        <p className="text-[10px] text-slate-400 group-hover:text-white transition-colors font-bold">Himanshu Bhmniya</p>
                        <p className="text-[9px] text-purple-400 font-mono">Founder &amp; CEO</p>
                      </div>
                    </a>
                  </div>

                  {/* Platform links */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Platform</p>
                    <nav aria-label="Platform pages">
                      <ul className="space-y-2">
                        {[
                          ['Trading Terminal',   '/terminal'],
                          ['AI Assistant',       '/ai-assistant'],
                          ['Trade Journal',      '/journal'],
                          ['Portfolio',          '/portfolio'],
                          ["What's New",         '/whats-new'],
                        ].map(([label, href]) => (
                          <li key={href}>
                            <a href={href}
                               className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors">
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>

                  {/* Company links */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Company</p>
                    <nav aria-label="Company pages">
                      <ul className="space-y-2">
                        {[
                          ['About Himanshu',  '/about'],
                          ['Pricing',         '/pricing'],
                          ['Help Center',     '/support'],
                          ['Contact Us',      '/support'],
                        ].map(([label, href]) => (
                          <li key={href}>
                            <a href={href}
                               className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors">
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>

                  {/* Social / contact */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Connect with Himanshu
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        {
                          href:  'https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==',
                          label: 'Instagram @legacy_boy_1',
                          color: 'hover:text-pink-400',
                          icon:  (
                            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          ),
                        },
                        {
                          href:  'https://t.me/lphamindai_bot',
                          label: 'Telegram Bot',
                          color: 'hover:text-blue-400',
                          icon:  (
                            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                          ),
                        },
                        {
                          href:  'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i',
                          label: 'WhatsApp Channel',
                          color: 'hover:text-green-400',
                          icon:  (
                            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                            </svg>
                          ),
                        },
                        {
                          href:  'mailto:bullrunapex@gmail.com',
                          label: 'bullrunapex@gmail.com',
                          color: 'hover:text-emerald-400',
                          icon:  (
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                          ),
                        },
                      ].map(link => (
                        <li key={link.href}>
                          <a href={link.href}
                             target={link.href.startsWith('http') ? '_blank' : undefined}
                             rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                             className={`flex items-center gap-2 text-[11px] text-slate-400 ${link.color} transition-colors`}
                             aria-label={link.label}>
                            {link.icon}
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-[var(--apex-border)] pt-5 flex flex-col sm:flex-row
                                items-center justify-between gap-3 text-[10px] font-mono text-slate-600">
                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
                            aria-hidden="true" />
                      All Systems Operational
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>v5.0.0</span>
                    <span aria-hidden="true">·</span>
                    <span>PostgreSQL Connected</span>
                  </div>
                  <p>
                    &copy; 2026{' '}
                    <strong>Bull Run Apex AI</strong>
                    {' '}· Founded by{' '}
                    <a href="/about"
                       className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                      Himanshu Bhmniya
                    </a>
                    {' '}· Paper Trading Only
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
