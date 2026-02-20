# Routine Finder Results — Architecture

## Data Flow

```
Quiz (external) → QUIZ_RESULTS → DermalogicaData.getRecommendations() → renderRoutinePanel()
```

1. **Quiz results** are provided as `QUIZ_RESULTS` (currently simulated in `js/app.js`). In Shopify, this will come from URL params, Liquid variables, or an app.
2. **Product recommendations** are fetched via `window.DermalogicaData.getRecommendations(quizResults)`.
3. **Panels** are rendered by `renderRoutinePanel(tier, products)` for each tier (Essential, Enhanced, Comprehensive).

## Module Responsibilities

| File | Responsibility |
|------|-----------------|
| `js/app.js` | Main entry, init, state (QUIZ_RESULTS, selectedTiming), orchestration |
| `js/data/product-data.js` | Product database, routine matrix, recommendation engine |

## State

- **QUIZ_RESULTS:** `{ age, concern, tier, timing, sensitive }` — determines franchise and products
- **selectedTiming:** `'AM'` or `'PM'` — which routine view is shown (when quiz has Both)
- **upgradeProductsForTier:** `{ essential: [...], enhanced: [...] }` — product slugs needed to upgrade
- **Cart:** In-memory array of `{ productSlug, price, productName, size }` (simulated; replace with Shopify Cart API)

## Required DOM IDs and Structure

**Do not remove or rename these IDs** — the JavaScript depends on them:

| ID | Purpose |
|----|---------|
| `#sticky-tabs-container` | Sticky tier tabs bar; JS sets `top` for positioning below header |
| `#skin-analysis-content` | Accordion content; dynamically populated with skin profile |
| `#skin-analysis-toggle` | Accordion trigger |
| `#skin-analysis-subtitle` | Goal description in accordion header |
| `#panel-essential` | Essential tier product panel |
| `#panel-enhanced` | Enhanced tier product panel |
| `#panel-comprehensive` | Comprehensive tier product panel |
| `#tab-essential`, `#tab-enhanced`, `#tab-comprehensive` | Tab buttons |
| `#timing-toggle-container` | AM/PM toggle (desktop) |
| `#mobile-ampm-toggle` | AM/PM toggle (mobile) |
| `#upgrade-essential`, `#upgrade-enhanced`, `#upgrade-comprehensive` | Upgrade sections |
| `#kits-section` | Kits & sets section |
| `#cart-toggle`, `#cart-count` | Cart button and badge |
| `#mini-cart`, `#mini-cart-items`, `#mini-cart-footer` | Mini-cart dropdown |
| `#toast`, `#toast-message` | Toast notification |
| `#email-modal`, `#retake-modal` | Modals |

## Dependencies

- **Tailwind CDN** — loaded in `index.html`; config inline
- **Lucide icons** — `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`
- **Script order:** Lucide → product-data.js → app.js
