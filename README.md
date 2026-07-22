# 🔺 Bull Run Apex AI (Institutional Multi-Model Suite)

Welcome to **Bull Run Apex AI**, the world's most advanced, production-grade financial analysis and simulated trading ecosystem. This platform is engineered to serve as a complete quantitative workstation combining TradingView charts, automated Smart Money Concept (SMC) markers, high-frequency order-book DOM profiles, multi-model AI routing, and cognitive behavioral trading logs.

---

## 🚀 Key Architectural Features

### 1. 🖥️ Interactive Trading Terminal
- **Multi-Asset Scanners:** Instant hot-switching between major Crypto (BTCUSD, ETHUSD, SOLUSD), Forex (EURUSD, GBPUSD, USDJPY), Stocks (AAPL, NVDA, TSLA), Commodities (Gold, Silver, Crude Oil), and Indices (S&P 500, NASDAQ).
- **Interactive SVG Candlesticks:** Implements high-frequency tick calculations that periodically walk candle bodies, highs, and lows in real-time.
- **Smart Money Concepts (SMC) Overlay:** Autoplots unmitigated Order Blocks (OB), structural imbalances via Fair Value Gaps (FVG), Bearish Change of Characters (CHoCH), and Bullish Breaks of Structure (BOS) on the chart canvas.
- **Depth of Market (DOM) Order Flow:** Simulates institutional order queues with buy/sell size grids that adjust as prices tick.
- **Calculators & Risk Management:** Instant on-the-fly math computing margin collateral, position notional values, and risk-to-reward cash statistics.

### 2. 🧠 Multi-Model AI Routing Hub
- **Provider Switching:** Dynamically route queries through Google Gemini, Claude, or GPT-4o systems.
- **Memory Integration:** Conversation streams are written directly to PostgreSQL `chat_sessions` and `chat_messages` tables so users never lose context.
- **Attachment Auditors:** Drag-and-drop simulation for uploading trading chart screenshots (JPG/PNG) or macro-economic documents (PDF).
- **Preset Generators:** Fast links to generate automated Pine Script v5 strategy codes or get immediate psychological advice on recent trading sessions.

### 3. 📓 Behavioral Trade Journal
- **Statistical Aggregators:** Real-time calculation of Win Rates, Net Profit/Loss, and Profit Factors from closed Postgres rows.
- **Cognitive Bias Tracker:** Displays progress metrics for logged execution mistakes (e.g. FOMO, Overleveraging, Revenge Trading, early exits).
- **Circular Day Calendar:** Renders a gorgeous calendar with color-coded profit/loss indicators summarizing daily performance.
- **AI Psychiatry Feedback:** Fetches and expands detailed neural feedback reviews stored alongside each completed trade record.

### 4. 💼 Portfolio & Webhook Signal Alerts
- **Allocation Charting:** Live pie allocation progress bars detailing asset distributions and net-worth (sim cash + holdings).
- **Price & Structural Alerts:** Set algorithmic triggers (Price limits, BOS/CHoCH breaks, FVG sweeps) dispatched directly to SMS, SMTP Email, Telegram channels, or Discord Webhooks.
- **Console Feed:** Real-time log terminal outputting dispatch confirmations of webhooks as price action swings.

### 5. 💳 Billing & Partner Affiliate Programs
- **Mock Stripe Merchant Gateways:** Integrated checkouts updating user access levels (Free, Pro, Institutional) with high-fidelity spinner screens.
- **Promotion & Affiliate links:** Copier tools for unique relational referral links and promo coupons (e.g. `APEX50`) that apply 50% discounts on the fly.

### 6. 🛡️ Secure Admin Suite
- **Demo Access Elevators:** Prevent dead ends! Instantly promote your mock profile to administrator status with a single-click bypass button.
- **RBAC Management:** Toggles to promote/demote user status or change subscription levels in PostgreSQL.
- **Support Ticketing Pipelines:** Evaluators can submit mock support issues, switch tabs, and resolve them.
- **Relational Activity logs:** Live-scrolling trail listing registrations, logins, trade logs, and billing adjustments.

---

## 🛠️ Tech Stack & Relational Schema

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide icons
- **Database Backend:** PostgreSQL database pool queried via Drizzle ORM
- **Database Schema (`src/db/schema.ts`):**
  1. `users`: Credentials, simulated funds balance, referral linkages, active subscription tiers.
  2. `trades`: Simulated position entry/exit markers, leverage multiplier, emotion state, mistakes, and AI feedback blocks.
  3. `portfolios`: Aggregate asset holdings size and average cost.
  4. `alerts`: Active price/SMC trigger thresholds and notification channels.
  5. `chat_sessions` & `chat_messages`: Permanent multi-model AI discussions memory logs.
  6. `support_tickets`: Help desk requests.
  7. `system_logs`: Relational audit trails.
  8. `announcements`: Global broadcast updates.

---

## 📦 Local Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment variables:**
   Copy `.env.example` to `.env` and fill out your PostgreSQL database string:
   ```bash
   cp .env.example .env
   ```

3. **Push Schema & Run migrations:**
   ```bash
   npx drizzle-kit push
   ```

4. **Start the Development server:**
   ```bash
   npm run dev
   ```

5. **Run the Math Unit tests:**
   ```bash
   node --test src/__tests__/trading.test.ts
   ```

---

## 🐳 Docker Deployment

To launch the entire platform side-by-side with a local PostgreSQL container, execute:
```bash
docker-compose up --build
```
The application will boot at `http://localhost:3000`.
