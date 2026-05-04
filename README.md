# MTR IB/Affiliate Page

Next.js 14 demo for the MyTradingReviews IB & Affiliate landing page.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Syne + DM Sans (Google Fonts)

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. Framework: Next.js (auto-detected)
4. No env vars needed
5. Click Deploy

## Project structure

```
app/
  layout.tsx        # Root layout + Google Fonts
  page.tsx          # Home (renders Navbar + Hero)
  globals.css       # Global styles, CSS vars, animations

components/
  Navbar.tsx        # Top nav with active IB/Affiliate underline
  Hero.tsx          # Full hero: left copy + right floating cards + bottom stats
```
