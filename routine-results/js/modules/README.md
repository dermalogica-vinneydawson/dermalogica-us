# JS Modules

Reference modules for future refactoring. The main `app.js` currently runs as a standalone IIFE.

- **utils.js** — `slugify`, `formatProductName`, `capitalize`, `showToast`
- **state.js** — `QUIZ_RESULTS`, `state.selectedTiming`, `cart`, `upgradeProductsForTier`

To use these modules, convert `app.js` to ES module format and add:

```html
<script type="module" src="js/main.js"></script>
```

Where `main.js` imports from these modules and calls the app init.
