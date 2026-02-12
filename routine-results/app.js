/**
 * Dermalogica Routine Results — Interactive Functionality
 *
 * Features:
 *  - Tab switching between Essential / Enhanced / Comprehensive
 *  - Tooltip rendering from data-tooltip attributes
 *  - Add-to-bag with cart count badge + toast notification
 *  - Mobile navigation toggle
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  //  DOM READY
  // ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupTabs();
    setupTooltips();
    setupAddToBag();
    setupMobileNav();
  }

  // ──────────────────────────────────────────────
  //  TABS
  // ──────────────────────────────────────────────
  function setupTabs() {
    var tabs = document.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Deactivate all
        tabs.forEach(function (t) {
          t.classList.remove('routine-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.add('hidden');
        });

        // Activate clicked
        tab.classList.add('routine-tab--active');
        tab.setAttribute('aria-selected', 'true');

        var panelId = tab.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (panel) {
          panel.classList.remove('hidden');
          // Re-trigger fade-in animation
          panel.style.animation = 'none';
          // Force reflow
          void panel.offsetHeight;
          panel.style.animation = '';
        }
      });
    });
  }

  // ──────────────────────────────────────────────
  //  TOOLTIPS
  // ──────────────────────────────────────────────
  function setupTooltips() {
    var triggers = document.querySelectorAll('.tooltip-trigger[data-tooltip]');

    triggers.forEach(function (trigger) {
      var text = trigger.getAttribute('data-tooltip');
      if (!text) return;

      // Create tooltip bubble element
      var bubble = document.createElement('span');
      bubble.className = 'tooltip-bubble';
      bubble.textContent = text;
      trigger.appendChild(bubble);
    });
  }

  // ──────────────────────────────────────────────
  //  ADD TO BAG + CART
  // ──────────────────────────────────────────────
  var cart = [];

  function setupAddToBag() {
    // Individual add-to-bag buttons
    document.querySelectorAll('.add-to-bag-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var product = btn.getAttribute('data-product');
        var price = parseFloat(btn.getAttribute('data-price'));

        cart.push({ product: product, price: price });
        updateCartBadge();
        showToast('"' + formatProductName(product) + '" added to bag');

        // Button feedback
        btn.textContent = 'Added';
        btn.classList.add('added');

        setTimeout(function () {
          btn.textContent = 'Add to Bag';
          btn.classList.remove('added');
        }, 2000);
      });
    });

    // Add-all buttons
    document.querySelectorAll('.add-all-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var routine = btn.getAttribute('data-routine');
        var panel = btn.closest('[role="tabpanel"]');
        if (!panel) return;

        var productBtns = panel.querySelectorAll('.add-to-bag-btn');
        productBtns.forEach(function (pBtn) {
          var product = pBtn.getAttribute('data-product');
          var price = parseFloat(pBtn.getAttribute('data-price'));
          cart.push({ product: product, price: price });
        });

        updateCartBadge();
        showToast('All ' + capitalize(routine) + ' products added to bag');

        btn.textContent = 'Added to Bag';
        setTimeout(function () {
          btn.textContent = 'Add All to Bag';
        }, 2000);
      });
    });
  }

  function updateCartBadge() {
    var badge = document.getElementById('cart-count');
    if (!badge) return;
    badge.textContent = cart.length;
    badge.classList.remove('hidden');
    badge.classList.add('flex');
  }

  // ──────────────────────────────────────────────
  //  TOAST
  // ──────────────────────────────────────────────
  var toastTimer = null;

  function showToast(message) {
    var toast = document.getElementById('toast');
    var msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;

    clearTimeout(toastTimer);
    msgEl.textContent = message;
    toast.className = 'fixed bottom-[--space-6] right-[--space-6] z-[100] show';

    toastTimer = setTimeout(function () {
      toast.className = 'fixed bottom-[--space-6] right-[--space-6] z-[100] hide';
      setTimeout(function () {
        toast.className = 'fixed bottom-[--space-6] right-[--space-6] z-[100] hidden';
      }, 300);
    }, 2500);
  }

  // ──────────────────────────────────────────────
  //  MOBILE NAV
  // ──────────────────────────────────────────────
  function setupMobileNav() {
    var btn = document.getElementById('mobile-menu-btn');
    var nav = document.getElementById('mobile-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      nav.classList.toggle('hidden');
    });
  }

  // ──────────────────────────────────────────────
  //  HELPERS
  // ──────────────────────────────────────────────
  function formatProductName(slug) {
    return slug
      .split('-')
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join(' ');
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
})();
