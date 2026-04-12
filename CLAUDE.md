# CLAUDE.md — iQ.finance

## Project Overview

**iQ.finance** is a luxury fintech PWA — a personal finance dashboard with a dark, glassmorphic UI. It supports English and Hebrew (RTL) and toggles between mobile "app" and desktop "web" layout modes.

**Live deployments:**
- GitHub Pages: `https://idogal0210-web.github.io/iq-finance/`

**Backend:** Supabase (PostgreSQL). Tables: `wallets`, `transactions`, `categories`, `subcategories`.

---

## Tech Stack

| Layer            | Technology                                           |
|------------------|------------------------------------------------------|
| Framework        | React 19 + TypeScript (strict)                       |
| Build            | Vite 8                                               |
| Routing          | React Router v7                                      |
| Data fetching    | TanStack React Query v5                              |
| Backend/DB       | Supabase (`@supabase/supabase-js`)                   |
| Icons            | lucide-react (`strokeWidth={1.5}` everywhere)        |
| Styling          | Inline CSS-in-JS + CSS Modules for structural styles |
| Font             | Aeonik (CDN `@font-face` in `index.html`)            |
| Testing          | Vitest + @testing-library/react (jsdom)              |
| Linting          | ESLint 9 flat config                                 |
| Deployment       | GitHub Pages (CI)                                    |
| Package mgr      | npm (`legacy-peer-deps=true` in `.npmrc`)            |

---

## Project Structure

```
iq-finance/
├── .github/workflows/deploy.yml   # CI: test → build → deploy to GitHub Pages
├── public/                        # sw.js, manifest.json, PWA icons, favicon
├── src/
│   ├── main.tsx                   # Entry: registers service worker, renders <App />
│   ├── App.tsx                    # Root: QueryClientProvider, BrowserRouter, providers, routes
│   ├── theme/
│   │   ├── tokens.ts              # Color/spacing constants (RICH_BLACK, EMERALD, etc.)
│   │   ├── styles.ts              # Shared style objects (glassStyle, smooth, noiseUrl)
│   │   └── index.ts               # Re-exports tokens + styles
│   ├── types/index.ts             # All shared TypeScript types and interfaces
│   ├── i18n/translations.ts       # EN + HE translation strings
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client (reads VITE_SUPABASE_URL/ANON_KEY)
│   │   └── db.ts                  # All DB operations: fetch/insert/update/delete
│   ├── services/
│   │   └── financeService.ts      # Mock service: balance, growth chart, assets, cards (not yet Supabase)
│   ├── hooks/
│   │   └── useFinanceQueries.ts   # React Query hooks for both mock and live data
│   ├── contexts/
│   │   ├── FinanceContext.tsx     # Live Supabase: wallets, transactions, derived totals
│   │   ├── LanguageContext.tsx    # i18n state: lang, isRtl, t, toggleLang
│   │   └── LayoutContext.tsx      # Layout mode: "app" | "web", containerMaxWidth
│   ├── data/
│   │   └── mockData.ts            # Hardcoded mock data (balance, growth, assets, cards, transactions)
│   ├── components/
│   │   ├── SplashScreen.tsx       # Animated splash on first load
│   │   ├── Wordmark.tsx           # iQ logo + tagline
│   │   ├── AddTransactionSheet.tsx # Bottom sheet: manual entry + CSV import
│   │   ├── dashboard/
│   │   │   ├── BalanceSection.tsx # Balance display + growth sparkline
│   │   │   ├── AIInsightCard.tsx  # AI-generated financial insight card
│   │   │   ├── GoalArchitect.tsx  # Financial goals section
│   │   │   ├── GrowthTrace.tsx    # SVG sparkline chart
│   │   │   └── TransactionRow.tsx # Single transaction list item
│   │   ├── wallets/
│   │   │   ├── WalletsScreen.tsx  # Wallets + assets + cards screen
│   │   │   ├── AssetCard.tsx      # Individual asset card
│   │   │   └── BrushedMetalCard.tsx # Credit/debit card visual
│   │   ├── settings/
│   │   │   └── SettingsScreen.tsx # Category Manager (live CRUD via Supabase)
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx      # Fixed bottom navigation bar
│   │   │   ├── LayoutToggle.tsx   # App ↔ Web layout switcher button
│   │   │   └── SlideMenu.tsx      # Side drawer menu
│   │   └── ui/
│   │       ├── GlassPanel.tsx     # Frosted glass container
│   │       ├── ProgressBar.tsx    # Animated progress bar
│   │       └── Reveal.tsx         # Scroll-in entrance animation wrapper
│   └── test/
│       ├── setup.ts               # @testing-library/jest-dom setup
│       └── *.test.ts              # Vitest tests (17 passing)
├── index.html                     # HTML shell: Aeonik font, PWA meta, viewport lock
├── vite.config.ts                 # base: VITE_BASE_PATH ?? '/'
└── tsconfig.json
```

---

## Routes

| Path         | Component        | Notes                            |
|--------------|------------------|----------------------------------|
| `/`          | `Dashboard`      | Main screen, live transactions   |
| `/wallets`   | `WalletsScreen`  | Assets, wallet cards             |
| `/settings`  | `SettingsScreen` | Category Manager (Supabase CRUD) |

---

## Data Sources

| Data            | Source                     | Hook / Context              |
|-----------------|----------------------------|-----------------------------|
| Wallets         | Supabase `wallets`         | `useDbWallets()` / `FinanceContext` |
| Transactions    | Supabase `transactions`    | `useDbTransactions()` / `FinanceContext` |
| Categories      | Supabase `categories`      | `useDbCategories()`         |
| Subcategories   | Supabase `subcategories`   | `useDbSubcategories()`      |
| Balance display | Mock (`financeService.ts`) | `useBalance()`              |
| Growth chart    | Mock (`financeService.ts`) | `useGrowthPoints()`         |
| Assets          | Mock (`financeService.ts`) | `useAssets()`               |
| Cards           | Mock (`financeService.ts`) | `useCards()`                |

> **Note:** `totalBalance` in `FinanceContext` is computed from live Supabase wallets. The mock `fetchBalance` in `financeService.ts` is a separate unused path — its data is not shown on dashboard when Supabase wallets exist.

---

## Environment Variables

```
VITE_SUPABASE_URL=...       # Supabase project URL
VITE_SUPABASE_ANON_KEY=...  # Supabase anon public key
VITE_BASE_PATH=...          # Base path (GitHub Actions sets /iq-finance/)
```

---

## Commands

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run test         # Vitest watch mode
npm run test:run     # Vitest single run (used in CI)
npm run test:coverage # Coverage report
```

---

## Styling Conventions

- **Inline `style={{}}`** everywhere — no Tailwind, no styled-components
- **Design tokens** from `src/theme/` — always use `RICH_BLACK`, `EMERALD`, `SURFACE`, etc. instead of hardcoding colors
- **Shared style objects** — spread `...glassStyle` for glass panels, `...smooth` for transitions
- **Hover states** — via `useState` + `onMouseEnter`/`onMouseLeave` (not CSS `:hover`)
- **CSS Modules** — used only for structural animation/layout styles (`GlassPanel.module.css`, `BottomNav.module.css`, etc.)
- **Icons** — always `strokeWidth={1.5}`

---

## i18n (EN / HE)

- `LanguageContext` provides `{ lang, isRtl, t, toggleLang }`
- Add new strings to **both** `en` and `he` objects in `src/i18n/translations.ts`
- RTL layout: conditionally apply `flexDirection: 'row-reverse'` and `textAlign: 'right'` based on `isRtl`
- Currency: ILS (₪) primary; `AddTransactionSheet` also supports USD ($) and EUR (€)

---

## AddTransactionSheet Features

- Manual entry: amount, currency (₪/$/ €), type (income/expense), category, subcategory, description
- CSV import: parses bank statement CSVs (auto-detects date/amount/description columns, supports Hebrew headers)
- Invalidates `['db-transactions']` and `['db-wallets']` React Query caches after insert

---

## Deployment

> **PERMANENT RULE: All deployments target GitHub Pages exclusively.**
> Do not add Vercel, Netlify, or any other hosting platform. Do not create `vercel.json`, `netlify.toml`, or equivalent files.

### GitHub Pages
- Live URL: `https://idogal0210-web.github.io/iq-finance/`
- Push to `main` → CI runs tests → builds → stamps SW cache with git SHA → deploys `dist/`
- Build env vars injected from GitHub Actions secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_BASE_PATH=/iq-finance/` is hardcoded in the workflow — never change this

### Service Worker / PWA
- `public/sw.js` cache key pattern: `iq-finance-v{N}` — CI replaces this with `iq-finance-{git-sha}` on every deploy (automatic cache bust)
- SW registration in `main.tsx` uses `import.meta.env.BASE_URL` — do not hardcode `/iq-finance/`
- `public/manifest.json` paths are hardcoded to `/iq-finance/` — keep in sync with the repo name

### BrowserRouter base path
`App.tsx` uses `basename={import.meta.env.BASE_URL.replace(/\/$/, '')}` to strip trailing slash and avoid double-slash route paths (`//settings`).

---

## Things to Watch

- **TypeScript strict mode** — no implicit `any`, proper typing required
- **Two data layers coexist** — mock `financeService.ts` and live `lib/db.ts`. The dashboard uses live Supabase data when available (falling back to mock). `FinanceContext` is always live.
- **React Query cache keys** — invalidate the right key after mutations (`['db-transactions']`, `['db-wallets']`, etc.)
- **CSS Modules imports** — some components have `.module.css` files; don't confuse with inline styles
- **No auth** — Supabase is currently accessed with the anon key (no user login/RLS)
- **Tests run in CI** before deploy — keep them passing
