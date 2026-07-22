import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Performance: Output standalone for smaller Docker images
  output: 'standalone',

  // ── Images: Allow external domains for charts and CDN assets
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: "https", hostname: "**.tradingview.com" },
      { protocol: "https", hostname: "s3.tradingview.com" },
      { protocol: "https", hostname: "**.coinglass.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },

  // ── Compression
  compress: true,

  // ── Power: Enable React strict mode for better performance
  reactStrictMode: true,

  // ── Experimental performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // ── Security + SEO headers
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: '/icon-:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/og-image.jpg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // Main security + SEO headers for all routes
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Strict Transport Security (HTTPS)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content Security Policy — allows TradingView iframes + Google indexing
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://s.tradingview.com https://www.googletagmanager.com",
              "frame-src 'self' https://www.tradingview.com https://widget.tradingview.com",
              "img-src 'self' data: blob: https:",
              "style-src 'self' 'unsafe-inline'",
              "connect-src 'self' https: wss:",
              "font-src 'self' data:",
              "media-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // ── Redirects (www to non-www for canonical SEO)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.bullrunapexai.com' }],
        destination: 'https://bullrunapexai.com/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
