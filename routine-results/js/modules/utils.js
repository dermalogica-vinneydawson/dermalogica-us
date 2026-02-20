/**
 * @fileoverview Shared utility functions for the Routine Finder Results page.
 * @module utils
 */

/**
 * Convert a product name to URL-safe slug.
 * @param {string} str - Product name
 * @returns {string} Slug (e.g. "special-cleansing-gel")
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format product slug for display (title case).
 * @param {string} slug - Product slug
 * @returns {string} Formatted name
 */
export function formatProductName(slug) {
  if (typeof window !== 'undefined' && window.DermalogicaData) {
    const details = window.DermalogicaData.PRODUCT_DETAILS || window.DermalogicaData.products;
    if (details) {
      for (const [name] of Object.entries(details)) {
        if (slugify(name) === slug) {
          return name.toLowerCase();
        }
      }
    }
  }
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .toLowerCase();
}

/**
 * Capitalize first letter of string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

let toastTimer = null;

/**
 * Show toast notification.
 * @param {string} message - Message to display
 */
export function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  clearTimeout(toastTimer);
  msgEl.textContent = message;
  toast.className = 'fixed bottom-[--space-6] right-[--space-6] z-[100] show';

  toastTimer = setTimeout(() => {
    toast.className = 'fixed bottom-[--space-6] right-[--space-6] z-[100] hide';
    setTimeout(() => {
      toast.className = 'fixed bottom-[--space-6] right-[--space-6] z-[100] hidden';
    }, 300);
  }, 2500);
}
