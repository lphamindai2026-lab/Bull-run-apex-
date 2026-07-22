export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
}

export interface SMCOutput {
  bos: { price: number; index: number; type: 'bullish' | 'bearish' }[];
  choch: { price: number; index: number; type: 'bullish' | 'bearish' }[];
  orderBlocks: { priceHigh: number; priceLow: number; index: number; type: 'demand' | 'supply'; mitigated: boolean }[];
  fvg: { top: number; bottom: number; center: number; index: number; type: 'bullish' | 'bearish'; mitigated: boolean }[];
  premiumZone: { start: number; end: number; equilibrium: number };
  discountZone: { start: number; end: number; equilibrium: number };
  killZones: { name: string; active: boolean; hours: string }[];
}

export function runSMCEngine(candles: Candle[]): SMCOutput {
  const bos: SMCOutput['bos'] = [];
  const choch: SMCOutput['choch'] = [];
  const orderBlocks: SMCOutput['orderBlocks'] = [];
  const fvg: SMCOutput['fvg'] = [];

  if (candles.length < 5) {
    return {
      bos: [],
      choch: [],
      orderBlocks: [],
      fvg: [],
      premiumZone: { start: 0, end: 0, equilibrium: 0 },
      discountZone: { start: 0, end: 0, equilibrium: 0 },
      killZones: []
    };
  }

  // 1. Calculate high and low extremes for Premium/Discount zones
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const absoluteHigh = Math.max(...highs);
  const absoluteLow = Math.min(...lows);
  const equilibrium = (absoluteHigh + absoluteLow) / 2;

  // Premium zone is top half, Discount is bottom half
  const premiumZone = { start: equilibrium, end: absoluteHigh, equilibrium };
  const discountZone = { start: absoluteLow, end: equilibrium, equilibrium };

  // 2. Identify CHoCH and BOS by tracking swing structures
  for (let i = 2; i < candles.length - 2; i++) {
    const prevHigh = candles[i - 1].high;
    const currHigh = candles[i].high;
    const nextHigh = candles[i + 1].high;

    const prevLow = candles[i - 1].low;
    const currLow = candles[i].low;
    const nextLow = candles[i + 1].low;

    // Detect swing high
    const isSwingHigh = currHigh > prevHigh && currHigh > nextHigh;
    // Detect swing low
    const isSwingLow = currLow < prevLow && currLow < nextLow;

    // Simulate structure breaks using recent swings
    if (isSwingHigh && i > 3) {
      if (candles[i + 1].close > currHigh) {
        bos.push({ price: currHigh, index: i + 1, type: 'bullish' });
      } else if (candles[i + 1].close < candles[i - 3].low) {
        choch.push({ price: currLow, index: i + 1, type: 'bearish' });
      }
    }

    if (isSwingLow && i > 3) {
      if (candles[i + 1].close < currLow) {
        bos.push({ price: currLow, index: i + 1, type: 'bearish' });
      } else if (candles[i + 1].close > candles[i - 3].high) {
        choch.push({ price: currHigh, index: i + 1, type: 'bullish' });
      }
    }
  }

  // 3. Identify Fair Value Gaps (FVG) - 3 candle sequence imbalance
  for (let i = 2; i < candles.length; i++) {
    const candle1 = candles[i - 2];
    const candle3 = candles[i];

    // Bullish FVG: Low of candle 3 is above High of candle 1
    if (candle3.low > candle1.high) {
      fvg.push({
        top: candle3.low,
        bottom: candle1.high,
        center: (candle3.low + candle1.high) / 2,
        index: i - 1,
        type: 'bullish',
        mitigated: false
      });
    }

    // Bearish FVG: High of candle 3 is below Low of candle 1
    if (candle3.high < candle1.low) {
      fvg.push({
        top: candle1.low,
        bottom: candle3.high,
        center: (candle1.low + candle3.high) / 2,
        index: i - 1,
        type: 'bearish',
        mitigated: false
      });
    }
  }

  // 4. Identify Order Blocks (OB) - last opposite colored candle before a expansion
  for (let i = 1; i < candles.length - 2; i++) {
    const cCurr = candles[i];
    const cNext = candles[i + 1];
    const cExpansion = candles[i + 2];

    const bodyCurr = Math.abs(cCurr.close - cCurr.open);
    const bodyExpansion = Math.abs(cExpansion.close - cExpansion.open);

    // Bullish expansion (Demand OB): Bearish candle followed by explosive bullish expansion
    if (cCurr.close < cCurr.open && cExpansion.close > cExpansion.open && bodyExpansion > bodyCurr * 2) {
      orderBlocks.push({
        priceHigh: cCurr.high,
        priceLow: cCurr.low,
        index: i,
        type: 'demand',
        mitigated: false
      });
    }

    // Bearish expansion (Supply OB): Bullish candle followed by explosive bearish expansion
    if (cCurr.close > cCurr.open && cExpansion.close < cExpansion.open && bodyExpansion > bodyCurr * 2) {
      orderBlocks.push({
        priceHigh: cCurr.high,
        priceLow: cCurr.low,
        index: i,
        type: 'supply',
        mitigated: false
      });
    }
  }

  // 5. Kill Zones detection based on hours (Simulated for universal UTC alignment)
  const killZones = [
    { name: 'Asian Kill Zone (Accumulation)', active: true, hours: '00:00 - 06:00 UTC' },
    { name: 'London Kill Zone (Manipulation/Judas)', active: false, hours: '07:00 - 10:00 UTC' },
    { name: 'New York Kill Zone (Distribution)', active: true, hours: '12:00 - 15:00 UTC' }
  ];

  return {
    bos,
    choch,
    orderBlocks: orderBlocks.slice(-5), // Keep latest 5 order blocks
    fvg: fvg.slice(-5), // Keep latest 5 gaps
    premiumZone,
    discountZone,
    killZones
  };
}
