# Supabase Database Setup — Bull Run Apex AI
# Founded by Himanshu Bhmniya

## Your Supabase Project
- Project ref: ftebjjgbtwpfwyyelvei
- URL: https://ftebjjgbtwpfwyyelvei.supabase.co
- Dashboard: https://supabase.com/dashboard/project/ftebjjgbtwpfwyyelvei

---

## STEP 1 — Get Your Database Password

1. Go to: https://supabase.com/dashboard/project/ftebjjgbtwpfwyyelvei/settings/database
2. Scroll to "Connection string"
3. Copy the password (or click "Reset database password" to create a new one)

---

## STEP 2 — Run the SQL Migration

1. Go to: https://supabase.com/dashboard/project/ftebjjgbtwpfwyyelvei/sql/new
2. Paste the ENTIRE contents of: drizzle/0000_overconfident_spectrum.sql
3. Click "Run"
4. All 13 tables will be created instantly

---

## STEP 3 — Set DATABASE_URL in Vercel

Your connection string format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.ftebjjgbtwpfwyyelvei.supabase.co:5432/postgres
```

Or use the pooler (recommended for Vercel serverless):
```
postgresql://postgres.ftebjjgbtwpfwyyelvei:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

In Vercel:
1. Go to your project → Settings → Environment Variables
2. Add: DATABASE_URL = (paste your connection string with real password)
3. Redeploy

---

## STEP 4 — Set NEXT_PUBLIC_SITE_URL in Vercel

After first Vercel deployment, copy your URL (e.g. https://bull-run-apex-ai.vercel.app)
Add it as: NEXT_PUBLIC_SITE_URL = https://bull-run-apex-ai.vercel.app

---

## Tables that will be created

1. users          — Accounts, balances, settings, 2FA
2. trades         — Paper trading positions
3. portfolios     — Asset holdings
4. alerts         — Price & SMC alerts
5. chat_sessions  — AI conversation history
6. chat_messages  — AI messages (Gemini/Claude/GPT-4o)
7. ai_memory      — AI memory per user
8. support_tickets — Help desk tickets
9. feedback_items  — User feedback & bug reports
10. feature_flags  — Feature enable/disable flags
11. app_versions   — Platform changelog
12. announcements  — System announcements
13. system_logs    — Security audit trail
