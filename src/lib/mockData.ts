export interface TickerInfo {
  symbol: string;
  name: string;
  category: 'crypto' | 'forex' | 'stock' | 'commodity' | 'index';
  price: number;
  change: number;
  high: number;
  low: number;
  volume: string;
  openInterest?: string;
  fundingRate?: string;
  institutionalBias: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
}

export const TICKERS: TickerInfo[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'crypto', price: 104520, change: 4.82, high: 105800, low: 99800, volume: '14.2B', openInterest: '$18.4B', fundingRate: '+0.0120%', institutionalBias: 'STRONG_BULLISH' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', category: 'crypto', price: 3420, change: -1.45, high: 3550, low: 3390, volume: '4.8B', openInterest: '$7.2B', fundingRate: '+0.0080%', institutionalBias: 'NEUTRAL' },
  { symbol: 'SOLUSD', name: 'Solana / US Dollar', category: 'crypto', price: 184.50, change: 8.91, high: 188.20, low: 169.40, volume: '2.1B', openInterest: '$1.9B', fundingRate: '+0.0350%', institutionalBias: 'STRONG_BULLISH' },
  
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'forex', price: 1.0845, change: 0.22, high: 1.0890, low: 1.0810, volume: '85B', institutionalBias: 'BULLISH' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'forex', price: 1.2680, change: -0.15, high: 1.2720, low: 1.2650, volume: '62B', institutionalBias: 'BEARISH' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'forex', price: 154.60, change: -0.62, high: 155.80, low: 153.90, volume: '95B', institutionalBias: 'STRONG_BEARISH' },
  
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stock', price: 182.30, change: 1.15, high: 184.00, low: 181.20, volume: '52M', institutionalBias: 'BULLISH' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'stock', price: 875.12, change: 12.45, high: 880.00, low: 852.10, volume: '110M', institutionalBias: 'STRONG_BULLISH' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stock', price: 178.40, change: -3.82, high: 185.00, low: 175.50, volume: '88M', institutionalBias: 'BEARISH' },
  
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', category: 'commodity', price: 2342.50, change: 1.62, high: 2360.00, low: 2320.00, volume: '22B', institutionalBias: 'STRONG_BULLISH' },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', category: 'commodity', price: 28.45, change: 2.10, high: 28.90, low: 27.80, volume: '6.4B', institutionalBias: 'BULLISH' },
  { symbol: 'USOIL', name: 'Crude Oil WTI', category: 'commodity', price: 78.30, change: -1.80, high: 79.90, low: 77.20, volume: '12B', institutionalBias: 'BEARISH' },
  
  { symbol: 'SPX', name: 'S&P 500 Index', category: 'index', price: 5430, change: 0.75, high: 5450, low: 5395, volume: '44B', institutionalBias: 'BULLISH' },
  { symbol: 'NDX', name: 'NASDAQ 100 Index', category: 'index', price: 18820, change: 1.42, high: 18900, low: 18580, volume: '38B', institutionalBias: 'STRONG_BULLISH' }
];

export interface EconomicEvent {
  id: number;
  time: string;
  currency: string;
  event: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  actual: string | null;
  forecast: string;
  previous: string;
}

export const ECONOMIC_CALENDAR: EconomicEvent[] = [
  { id: 1, time: '13:30', currency: 'USD', event: 'CPI MoM (Consumer Price Index)', importance: 'HIGH', actual: '0.2%', forecast: '0.3%', previous: '0.4%' },
  { id: 2, time: '13:30', currency: 'USD', event: 'Initial Jobless Claims', importance: 'MEDIUM', actual: '215K', forecast: '220K', previous: '212K' },
  { id: 3, time: '14:45', currency: 'EUR', event: 'ECB Interest Rate Decision', importance: 'HIGH', actual: '4.25%', forecast: '4.25%', previous: '4.50%' },
  { id: 4, time: '15:00', currency: 'USD', event: 'ISM Services PMI', importance: 'HIGH', actual: null, forecast: '51.8', previous: '51.4' },
  { id: 5, time: '23:30', currency: 'AUD', event: 'Retail Sales MoM', importance: 'MEDIUM', actual: '0.6%', forecast: '0.3%', previous: '0.1%' }
];

export interface NewsItem {
  id: number;
  time: string;
  source: string;
  title: string;
  summary: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export const MARKET_NEWS: NewsItem[] = [
  { id: 1, time: '10 mins ago', source: 'Bloomberg', title: 'FED hint potential 25bps rate cut at upcoming FOMC gathering', summary: 'Federal Reserve officials suggested inflationary pressures are mitigating, opening the door for policy easing.', sentiment: 'BULLISH' },
  { id: 2, time: '25 mins ago', source: 'CoinDesk', title: 'Whale transfers 4,200 BTC off exchanges into multi-signature cold storage', summary: 'On-chain signals indicate massive accumulation as exchange reserves hit multi-year lows.', sentiment: 'BULLISH' },
  { id: 3, time: '1 hour ago', source: 'Reuters', title: 'Middle East geopolitical tensions escalate, crude oil rebounds above $78', summary: 'WTI gains steam as safety assets and commodities experience an inflow of defensive premium.', sentiment: 'BULLISH' },
  { id: 4, time: '2 hours ago', source: 'MarketWatch', title: 'Apple earnings forecast slightly below institutional targets due to hardware delays', summary: 'Tech giant targets dynamic supply chains to offset minor production limits in primary smartphone lines.', sentiment: 'BEARISH' }
];

export interface WhaleTransaction {
  id: number;
  time: string;
  asset: string;
  amount: string;
  value: string;
  type: 'WITHDRAWAL' | 'DEPOSIT' | 'OTC_TRANSFER';
  fromTo: string;
}

export const WHALE_TRACKER: WhaleTransaction[] = [
  { id: 1, time: '14:02', asset: 'BTC', amount: '1,450 BTC', value: '$151.5M', type: 'WITHDRAWAL', fromTo: 'Binance ➔ Unknown Cold Wallet' },
  { id: 2, time: '14:15', asset: 'ETH', amount: '18,200 ETH', value: '$62.2M', type: 'OTC_TRANSFER', fromTo: 'Coinbase Institutional Custody ➔ Genesis' },
  { id: 3, time: '14:38', asset: 'SOL', amount: '220,000 SOL', value: '$40.5M', type: 'DEPOSIT', fromTo: 'Unknown Wallet ➔ Kraken Exchange' },
  { id: 4, time: '14:55', asset: 'USDC', amount: '50,000,000 USDC', value: '$50.0M', type: 'DEPOSIT', fromTo: 'Circle Treasury ➔ Binance Peg' }
];

export interface LiquidityPoolZone {
  priceLevel: number;
  liquidityValue: string;
  type: 'SHORT_LIQ' | 'LONG_LIQ';
  percentage: number;
}

// Simulated SMC Structures detected for charts
export interface SMCStructure {
  type: 'CHOCH' | 'BOS' | 'OB' | 'FVG' | 'LIQ_POOL';
  level: number;
  levelHigh?: number; // for zones like OB/FVG
  levelLow?: number; // for zones like OB/FVG
  status: 'MITIGATED' | 'UNMITIGATED';
  direction: 'BULLISH' | 'BEARISH';
  label: string;
  timeframe: string;
}

export const MOCK_SMC_STRUCTURES: Record<string, SMCStructure[]> = {
  'BTCUSD': [
    { type: 'CHOCH', level: 98500, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H4 Bullish CHoCH', timeframe: '4H' },
    { type: 'BOS', level: 102400, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H1 Bullish BOS', timeframe: '1H' },
    { type: 'OB', level: 101000, levelHigh: 101500, levelLow: 100200, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H4 Demand Order Block', timeframe: '4H' },
    { type: 'FVG', level: 103200, levelHigh: 103800, levelLow: 102900, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H1 Bullish Fair Value Gap', timeframe: '1H' },
    { type: 'LIQ_POOL', level: 106200, status: 'UNMITIGATED', direction: 'BEARISH', label: 'Daily Short Liquidation Pool', timeframe: 'D' }
  ],
  'XAUUSD': [
    { type: 'CHOCH', level: 2315, status: 'MITIGATED', direction: 'BULLISH', label: 'H4 Bullish CHoCH', timeframe: '4H' },
    { type: 'BOS', level: 2335, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H1 Bullish BOS', timeframe: '1H' },
    { type: 'OB', level: 2320, levelHigh: 2326, levelLow: 2314, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H4 Demand Block', timeframe: '4H' },
    { type: 'FVG', level: 2338, levelHigh: 2341, levelLow: 2335, status: 'UNMITIGATED', direction: 'BULLISH', label: 'M15 Imbalance Gap', timeframe: '15M' }
  ],
  'EURUSD': [
    { type: 'CHOCH', level: 1.0790, status: 'MITIGATED', direction: 'BULLISH', label: 'H4 Bullish CHoCH', timeframe: '4H' },
    { type: 'BOS', level: 1.0830, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H1 Bullish BOS', timeframe: '1H' },
    { type: 'OB', level: 1.0805, levelHigh: 1.0815, levelLow: 1.0798, status: 'UNMITIGATED', direction: 'BULLISH', label: 'H1 Order Block', timeframe: '1H' }
  ]
};

// Depth of market simulation order book
export interface DOMRow {
  price: number;
  size: number;
  totalSize: number;
  type: 'ASK' | 'BID';
}

export function generateDOM(midPrice: number, tickSize: number): DOMRow[] {
  const rows: DOMRow[] = [];
  let askTotal = 0;
  let bidTotal = 0;

  // Generate 8 asks (sell orders) above mid price
  for (let i = 8; i >= 1; i--) {
    const size = Math.floor(Math.random() * 45) + 5 + (i === 4 ? 80 : 0); // huge block sometimes
    askTotal += size;
    rows.push({
      price: Number((midPrice + i * tickSize).toFixed(tickSize > 0.1 ? 2 : 4)),
      size,
      totalSize: askTotal,
      type: 'ASK'
    });
  }

  // Generate 8 bids (buy orders) below mid price
  for (let i = 1; i <= 8; i++) {
    const size = Math.floor(Math.random() * 45) + 5 + (i === 3 ? 95 : 0); // institutional iceberg block
    bidTotal += size;
    rows.push({
      price: Number((midPrice - i * tickSize).toFixed(tickSize > 0.1 ? 2 : 4)),
      size,
      totalSize: bidTotal,
      type: 'BID'
    });
  }

  return rows;
}
