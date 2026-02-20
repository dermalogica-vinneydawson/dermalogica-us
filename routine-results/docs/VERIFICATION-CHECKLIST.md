# UI Preservation Verification Checklist

Use this checklist before and after any refactoring to ensure the frontend remains unchanged.

## Visual Regression

- [ ] Screenshot or compare key breakpoints: mobile (375px), tablet (768px), desktop (1280px)
- [ ] Skin analysis accordion opens/closes correctly
- [ ] Product cards render with correct layout (3-col desktop, 2-col tablet, 1-col mobile)
- [ ] Sticky tabs bar positions correctly below header
- [ ] Upgrade sections show/hide based on active tier

## Interactive Flows

- [ ] **Tabs:** Click Essential, Enhanced, Comprehensive — correct panel shows
- [ ] **AM/PM toggle:** Switch between AM and PM — products and headings update
- [ ] **Add to cart:** Click "Add to Cart" — toast appears, cart badge updates, button shows "In Cart"
- [ ] **Add All to Cart:** Summary button adds all products
- [ ] **Upgrade auto-switch:** Add both upgrade products — tab auto-switches to next tier
- [ ] **Modals:** Save Results, Retake Quiz — open, close, overlay click
- [ ] **Tooltips:** Hover info icon — tooltip appears
- [ ] **Mobile nav:** Hamburger menu toggles nav drawer
- [ ] **Size dropdown:** Select different size — price updates

## Do Not Change

- [ ] HTML structure, class names, IDs
- [ ] CSS selectors, design token values in globals.css
- [ ] Tailwind config in index.html
- [ ] Script load order: Lucide → product-data.js → app.js
