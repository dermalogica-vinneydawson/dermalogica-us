# Shopify Integration Guide

This guide helps development agencies integrate the Routine Finder Results page into a Shopify store.

## Reference Implementation

See the `collection-product-recommendation-quiz/` folder in this repo for a similar Shopify integration pattern:

- **Sections:** `sections/product-quiz-button.liquid` — add section to theme
- **Snippets:** `snippets/product-quiz.liquid` — reusable template
- **Assets:** `assets/product-quiz.js`, `assets/product-quiz.css` — JS and CSS

## Integration Steps

### 1. Create Theme Assets

- Copy `css/globals.css` and `css/styles.css` into your theme's `assets/` folder (e.g. `routine-results.css` — concatenate or use separate files).
- Copy `js/data/product-data.js` to `assets/routine-product-data.js`.
- Copy `js/app.js` to `assets/routine-results.js`.

### 2. Create a Section or Template

Create a new section (e.g. `sections/routine-results.liquid`) that:

- Renders the HTML structure from `index.html` (main content area; header/footer may come from theme).
- Loads Tailwind CDN or your compiled Tailwind build.
- Loads Lucide icons.
- Loads `routine-product-data.js` then `routine-results.js`.

### 3. Wire Quiz Results

Replace the simulated `QUIZ_RESULTS` in `app.js` with real data. Options:

- **URL parameters:** e.g. `?age=28&concern=Dullness&tier=Essential&timing=Both`
- **Liquid variables:** If the quiz is a separate page, pass results via redirect URL or session.
- **Shopify App / Metafields:** Store quiz results in customer metafields and read via Liquid or API.

### 4. Replace Add to Cart

The current `addToCart()` in `app.js` is simulated. Replace it with:

- **Shopify Cart API:** `POST /cart/add.js` with `items: [{ id: variantId, quantity: 1 }]`
- Map product slugs to Shopify variant IDs (via product handle or metafield).

### 5. Sync Product Data

`product-data.js` contains `PRODUCT_DETAILS` and `PRODUCT_SIZES`. For production:

- Fetch product data from Shopify (Admin API or Storefront API).
- Map product handles to the recommendation engine's product names.
- Ensure `getRecommendations()` returns objects with `details.price`, `details.image`, etc., matching Shopify product/variant data.

## Required DOM IDs and Classes

**Do not remove or rename** the IDs and classes documented in [ARCHITECTURE.md](ARCHITECTURE.md). The JavaScript selects elements by these identifiers.

## Tailwind

- **Current:** Tailwind CDN with inline config in `index.html`.
- **Shopify:** Either keep CDN, or compile Tailwind and include the output CSS in your theme assets. Ensure design tokens (`--background`, `--foreground`, etc.) from `globals.css` are preserved.
