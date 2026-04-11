# CLAUDE.md — iQ.finance

## Project Overview

**iQ.finance** is a luxury fintech PWA (Progressive Web App) — a personal finance dashboard with a dark, glassmorphic UI. It is currently a **frontend-only prototype** with hardcoded mock data (no backend, no API, no database). The app supports English and Hebrew (RTL) and can toggle between mobile "app" and desktop "web" layout modes.

Live deployment: GitHub Pages at `/iq-finance/` base path.

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | React 19 (JSX, no TypeScript)     |
| Build        | Vite 8                            |
| Icons        | lucide-react                      |
| Styling      | CSS-in-JS (inline styles), minimal CSS files |
| Font         | Aeonik (loaded via CDN `@font-face`) |
| PWA          | Manual service worker (`public/sw.js`) + `manifest.json` |
| Linting      | ESLint 9 (flat config) with react-hooks + react-refresh plugins |
| Deployment   | GitHub Pages via GitHub Actions    |
| Package mgr  | npm (with `legacy-peer-deps=true` in `.npmrc`) |

## Project Structure

```
iq-finance/
├── .github/workflows/deploy.yml   # CI: build + deploy to GitHub Pages on push to main
├── public/
│   ├── sw.js                       # Service worker (cache-first with network update)
│   ├── manifest.json               # PWA manifest
│   ├── icon-192.png, icon-512.png  # PWA icons
│   ├── apple-touch-icon.png        # iOS icon
│   ├── favicon.svg, icon.svg, icons.svg  # SVG icons
│   └── ...
├── src/
│   ├── main.jsx                    # Entry point — registers service worker, renders <App />
│   ├── App.jsx                     # **Entire application** — all components in one file (~1025 lines)
│   ├── App.css                     # Supplementary CSS (minimal, mostly unused scaffold styles)
│   └── index.css                   # CSS reset (box-sizing, margin)
├── index.html                      # HTML shell with PWA meta tags
├── vite.config.js                  # Vite config — base path set to /iq-finance/
├── eslint.config.js                # ESLint flat config
├── package.json                    # Scripts: dev, build, lint, preview
└── .npmrc                          # legacy-peer-deps=true
```

## Key Architecture Decisions

### Single-file component architecture
All UI components live in `src/App.jsx`. This includes:
- **Design tokens** — Color constants (`RICH_BLACK`, `SURFACE`, `EMERALD`, etc.)
- **Shared style objects** — `glassStyle`, `glassHover`, `smooth` transition
- **Utility components** — `Reveal` (scroll-in animation), `GlassPanel`, `ProgressBar`
- **Feature components** — `Wordmark`, `SplashScreen`, `SlideMenu`, `TransactionRow`, `MenuNavItem`, `LayoutToggle`, `AssetCard`, `BrushedMetalCard`, `GrowthTrace`, `WalletsScreen`
- **Main app** — `IQFinanceApp` (default export) manages all state

### Inline styles (CSS-in-JS)
Almost all styling is done via inline `style={{}}` objects. There are no CSS modules, Tailwind, or styled-components. Hover states are managed via `useState` + `onMouseEnter`/`onMouseLeave`. Animations use CSS `@keyframes` injected via `<style>` tags.

### i18n
Translations are a simple `t` object with `en` and `he` keys. RTL layout is toggled by checking `lang === "he"` and conditionally applying `flexDirection: "row-reverse"`, `textAlign: "right"`, etc.

### Screen routing
No router library — screen state (`"dashboard"` | `"wallets"`) is managed via `useState` in the root component.

### Currency
All monetary values displayed in Israeli New Shekel (₪).

## Commands

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

**No test framework is configured.** There are no tests.

## Development Conventions

### Styling
- Use inline `style={{}}` objects, consistent with existing code
- Design tokens are constants at the top of `App.jsx` — use them instead of hardcoding colors
- Glass/frosted effect: use `glassStyle` and `glassHover` objects
- Smooth transitions: spread `...smooth` into style objects
- All icons use `strokeWidth={1.5}` for a clean, consistent look

### Component patterns
- Hover states via `useState` + mouse events (not CSS `:hover`)
- Entrance animations via `<Reveal delay={ms}>` wrapper
- RTL support: every layout component accepts `isRtl` and adjusts `flexDirection`, `textAlign`, etc.
- New text strings must be added to both `t.en` and `t.he` translation objects

### ESLint rules
- Unused variables starting with uppercase or `_` are allowed (`varsIgnorePattern: '^[A-Z_]'`)
- React hooks rules enforced
- React Refresh rules enforced (components must be exportable for HMR)

### PWA considerations
- Base path is `/iq-finance/` — all asset references in `manifest.json`, `sw.js`, and `vite.config.js` must use this prefix
- Service worker uses stale-while-revalidate caching strategy
- Cache version is `'iq-finance-v1'` — bump when deploying breaking changes to cached assets

## Deployment

Push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Checkout → Node 20 → `npm ci --legacy-peer-deps`
2. `npm run build`
3. Upload `dist/` → Deploy to GitHub Pages

**Important:** The Vite `base` option is set to `/iq-finance/` — this must match the GitHub repo name for correct asset paths on GitHub Pages.

## Things to Watch

- **No TypeScript** — this is a plain JS/JSX project. Do not introduce `.ts`/`.tsx` files.
- **No router** — screen navigation is simple state. Adding react-router would be a significant refactor.
- **No state management library** — all state is local `useState` in the root component.
- **All mock data is hardcoded** — balances, transactions, etc. are constants in `App.jsx`.
- **Single-file app** — `App.jsx` is ~1025 lines. When adding features, add components in the same file unless explicitly asked to split.
- **Font loading** — Aeonik is loaded from a third-party CDN via `@font-face` in a `<style>` tag at the bottom of the root component.
- **No `.env` files** — there are no environment variables or secrets.
