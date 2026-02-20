# Dermalogica Routine Finder — Results Page

## Overview

Standalone prototype of the routine results page. Displays personalized product recommendations based on quiz answers (age, concern, tier, timing, sensitivity).

## Quick Start

1. Open `index.html` in a browser or serve via local server.
2. Quiz results are simulated in `js/app.js` (QUIZ_RESULTS). Change these to test different franchises.

## File Structure

```
routine-results/
├── index.html              # Entry point
├── README.md               # This file
├── docs/
│   ├── ARCHITECTURE.md     # Data flow, modules, DOM structure
│   ├── PRODUCT-RECOMMENDATIONS.md
│   ├── TIERED-UPSELLING-SYSTEM.md
│   ├── STICKY-TABS-AND-AMPM-UPDATE.md
│   └── SHOPIFY-INTEGRATION.md
├── css/
│   ├── globals.css         # Design tokens
│   └── styles.css          # Component styles
├── js/
│   ├── app.js              # Main application logic
│   ├── modules/            # ES modules (when refactored)
│   └── data/
│       └── product-data.js # Product database & recommendation engine
└── data/                   # Reference data
    ├── Routine Matrix.csv
    └── Quiz Questions & Logic.csv
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## Key Integration Points for Shopify

- **Quiz results:** Replace `QUIZ_RESULTS` with data from your quiz (URL params, Liquid, or app).
- **Product data:** `window.DermalogicaData.getRecommendations(quizResults)` returns products. Sync `PRODUCT_DETAILS` with Shopify product API.
- **Add to cart:** `addToCart()` is simulated. Replace with Shopify Cart API / AJAX.

See [docs/SHOPIFY-INTEGRATION.md](docs/SHOPIFY-INTEGRATION.md) for step-by-step integration guidance.

## Design System

- **globals.css:** Design tokens (colors, spacing, typography)
- **styles.css:** Component styles. Do not change class names or IDs.

## Data Sources

- `data/Routine Finder Quiz System [master] - Routine Matrix.csv` — Product-to-franchise mapping
- `data/Routine Finder Quiz System [master] - Quiz Questions & Logic.csv` — Quiz logic and franchise selection rules

## Testing

- **test.html** — Validates `DermalogicaData.getRecommendations()` returns expected product counts for sample quiz inputs. Open in a browser to run.
- **docs/VERIFICATION-CHECKLIST.md** — UI preservation checklist for refactoring.
