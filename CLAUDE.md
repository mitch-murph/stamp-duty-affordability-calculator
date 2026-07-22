# Stamp Duty Affordability Calculator

React + TypeScript SPA that estimates maximum property buying power after accounting for stamp duty, deposit, and other upfront costs. Targets GitHub Pages deployment.

## Stack

- **Vite** + **React 18** + **TypeScript** (strict)
- **Fonts**: `@fontsource-variable/geist` (sans) + `@fontsource/geist-mono` (mono) — bundled, no CDN
- **No UI library** — all styles are hand-written in `src/index.css` using CSS custom properties
- **No router** — single page, `base: './'` in `vite.config.ts` for GitHub Pages path compatibility

## Commands

```bash
npm run dev      # dev server (Vite HMR)
npm run build    # tsc + vite build → dist/
npm run preview  # serve dist/ locally
```

## Project structure

```
src/
  lib/
    types.ts       — shared TypeScript interfaces (State, Bracket, AffordabilityResult)
    schedules.ts   — stamp duty bracket data for NSW, VIC, QLD, WA, SA, TAS
    calc.ts        — stampDuty() and calcAffordability() (binary search, 60 iterations)
  hooks/
    useSpring.ts   — rAF-based ease-out cubic spring for animating big numbers
  components/
    StateSelect.tsx  — custom dropdown with state code badges
    MoneyInput.tsx   — $ prefix input, formats with toLocaleString on blur
    Slider.tsx       — range input with CSS gradient fill and 5-tick label row
    CompositionBar.tsx — animated stacked bar (deposit / duty / other)
    WorkingOut.tsx   — staggered row breakdown of the calculation
  App.tsx          — root; owns all state (stateCode, savings, depositPct, otherCosts)
  index.css        — all styles; uses --accent, --bg, --surface, etc. CSS vars
  main.tsx         — React root + font imports
```

## Stamp duty data

Brackets live in `src/lib/schedules.ts`. Format: `[upperBound, base, rate, marginalAbove]`.
Special case: when `base === 0 && marginalAbove === 0`, the calc applies a **flat rate on the full price** (used for VIC's $960k–$2M bracket).

### Verified sources (checked Jul 2026)

| State | Source URL | Notes |
|-------|-----------|-------|
| NSW | revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty | Rates effective FY2026/27 (annual CPI indexation); includes premium duty bracket above $3.87m; $20 min duty ignored (irrelevant for property) |
| VIC | sro.vic.gov.au (non-PPR current rates) | Non-principal place of residence rates; PPR rates differ below $550k |
| QLD | qro.qld.gov.au/duties/transfer-duty/calculate/rates/ | General rate; home concession rates are lower |
| WA  | wa.gov.au general transfer duty | General rate |
| SA  | revenuesa.sa.gov.au/stamp-duty-land/rate-of-stamp-duty | Unchanged since 2012 |
| TAS | sro.tas.gov.au/property-transfer-duties/rates-of-duty | Unchanged since Oct 2013 |

**ACT and NT are excluded** — ACT rates had drifted significantly from the design prototype data; NT uses a quadratic formula below $525k that can't be accurately represented with the linear bracket format.

### Updating brackets

When rates change (NSW adjusts thresholds annually via CPI), update the relevant array in `schedules.ts` and note the effective date in the comment above that state's block.

## Calculation logic

`calcAffordability(savings, depositPct, otherCosts, stateCode)` uses binary search (60 iterations, converges to ~$0.05) to find the largest property price `P` satisfying:

```
P × depositPct + stampDuty(P, state) + otherCosts ≤ savings
```

`stampDuty()` walks the bracket array and returns early on the first bracket where `price ≤ upperBound`.

## Deployment (GitHub Pages)

1. Create a GitHub repo and push `main`
2. Repo Settings → Pages → Source: **GitHub Actions**
3. Push to `main` — `.github/workflows/deploy.yml` builds and deploys automatically

The workflow uploads `dist/` via `actions/upload-pages-artifact` and deploys with `actions/deploy-pages`. The `base: './'` in `vite.config.ts` makes all asset paths relative, so the site works at any sub-path (e.g. `username.github.io/repo-name/`).

## Design

Ported from a Claude Design prototype (`tweaks-panel.jsx` + inline styles). The TweaksPanel prototyping shell was intentionally omitted from the production build. Accent colour is hardcoded to `#3d6b4a` in `App.tsx` (`ACCENT` constant) — change there if needed.
