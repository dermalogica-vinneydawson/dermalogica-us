# Product Recommendation System

## Overview
The product recommendation system has been updated to dynamically generate product recommendations based on quiz results using data from the **Routine Matrix** and **Quiz Questions & Logic** spreadsheets.

## Files Updated/Created

### 1. `product-data.js` (NEW - 75KB)
- Contains the complete product database with 270+ product configurations
- Includes pricing, images, descriptions, and categories for all products
- Contains the full routine matrix from the CSV (all franchises, tiers, timings)
- Provides the recommendation engine with functions:
  - `getRecommendations(quizResults)` - Returns products based on quiz answers
  - `selectFranchise(concern, age)` - Determines which franchise to use

### 2. `app.js` (UPDATED - 16KB)
- Completely rewritten to support dynamic product recommendations
- Functions:
  - `loadRoutineRecommendations()` - Loads products for all tier levels
  - `renderRoutinePanel()` - Dynamically generates product cards
  - `renderStep()` - Creates step sections (Cleanse, Treat, etc.)
  - `renderProductCard()` - Builds individual product cards with pricing
  - Tab switching, tooltips, and cart functionality remain intact

### 3. `index.html` (UPDATED - 37KB)
- All three routine panels (Essential, Enhanced, Comprehensive) have been cleaned
- Hardcoded products removed - panels are now populated dynamically by JavaScript
- Added script reference to `product-data.js`

## How It Works

### Quiz Results → Products
The system uses simulated quiz results (currently hardcoded in `app.js`) to determine products:

```javascript
const QUIZ_RESULTS = {
  age: '28',                          // Determines franchise eligibility
  concern: 'Dullness / uneven tone',  // Selects franchise (BioLumin-C in this case)
  tier: 'Essential',                  // Default tier (all tiers are generated)
  timing: 'Both',                     // Show AM and PM products
  sensitive: false                    // If true, swaps to sensitive alternatives
};
```

### Franchise Selection Logic
Based on the **Quiz Questions & Logic** CSV:

| Concern | Age | Franchise |
|---------|-----|-----------|
| Breakouts / acne | Under 24 | Clear Start |
| Breakouts / acne | 24+ | Active Clearing |
| Sensitivity / redness | Any | UltraCalming |
| Dullness / uneven tone | 25-34 | BioLumin-C |
| Dark spots / hyperpigmentation | 25-44 | PowerBright |
| Fine lines / wrinkles | 35-44 | Dynamic Skin |
| Loss of firmness / elasticity | 45+ | Phyto-Nature |
| Stressed skin / environmental damage | 35-44 | MultiVitamin Power |
| Other | Any | Daily Skin Health (default) |

### Sensitive Skin Swaps
When `sensitive: true` is set, products are automatically swapped:
- **Special Cleansing Gel** → UltraCalming Cleanser
- **Daily Microfoliant** → Daily Milkfoliant
- **Skin Smoothing Cream** → Stabilizing Repair Cream
- And more (defined in the CSV "Sensitive Swap" column)

### Product Organization
Products are grouped by category and displayed in the correct order:
1. **Cleanse** - Cleansers and oil cleansers
2. **Exfoliate** - Microfoliants, peels, and exfoliating treatments
3. **Tone** - Toners and mists
4. **Treat** - Serums and targeted treatments
5. **Eye Care** - Eye creams and serums
6. **Moisturize** - Day and night moisturizers
7. **Protect** - SPF products

## Franchises Supported

All 9 franchises from the Routine Matrix CSV are supported:

1. **Daily Skin Health** - General/maintenance skincare
2. **Active Clearing** - Breakout control (19-24 age range)
3. **BioLumin-C** - Brightening and uneven tone (25-34)
4. **Clear Start** - Teen acne (Under 18)
5. **Dynamic Skin** - Anti-aging (35-44)
6. **MultiVitamin Power** - Environmental protection (35-44)
7. **PowerBright** - Dark spots and hyperpigmentation (25-44)
8. **Phyto-Nature** - Firmness and elasticity (45+)
9. **UltraCalming** - Sensitivity and redness (All ages)

## Testing

Currently, the page is configured to show **BioLumin-C** products for a 28-year-old with dullness/uneven tone concerns.

To test other franchises, modify the `QUIZ_RESULTS` object in `app.js` lines 18-24.

### Example: Test Active Clearing
```javascript
const QUIZ_RESULTS = {
  age: '22',
  concern: 'Breakouts / acne',
  tier: 'Essential',
  timing: 'Both',
  sensitive: false
};
```

### Example: Test with Sensitive Swaps
```javascript
const QUIZ_RESULTS = {
  age: '28',
  concern: 'Dullness / uneven tone',
  tier: 'Essential',
  timing: 'Both',
  sensitive: true  // This will swap to gentler alternatives
};
```

## Future Integration

When the actual quiz is built, simply pass the real quiz results to `window.DermalogicaData.getRecommendations()`:

```javascript
// In your quiz results page
const userResults = {
  age: userAge,
  concern: selectedConcern,
  tier: selectedTier,
  timing: selectedTiming,
  sensitive: isSensitive
};

const products = window.DermalogicaData.getRecommendations(userResults);
```

## Product Count by Tier

- **Essential**: 3-4 products (basic routine)
- **Enhanced**: 5-6 products (adds double cleanse, extra serums)
- **Comprehensive**: 7-8 products (full routine with toner, eye care)

## Data Source
All product data is generated from:
- `Routine Finder Quiz System [master] - Routine Matrix.csv` (270 product entries)
- `Routine Finder Quiz System [master] - Quiz Questions & Logic.csv` (Quiz logic and franchise selection rules)

## Notes
- Product prices are estimates and should be updated with actual pricing
- Product images use placeholder URLs from Dermalogica's CDN
- The system supports AM/PM specific products (e.g., SPF only in AM, night creams only in PM)
