/**
 * @fileoverview Shared state for the Routine Finder Results page.
 * @module state
 *
 * In Shopify integration, replace QUIZ_RESULTS with data from the quiz
 * (URL params, Liquid variables, or app).
 */

/**
 * Simulated quiz results. Replace with real quiz data in production.
 * @type {{ age: string, concern: string, tier: string, timing: string, sensitive: boolean }}
 * @property {string} age - User age (determines franchise eligibility)
 * @property {string} concern - Top skin concern (selects franchise)
 * @property {string} tier - Routine preference: Essential | Enhanced | Comprehensive
 * @property {string} timing - AM | PM | Both
 * @property {boolean} sensitive - If true, swap to sensitive alternatives
 */
export const QUIZ_RESULTS = {
  age: '28',
  concern: 'Dullness / uneven tone',
  tier: 'Essential',
  timing: 'Both',
  sensitive: false
};

/** Mutable state - use state.selectedTiming for get/set */
export const state = {
  selectedTiming: QUIZ_RESULTS.timing === 'Both' || QUIZ_RESULTS.timing === 'AM/PM' ? 'AM' : QUIZ_RESULTS.timing
};

/** @type {Array<{ product: string, price: number, size: string, name: string, quantity: number }>} */
export const cart = [];

/** @type {{ essential: string[], enhanced: string[] }} */
export const upgradeProductsForTier = {
  essential: [],
  enhanced: []
};
