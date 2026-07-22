import test from 'node:test';
import assert from 'node:assert';

// Simulating the mathematical P&L execution formulas utilized in our Trading terminal
function calculatePositionPnL(type: 'BUY' | 'SELL', entryPrice: number, exitPrice: number, size: number, leverage: number): number {
  const pnlFactor = type === 'BUY' ? (exitPrice - entryPrice) : (entryPrice - exitPrice);
  return pnlFactor * size * leverage;
}

// Simulating structural margin limits
function calculateMarginRequired(size: number, entryPrice: number, leverage: number): number {
  const positionNotional = size * entryPrice;
  return positionNotional / leverage;
}

test('BUY Long Trade P&L Calculations', () => {
  // Buy 2 contracts of BTCUSD at 100,000, sell at 105,000 with 10x leverage
  const pnl = calculatePositionPnL('BUY', 100000, 105000, 2, 10);
  assert.strictEqual(pnl, 100000); // 5,000 * 2 * 10 = 100,000
});

test('SELL Short Trade P&L Calculations', () => {
  // Short 10 contracts of EURUSD at 1.1000, close at 1.0800 with 50x leverage
  const pnl = calculatePositionPnL('SELL', 1.1000, 1.0800, 10, 50);
  assert.ok(Math.abs(pnl - 10) < 0.0001); // 0.02 * 10 * 50 = 10.0
});

test('Leverage Margin Requirement Calculations', () => {
  // 0.5 BTC contracts at 100,000 with 20x leverage
  const margin = calculateMarginRequired(0.5, 100000, 20);
  assert.strictEqual(margin, 2500); // (0.5 * 100,000) / 20 = 2,500
});

test('Extreme leverage margin check (100x)', () => {
  const margin = calculateMarginRequired(1, 100000, 100);
  assert.strictEqual(margin, 1000); // 100,000 / 100 = 1,000
});
