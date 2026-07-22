# 🔺 Bull Run Apex AI — Production Deployment Guide
**Founded by Himanshu Bhmniya**

---

## ✅ STEP 1 — Get a Domain (You do this — 5 minutes)

1. Go to **[Namecheap.com](https://namecheap.com)** (recommended, ~$10/year)
2. Search for: `bullrunapexai.com`
3. Purchase the domain
4. You'll need this in Step 3

---

## ✅ STEP 2 — Create Free Hosting on Vercel (You do this — 2 minutes)

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up** → use your GitHub account
3. Click **Add New Project**
4. Upload or connect this code repository
5. Vercel auto-detects Next.js — just click **Deploy**
6. Your site goes live at `https://bull-run-apex-ai.vercel.app` (free subdomain)

---

## ✅ STEP 3 — Connect Your Domain to Vercel (You do this — 3 minutes)

1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add your domain: `bullrunapexai.com`
3. Vercel shows you DNS records to add
4. Go to Namecheap → **Domain** → **Advanced DNS**
5. Add the records Vercel shows you
6. Wait 5-60 minutes for DNS propagation
7. Your site is live at **https://bullrunapexai.com** 🎉

---

## ✅ STEP 4 — Set Environment Variables in Vercel (You do this — 2 minutes)

In Vercel → Project → Settings → Environment Variables, add:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | `https://bullrunapexai.com` |
| `GEMINI_API_KEY` | Your Gemini API key (optional) |
| `OPENAI_API_KEY` | Your OpenAI key (optional) |

**Free PostgreSQL options:**
- [Neon.tech](https://neon.tech) — Free tier, PostgreSQL
- [Supabase.com](https://supabase.com) — Free tier, PostgreSQL  
- [Railway.app](https://railway.app) — Free tier with $5 credit

---

## ✅ STEP 5 — Google Search Console (You do this — 5 minutes)

After your domain is live:

1. Go to **[search.google.com/search-console](https://search.google.com/search-console)**
2. Click **Add Property** → Domain → enter `bullrunapexai.com`
3. Choose **HTML tag** verification method
4. Copy the code (looks like: `abc123def456`)
5. Add to Vercel env vars: `GOOGLE_SITE_VERIFICATION=abc123def456`
6. Redeploy on Vercel
7. Click **Verify** in Google Search Console
8. Go to **Sitemaps** → Submit: `https://bullrunapexai.com/sitemap.xml`
9. Go to **URL Inspection** → Enter your homepage → **Request Indexing**

**Your brand name appears on Google within 3-7 days!**

---

## 📋 What's Already Done (No Action Needed)

| Item | Status |
|---|---|
| robots.txt | ✅ Auto-generated at `/robots.txt` |
| sitemap.xml | ✅ Auto-generated at `/sitemap.xml` |
| manifest.webmanifest | ✅ PWA manifest at `/manifest.webmanifest` |
| Open Graph image | ✅ `/og-image.jpg` (1200×630) |
| App icons (192+512px) | ✅ `/icon-192.png`, `/icon-512.png` |
| Favicon | ✅ `/favicon.svg` |
| JSON-LD Schema.org | ✅ Organization, WebSite, SoftwareApp, Person |
| Canonical URLs | ✅ All pages have canonical tags |
| Twitter Cards | ✅ `summary_large_image` configured |
| Page metadata | ✅ Every page has unique title + description |
| Security headers | ✅ CSP, HSTS, XSS protection |
| WWW redirect | ✅ www → non-www (301) |
| Performance | ✅ Image optimization, compression, caching |
| Mobile responsive | ✅ All pages responsive |
| Accessibility | ✅ ARIA labels, semantic HTML, focus styles |

---

## 📞 Support

**Himanshu Bhmniya**
- Email: bullrunapex@gmail.com
- Instagram: @legacy_boy_1
- Telegram: @lphamindai_bot
- WhatsApp: [Channel](https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i)
