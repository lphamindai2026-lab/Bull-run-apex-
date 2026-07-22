'use client';

import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map our cleaner ticker symbols to TradingView exchange-prefixed tickers
  const getTVTicker = (sym: string) => {
    switch (sym) {
      case 'BTCUSD': return 'BINANCE:BTCUSDT';
      case 'ETHUSD': return 'BINANCE:ETHUSDT';
      case 'SOLUSD': return 'BINANCE:SOLUSDT';
      case 'EURUSD': return 'FX_IDC:EURUSD';
      case 'GBPUSD': return 'FX_IDC:GBPUSD';
      case 'USDJPY': return 'FX_IDC:USDJPY';
      case 'AAPL': return 'NASDAQ:AAPL';
      case 'NVDA': return 'NASDAQ:NVDA';
      case 'TSLA': return 'NASDAQ:TSLA';
      case 'XAUUSD': return 'OANDA:XAUUSD';
      case 'XAGUSD': return 'OANDA:XAGUSD';
      case 'USOIL': return 'TVC:USOIL';
      case 'SPX': return 'SP:SPX';
      case 'NDX': return 'NASDAQ:NDX';
      default: return `BINANCE:${sym}T`;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget iframe if any
    container.innerHTML = '';

    const widgetId = `tradingview_${Math.random().toString(36).substring(2, 9)}`;
    const childDiv = document.createElement('div');
    childDiv.id = widgetId;
    childDiv.className = 'w-full h-full';
    container.appendChild(childDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (typeof TradingView !== 'undefined') {
        // @ts-ignore
        new TradingView.widget({
          width: '100%',
          height: '100%',
          symbol: getTVTicker(symbol),
          interval: '60',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: widgetId,
          backgroundColor: '#070c18',
          gridColor: 'rgba(42, 46, 57, 0.15)',
          studies: [
            'RSI@tv-basicstudies',
            'MASimple@tv-basicstudies'
          ]
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script from header to prevent memory leakage
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-slate-900/60 bg-[#070c18]" ref={containerRef} />
  );
}
