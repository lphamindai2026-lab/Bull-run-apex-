import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bull Run Apex AI — Institutional Trading Platform',
    short_name: 'Apex AI',
    description: 'The world\'s most advanced AI-powered trading platform by Himanshu Bhmniya. Smart Money Concepts, TradingView charts, AI coaching.',
    start_url: '/',
    display: 'standalone',
    background_color: '#03060d',
    theme_color: '#10b981',
    orientation: 'portrait-primary',
    categories: ['finance', 'trading', 'productivity', 'ai'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [],
  };
}
