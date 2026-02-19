/**
 * Dermalogica Routine Results — Interactive Functionality
 *
 * Features:
 *  - Dynamic product recommendations based on quiz logic
 *  - Tab switching between Essential / Enhanced / Comprehensive
 *  - Tooltip rendering from data-tooltip attributes
 *  - Add-to-bag with cart count badge + toast notification
 *  - Mobile navigation toggle
 */

(function () {
  'use strict';

  // Simulated quiz results (would come from actual quiz)
  const QUIZ_RESULTS = {
    age: '28',
    concern: 'Dullness / uneven tone',
    tier: 'Essential',
    timing: 'Both', // Original timing from quiz
    sensitive: false
  };

  // UI State: Current selected timing for display (AM or PM)
  // If quiz timing is 'Both', default to 'AM', otherwise use the quiz timing
  let selectedTiming = QUIZ_RESULTS.timing === 'Both' || QUIZ_RESULTS.timing === 'AM/PM' ? 'AM' : QUIZ_RESULTS.timing;

  // ──────────────────────────────────────────────
  //  DOM READY
  // ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    renderSkinAnalysis();
    setupTabs();
    setupTimingToggle();
    setupTooltips();
    setupAddToBag();
    setupMobileNav();
    setupStickyTabsPosition();
    setupSkinAnalysisToggle();
    setupSaveResults();
    setupRetakeQuiz();
    loadRoutineRecommendations();
    renderKitsSection();
    setupMobileHeaderPadding();
    initializeDropdownStates();
    
    // Initialize cart display
    updateCartBadge();
    updateMiniCart();

    // Process all static Lucide <i data-lucide> icons in the document
    if (window.lucide) lucide.createIcons();

    // Close size dropdowns when clicking outside any dropdown
    // Uses trigger._openPanel because the panel lives on <body> while open
    document.addEventListener('click', function() {
      document.querySelectorAll('.size-dropdown-trigger[aria-expanded="true"]').forEach(function(trigger) {
        var p = trigger._openPanel;
        if (p) closeSizePanel(trigger, p);
      });
    });
  }
  
  // ──────────────────────────────────────────────
  //  INITIALIZE DROPDOWN STATES
  // ──────────────────────────────────────────────
  function initializeDropdownStates() {
    // Initialize tier dropdown selected state
    const tierDropdownMenu = document.getElementById('tier-dropdown-menu');
    if (tierDropdownMenu) {
      tierDropdownMenu.querySelectorAll('.tier-dropdown-option').forEach(option => {
        const value = option.getAttribute('data-value');
        const isSelected = value === 'essential'; // Default to essential
        option.setAttribute('aria-selected', isSelected);
        if (isSelected) {
          option.classList.add('selected');
        }
      });
    }
    
    // Initialize timing dropdown selected state
    const timingDropdownMenu = document.getElementById('timing-dropdown-menu');
    if (timingDropdownMenu) {
      timingDropdownMenu.querySelectorAll('.timing-dropdown-option').forEach(option => {
        const value = option.getAttribute('data-value');
        const isSelected = value === selectedTiming;
        option.setAttribute('aria-selected', isSelected);
        if (isSelected) {
          option.classList.add('selected');
        }
      });
    }
  }

  // ──────────────────────────────────────────────
  //  STICKY TABS POSITION
  // ──────────────────────────────────────────────
  function setupStickyTabsPosition() {
    const header = document.querySelector('header');
    const stickyTabs = document.getElementById('sticky-tabs-container');
    
    if (!header || !stickyTabs) {
      console.warn('Sticky tabs: header or stickyTabs not found');
      return;
    }
    
    function updateStickyPosition() {
      const headerHeight = header.offsetHeight;
      // Use header height for both mobile and desktop so tabs sit just below the nav.
      // On mobile the header is position:fixed, so we must use headerHeight as top
      // or the sticky bar would stick at viewport top and sit behind the header.
      const isMobile = window.innerWidth <= 767;
      const fallbackPx = isMobile ? 56 : 64;
      const topPx = headerHeight > 0 ? headerHeight : fallbackPx;
      const topValue = topPx + 'px';
      
      stickyTabs.style.setProperty('position', 'sticky', 'important');
      stickyTabs.style.setProperty('top', topValue, 'important');
      stickyTabs.style.setProperty('margin-top', '0', 'important');
      stickyTabs.style.setProperty('z-index', '40', 'important');
      stickyTabs.style.setProperty('width', '100%', 'important');
    }
    
    // Initial run after DOM is ready
    updateStickyPosition();
    
    // Run after layout/paint so header.offsetHeight is correct (e.g. on mobile before first paint)
    requestAnimationFrame(function() {
      requestAnimationFrame(updateStickyPosition);
    });
    
    // Recalculate when header size changes (paint, mobile nav open/close, breakpoint change)
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(function() {
        updateStickyPosition();
      });
      ro.observe(header);
    }
    
    // Recalculate on viewport resize (breakpoint changes, orientation, etc.)
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateStickyPosition, 50);
    });
    
    // When mobile nav toggles, header height changes; ResizeObserver handles it, but run once after a short delay for immediate feedback
    const mobileNavBtn = document.getElementById('mobile-menu-btn');
    if (mobileNavBtn) {
      mobileNavBtn.addEventListener('click', function() {
        setTimeout(updateStickyPosition, 100);
        setTimeout(updateStickyPosition, 300);
      });
    }
    
    // Final run when everything has loaded (fonts, images, etc.)
    if (document.readyState === 'complete') {
      updateStickyPosition();
    } else {
      window.addEventListener('load', updateStickyPosition);
    }
  }

  // ──────────────────────────────────────────────
  //  SKIN ANALYSIS TOGGLE
  // ──────────────────────────────────────────────
  function setupSkinAnalysisToggle() {
    const toggle = document.getElementById('skin-analysis-toggle');
    const content = document.getElementById('skin-analysis-content');
    const chevron = document.getElementById('skin-analysis-chevron');

    if (!toggle || !content || !chevron) return;

    // Fixed open value — large enough to accommodate all content without
    // requiring a scrollHeight read (which forces layout reflow).
    const OPEN_MAX_HEIGHT = '600px';

    // Capture the natural vertical padding from the stylesheet before we ever
    // touch inline styles. getComputedStyle resolves CSS custom properties so
    // --space-6 is returned as a concrete pixel value.
    var computed = getComputedStyle(content);
    var naturalPaddingTop    = computed.paddingTop;
    var naturalPaddingBottom = computed.paddingBottom;

    // Transition max-height AND padding so the box collapses to a true zero
    // height. overflow: hidden alone does not clip the element's own padding,
    // so without animating padding the content would still peek out at closed.
    // will-change promotes the layer to the GPU compositor for smooth tweening.
    content.style.overflow   = 'hidden';
    content.style.willChange = 'max-height, padding-top, padding-bottom';
    content.style.transition = 'max-height 300ms ease, padding-top 300ms ease, padding-bottom 300ms ease';

    function openAccordion(animate) {
      if (!animate) content.style.transition = 'none';
      content.style.maxHeight      = OPEN_MAX_HEIGHT;
      content.style.paddingTop     = naturalPaddingTop;
      content.style.paddingBottom  = naturalPaddingBottom;
      if (!animate) {
        void content.offsetHeight; // flush styles before re-enabling transition
        content.style.transition = 'max-height 300ms ease, padding-top 300ms ease, padding-bottom 300ms ease';
      }
      toggle.setAttribute('aria-expanded', 'true');
      chevron.style.transform = 'rotate(180deg)';
    }

    function closeAccordion(animate) {
      if (!animate) content.style.transition = 'none';
      content.style.maxHeight      = '0';
      content.style.paddingTop     = '0';
      content.style.paddingBottom  = '0';
      if (!animate) {
        void content.offsetHeight; // flush styles before re-enabling transition
        content.style.transition = 'max-height 300ms ease, padding-top 300ms ease, padding-bottom 300ms ease';
      }
      toggle.setAttribute('aria-expanded', 'false');
      chevron.style.transform = 'rotate(0deg)';
    }

    // Always start closed regardless of viewport width
    closeAccordion(false);

    toggle.addEventListener('click', function() {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closeAccordion(true);
      } else {
        openAccordion(true);
      }
    });
  }

  // ──────────────────────────────────────────────
  //  RENDER SKIN ANALYSIS
  // ──────────────────────────────────────────────
  function renderSkinAnalysis() {
    const container = document.getElementById('skin-analysis-content');
    if (!container) return;

    // Map age to display text
    const ageNum = parseInt(QUIZ_RESULTS.age);
    let ageDisplay = '25–34';
    if (ageNum < 18) {
      ageDisplay = 'Under 18';
    } else if (ageNum >= 18 && ageNum <= 24) {
      ageDisplay = '18–24';
    } else if (ageNum >= 25 && ageNum <= 34) {
      ageDisplay = '25–34';
    } else if (ageNum >= 35 && ageNum <= 44) {
      ageDisplay = '35–44';
    } else if (ageNum >= 45 && ageNum <= 54) {
      ageDisplay = '45–54';
    } else if (ageNum >= 55) {
      ageDisplay = '55+';
    }

    // Map timing to display text
    const timingMap = {
      'AM': 'Mostly in the morning',
      'PM': 'Mostly at night',
      'Both': 'Morning and night'
    };
    const timingDisplay = timingMap[QUIZ_RESULTS.timing] || QUIZ_RESULTS.timing;

    // Map tier to display text
    const tierMap = {
      'Essential': 'I want a simple routine that\'s easy to stick to',
      'Enhanced': 'I\'m comfortable with a few extra steps if they make a difference',
      'Comprehensive': 'I enjoy a full routine and want the most advanced results'
    };
    const tierDisplay = tierMap[QUIZ_RESULTS.tier] || QUIZ_RESULTS.tier;

    // Map sensitivity to display text
    const sensitivityDisplay = QUIZ_RESULTS.sensitive 
      ? 'Very sensitive / easily irritated' 
      : 'Rarely sensitive';

    // Map concern to goal description
    const concernGoals = {
      'Breakouts / acne': 'Control breakouts and prevent future blemishes',
      'Sensitivity / redness': 'Calm and soothe sensitive, reactive skin',
      'Dullness / uneven tone': 'Brighten and even skin tone',
      'Dark spots / hyperpigmentation': 'Fade dark spots and even skin tone',
      'Fine lines / wrinkles': 'Reduce fine lines and wrinkles',
      'Loss of firmness / elasticity': 'Restore firmness and elasticity',
      'Stressed skin / environmental damage': 'Protect and repair from environmental damage',
      'Dryness / dehydration': 'Boost hydration levels',
      'Oiliness & clogged pores': 'Control excess oil and minimize pores',
      'Just want to maintain healthy skin': 'Maintain healthy, balanced skin'
    };
    const goalDescription = concernGoals[QUIZ_RESULTS.concern] || 'Address your skin concerns';

    // Keep accordion header subtitle in sync with the Your Goal field
    var subtitleEl = document.getElementById('skin-analysis-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = 'Goal: ' + goalDescription;
    }

    // Determine franchise for display
    let franchiseDisplay = 'Daily Skin Health';
    if (QUIZ_RESULTS.concern === 'Breakouts / acne' && ageNum < 25) {
      franchiseDisplay = 'Clear Start';
    } else if (QUIZ_RESULTS.concern === 'Breakouts / acne' && ageNum >= 25) {
      franchiseDisplay = 'Active Clearing';
    } else if (QUIZ_RESULTS.concern === 'Sensitivity / redness') {
      franchiseDisplay = 'UltraCalming';
    } else if (QUIZ_RESULTS.concern === 'Dullness / uneven tone') {
      franchiseDisplay = 'BioLumin-C';
    } else if (QUIZ_RESULTS.concern === 'Dark spots / hyperpigmentation') {
      franchiseDisplay = 'PowerBright';
    } else if (QUIZ_RESULTS.concern === 'Fine lines / wrinkles') {
      franchiseDisplay = 'Dynamic Skin';
    } else if (QUIZ_RESULTS.concern === 'Loss of firmness / elasticity') {
      franchiseDisplay = 'Phyto Nature';
    } else if (QUIZ_RESULTS.concern === 'Stressed skin / environmental damage') {
      franchiseDisplay = 'MultiVitamin Power';
    }

    // Icon component helper — Lucide data-lucide tags, processed by createIcons after innerHTML injection
    // Each field has a unique, semantically relevant icon:
    //   age → cake (birthday/age)   concern → search-check (finding skin issues)
    //   timing → sun (time of day)  preference → clock (routine scheduling)
    //   sensitivity → shield        franchise → award    goal → target
    const iconSVG = (iconType) => {
      const icons = {
        age:         '<i data-lucide="cake"         width="16" height="16" aria-hidden="true"></i>',
        concern:     '<i data-lucide="search-check" width="16" height="16" aria-hidden="true"></i>',
        timing:      '<i data-lucide="sun"          width="16" height="16" aria-hidden="true"></i>',
        preference:  '<i data-lucide="clock"        width="16" height="16" aria-hidden="true"></i>',
        sensitivity: '<i data-lucide="shield"       width="16" height="16" aria-hidden="true"></i>',
        franchise:   '<i data-lucide="award"        width="16" height="16" aria-hidden="true"></i>',
        goal:        '<i data-lucide="target"       width="18" height="18" aria-hidden="true"></i>'
      };
      return icons[iconType] || '';
    };

    const html = `
      <!-- Compact grid: 3 columns on large screens, 2 on medium, 1 on mobile -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[--space-3] mb-[--space-4]">
        <!-- Age -->
        <div class="flex items-start gap-[--space-2] p-[--space-3] bg-[--card-header] rounded border border-[--border]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('age')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Age</h3>
            <p class="text-sm font-normal text-[--foreground] leading-tight">${ageDisplay}</p>
          </div>
        </div>
        <!-- Top Skin Concern -->
        <div class="flex items-start gap-[--space-2] p-[--space-3] bg-[--card-header] rounded border border-[--border]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('concern')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Top Skin Concern</h3>
            <p class="text-sm font-normal text-[--foreground] leading-tight">${QUIZ_RESULTS.concern}</p>
          </div>
        </div>
        <!-- Routine Timing -->
        <div class="flex items-start gap-[--space-2] p-[--space-3] bg-[--card-header] rounded border border-[--border]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('timing')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Routine Timing</h3>
            <p class="text-sm font-normal text-[--foreground] leading-tight">${timingDisplay}</p>
          </div>
        </div>
        <!-- Routine Preference -->
        <div class="flex items-start gap-[--space-2] p-[--space-3] bg-[--card-header] rounded border border-[--border]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('preference')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Routine Preference</h3>
            <p class="text-sm font-normal text-[--foreground] leading-tight">${tierDisplay}</p>
          </div>
        </div>
        <!-- Skin Sensitivity -->
        <div class="flex items-start gap-[--space-2] p-[--space-3] bg-[--card-header] rounded border border-[--border]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('sensitivity')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Skin Sensitivity</h3>
            <p class="text-sm font-normal text-[--foreground] leading-tight">${sensitivityDisplay}</p>
          </div>
        </div>
        <!-- Product System -->
        <div class="flex items-start gap-[--space-2] p-[--space-3] bg-[--card-header] rounded border border-[--border]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('franchise')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Product System</h3>
            <p class="text-sm font-normal text-[--foreground] leading-tight">${franchiseDisplay}</p>
          </div>
        </div>
      </div>
      
      <!-- Your Goal - Compact highlighted summary -->
      <div class="bg-[--card-header] rounded-lg border-2 border-[--primary] p-[--space-4] shadow-sm">
        <div class="flex items-start gap-[--space-2]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('goal')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Your Goal</h3>
            <p class="text-sm font-semibold text-[--foreground] leading-snug">${goalDescription}</p>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons({ nodes: [container] });
  }

  // ──────────────────────────────────────────────
  //  LOAD ROUTINE RECOMMENDATIONS
  // ──────────────────────────────────────────────
  function loadRoutineRecommendations() {
    if (!window.DermalogicaData) {
      console.error('Product data not loaded');
      return;
    }

    const tiers = ['Essential', 'Enhanced', 'Comprehensive'];
    const expectedCounts = { Essential: 3, Enhanced: 5, Comprehensive: 7 };
    const allTierProducts = {};
    
    // Load products for all tiers first
    tiers.forEach(tier => {
      const quizForTier = { ...QUIZ_RESULTS, tier };
      let products = window.DermalogicaData.getRecommendations(quizForTier);
      
      // If timing is 'Both', we expect double the count (AM + PM)
      // If timing is 'AM' or 'PM', we expect the exact count
      const expectedCount = QUIZ_RESULTS.timing === 'Both' 
        ? expectedCounts[tier] * 2 
        : expectedCounts[tier];
      
      // Validate product count (log warning if incorrect, but don't fail)
      if (products.length !== expectedCount) {
        console.warn(`${tier} tier: Expected ${expectedCount} products, got ${products.length} (timing: ${QUIZ_RESULTS.timing})`);
      }
      
      allTierProducts[tier.toLowerCase()] = products;
    });
    
    // Calculate upgrade products for each tier
    upgradeProductsForTier.essential = calculateUpgradeProducts(
      allTierProducts.essential,
      allTierProducts.enhanced
    );
    upgradeProductsForTier.enhanced = calculateUpgradeProducts(
      allTierProducts.enhanced,
      allTierProducts.comprehensive
    );
    
    // Render each tier
    tiers.forEach(tier => {
      const products = allTierProducts[tier.toLowerCase()];
      renderRoutinePanel(tier, products);
    });
    
    // Render upgrade sections
    renderUpgradeSection('essential', upgradeProductsForTier.essential, 'Enhanced');
    renderUpgradeSection('enhanced', upgradeProductsForTier.enhanced, 'Comprehensive');
    
    updateTabCounts();
    
    // Set initial upgrade visibility (Essential is default active)
    updateUpgradeVisibility('essential');
  }

  function calculateUpgradeProducts(currentTier, nextTier) {
    // Filter both tiers by selected timing first
    let currentFiltered = currentTier;
    let nextFiltered = nextTier;
    
    if (selectedTiming === 'AM') {
      currentFiltered = currentTier.filter(p => p.timing === 'AM');
      nextFiltered = nextTier.filter(p => p.timing === 'AM');
    } else if (selectedTiming === 'PM') {
      currentFiltered = currentTier.filter(p => p.timing === 'PM');
      nextFiltered = nextTier.filter(p => p.timing === 'PM');
    }
    
    // Get all unique product names from current tier
    const currentProductNames = new Set(currentFiltered.map(p => p.product));
    
    // Find products in next tier that don't exist in current tier
    const upgradeProducts = nextFiltered.filter(p => !currentProductNames.has(p.product));
    
    // Get unique product names (in case same product appears multiple times)
    const uniqueUpgradeProductNames = new Set(upgradeProducts.map(p => p.product));
    
    // Return the first occurrence of each unique product
    const uniqueUpgrades = [];
    uniqueUpgradeProductNames.forEach(productName => {
      const product = upgradeProducts.find(p => p.product === productName);
      if (product) {
        uniqueUpgrades.push(product);
      }
    });
    
    // Sort by step number, take only first 2 products
    uniqueUpgrades.sort((a, b) => a.step - b.step);
    const limitedUpgrades = uniqueUpgrades.slice(0, 2);
    
    return limitedUpgrades.map(p => slugify(p.product));
  }

  // ──────────────────────────────────────────────
  //  RENDER ROUTINE PANEL
  // ──────────────────────────────────────────────
  function renderRoutinePanel(tier, products) {
    const panelId = 'panel-' + tier.toLowerCase();
    const panel = document.getElementById(panelId);
    if (!panel) return;

    // Filter products based on selected timing
    let displayProducts = products;
    if (selectedTiming === 'AM') {
      displayProducts = products.filter(p => p.timing === 'AM');
    } else if (selectedTiming === 'PM') {
      displayProducts = products.filter(p => p.timing === 'PM');
    }
    // If selectedTiming === 'Both', show all products (but this shouldn't happen with toggle)

    // Sort by step number
    displayProducts.sort((a, b) => a.step - b.step);
    
    // Calculate total price for displayed products
    let totalPrice = 0;
    displayProducts.forEach(p => {
      totalPrice += p.details.price || 0;
    });
    
    // Check if both AM and PM routines are available (check all tiers)
    const allTiersHaveBoth = ['Essential', 'Enhanced', 'Comprehensive'].every(t => {
      const tierProducts = window.DermalogicaData.getRecommendations({ ...QUIZ_RESULTS, tier: t });
      const hasAM = tierProducts.some(p => p.timing === 'AM');
      const hasPM = tierProducts.some(p => p.timing === 'PM');
      return hasAM && hasPM;
    });
    
    // Show/hide timing toggle in sticky header (desktop and mobile)
    const toggleContainer = document.getElementById('timing-toggle-container');
    const timingToggleMobile = document.getElementById('timing-toggle-mobile');
    const timingDropdownLabel = document.getElementById('timing-dropdown-label');
    
    if (allTiersHaveBoth) {
      // Show desktop toggle
      if (toggleContainer) {
        toggleContainer.classList.remove('hidden');
        toggleContainer.querySelectorAll('.timing-toggle-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-timing') === selectedTiming);
        });
      }
      // Sync mobile pill toggle state
      var timingMobile = document.getElementById('mobile-ampm-toggle');
      if (timingMobile) {
        timingMobile.querySelectorAll('.timing-toggle-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-timing') === selectedTiming);
        });
      }
      // Show mobile dropdown and set initial label
      if (timingToggleMobile) {
        timingToggleMobile.classList.remove('hidden');
        if (timingDropdownLabel) {
          timingDropdownLabel.textContent = selectedTiming + ' Routine';
        }
      }
    } else {
      // Hide desktop toggle
      if (toggleContainer) {
        toggleContainer.classList.add('hidden');
      }
      // Hide mobile dropdown
      if (timingToggleMobile) {
        timingToggleMobile.classList.add('hidden');
      }
    }
    
    let html = '';
    
    // Heading timing label:
    //  - toggle visible → use selectedTiming ("AM" or "PM")
    //  - toggle hidden (only one timing available) → "AM & PM"
    var headingTimingLabel = allTiersHaveBoth ? selectedTiming : 'AM & PM';

    // Render routine header — combines timing + tier: "AM Essential Routine"
    html += '<div class="mb-[--space-6]">';
    html += '<h3 class="text-xl font-bold text-[--heading] mb-[--space-2]" data-panel-heading="' + tier.toLowerCase() + '">' + headingTimingLabel + ' ' + tier + ' Routine</h3>';
    html += '<p class="text-[14px] font-light text-[--muted-foreground] mb-[--space-6]" data-panel-subheading="' + tier.toLowerCase() + '">Add these ' + displayProducts.length + ' products to complete your ' + tier + ' ' + headingTimingLabel + ' routine.</p>';
    html += '</div>';
    
    // Render product grid - extends to page margins on mobile
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[--space-4] mb-[--space-8]">';
    displayProducts.forEach(product => {
      html += renderProductCard(product);
    });
    html += '</div>';

    // Add summary CTA
    html += renderRoutineSummary(tier, displayProducts.length, totalPrice, selectedTiming);

    cleanupOrphanedPanels();
    panel.innerHTML = html;
    
    // Re-attach event listeners for this panel
    attachPanelListeners(panel);
    
    // Update button states after rendering
    updateButtonStates();

    // Initialize Lucide icons injected into this panel
    if (window.lucide) lucide.createIcons({ nodes: [panel] });
  }

  // ──────────────────────────────────────────────
  //  UPDATE PANEL HEADINGS (lightweight, no re-render)
  // ──────────────────────────────────────────────
  // Called immediately on every AM/PM toggle switch so headings respond
  // instantly; the full loadRoutineRecommendations() re-render that follows
  // will also rewrite these with updated product counts.
  function updatePanelHeadings(newTiming) {
    // Determine whether the timing toggle is currently visible
    var toggleContainer = document.getElementById('timing-toggle-container');
    var toggleVisible = toggleContainer && !toggleContainer.classList.contains('hidden');
    var timingLabel = toggleVisible ? newTiming : 'AM & PM';

    // Capitalise first letter of a tier slug ("essential" → "Essential")
    function capitaliseTier(slug) {
      return slug.charAt(0).toUpperCase() + slug.slice(1);
    }

    // Update every rendered panel heading — "AM Essential Routine" etc.
    document.querySelectorAll('[data-panel-heading]').forEach(function(el) {
      var tierName = capitaliseTier(el.getAttribute('data-panel-heading'));
      el.textContent = timingLabel + ' ' + tierName + ' Routine';
    });

    // Update every rendered panel subheading — preserve existing product count
    // until the full re-render replaces it with the recalculated value
    document.querySelectorAll('[data-panel-subheading]').forEach(function(el) {
      var tierName = capitaliseTier(el.getAttribute('data-panel-subheading'));
      var countMatch = el.textContent.match(/\d+/);
      var count = countMatch ? countMatch[0] : '?';
      el.textContent = 'Add these ' + count + ' products to complete your ' + tierName + ' ' + timingLabel + ' routine.';
    });
  }

  // ──────────────────────────────────────────────
  //  CUSTOM SIZE DROPDOWN HELPERS
  // ──────────────────────────────────────────────

  function buildSizeDropdownHTML(productSlug, sizes, defaultSize) {
    var options = sizes.map(function(s) {
      var isSelected = s.size === defaultSize.size;
      return '<li class="size-dropdown-option" role="option" aria-selected="' + isSelected + '" data-size="' + s.size + '" data-price="' + s.price.toFixed(2) + '">' + s.size + '</li>';
    }).join('');
    return `
      <div class="mb-[--space-2]">
        <label class="block text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-[--space-2]">Size</label>
        <div class="size-dropdown">
          <button type="button" class="size-dropdown-trigger" aria-expanded="false" aria-haspopup="listbox" aria-label="Select product size">
            <span class="size-dropdown-trigger-text">${defaultSize.size}</span>
            <i data-lucide="chevron-down" class="size-dropdown-chevron" aria-hidden="true"></i>
          </button>
          <ul class="size-dropdown-panel" role="listbox" aria-label="Select product size">${options}</ul>
        </div>
      </div>
    `;
  }

  function applySizeChange(productCard, selectedSize, selectedPrice) {
    var priceElement = productCard.querySelector('.product-price');
    if (priceElement) {
      priceElement.style.opacity = '0.5';
      setTimeout(function() {
        priceElement.textContent = '$' + selectedPrice;
        priceElement.style.opacity = '1';
      }, 150);
    }
    var addToCartBtn = productCard.querySelector('.add-to-bag-btn');
    var removeBtn = productCard.querySelector('.remove-from-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.setAttribute('data-price', selectedPrice);
      addToCartBtn.setAttribute('data-size', selectedSize);
      if (removeBtn) removeBtn.setAttribute('data-size', selectedSize);
      if (addToCartBtn.classList.contains('in-cart')) {
        addToCartBtn.classList.remove('in-cart');
        if (removeBtn) removeBtn.classList.add('hidden');
        updateButtonStates();
      } else {
        updateButtonStates();
      }
    }
  }

  function openSizePanel(trigger, panel) {
    var rect = trigger.getBoundingClientRect();
    // Store the source .size-dropdown so we can return the panel on close
    panel._sourceContainer = trigger.closest('.size-dropdown');
    // Keep a back-reference so the click-outside handler can reach the panel
    trigger._openPanel = panel;
    // Move panel to <body> — escapes every overflow/stacking context in the card tree
    document.body.appendChild(panel);
    panel.style.position = 'fixed';
    panel.style.top = (rect.bottom + 4) + 'px';
    panel.style.left = rect.left + 'px';
    panel.style.minWidth = rect.width + 'px';
    trigger.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    // Close immediately on the first scroll; once:true removes the listener automatically
    panel._scrollHandler = function() { closeSizePanel(trigger, panel); };
    window.addEventListener('scroll', panel._scrollHandler, { once: true, passive: true });
  }

  function closeSizePanel(trigger, panel) {
    // Remove scroll listener before any state changes (no-op if already fired)
    if (panel._scrollHandler) {
      window.removeEventListener('scroll', panel._scrollHandler);
      panel._scrollHandler = null;
    }
    trigger.setAttribute('aria-expanded', 'false');
    trigger._openPanel = null;
    panel.classList.remove('open');
    // Return panel to its original .size-dropdown container
    var source = panel._sourceContainer;
    if (source && panel.parentNode === document.body) {
      source.appendChild(panel);
      panel._sourceContainer = null;
    }
    panel.style.position = '';
    panel.style.top = '';
    panel.style.left = '';
    panel.style.minWidth = '';
  }

  function cleanupOrphanedPanels() {
    // Remove any size panels still on body (their source card was destroyed)
    document.querySelectorAll('body > .size-dropdown-panel').forEach(function(p) {
      p.remove();
    });
    // Reset any trigger that still reports as expanded after its card was removed
    document.querySelectorAll('.size-dropdown-trigger[aria-expanded="true"]').forEach(function(t) {
      t.setAttribute('aria-expanded', 'false');
    });
  }

  function setupCustomSizeDropdowns(root) {
    root.querySelectorAll('.size-dropdown').forEach(function(dropdown) {
      if (dropdown.hasAttribute('data-size-listener')) return;
      dropdown.setAttribute('data-size-listener', 'true');
      var trigger = dropdown.querySelector('.size-dropdown-trigger');
      var panel = dropdown.querySelector('.size-dropdown-panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        // Close all other open size dropdowns first
        document.querySelectorAll('.size-dropdown-trigger[aria-expanded="true"]').forEach(function(t) {
          if (t !== trigger) {
            var p = t.closest('.size-dropdown').querySelector('.size-dropdown-panel');
            if (p) closeSizePanel(t, p);
          }
        });
        if (isOpen) {
          closeSizePanel(trigger, panel);
        } else {
          openSizePanel(trigger, panel);
        }
      });

      panel.querySelectorAll('.size-dropdown-option').forEach(function(option) {
        option.addEventListener('click', function(e) {
          e.stopPropagation();
          var selectedSize = option.getAttribute('data-size');
          var selectedPrice = option.getAttribute('data-price');
          panel.querySelectorAll('.size-dropdown-option').forEach(function(o) {
            o.setAttribute('aria-selected', 'false');
          });
          option.setAttribute('aria-selected', 'true');
          var triggerText = trigger.querySelector('.size-dropdown-trigger-text');
          if (triggerText) triggerText.textContent = selectedSize;
          closeSizePanel(trigger, panel);
          var productCard = dropdown.closest('[data-product-slug]');
          if (productCard) applySizeChange(productCard, selectedSize, selectedPrice);
        });
      });
    });
  }

  function renderProductCard(product, isUpgrade) {
    const details = product.details;
    const productSlug = slugify(product.product);
    const image = details.image || 'https://www.dermalogica.com/cdn/shop/files/placeholder_600x600.jpg';
    const description = details.description || '';
    const category = details.category || 'Step';
    const stepNumber = product.step || 1;
    const timing = product.timing || '';
    const productTitle = product.product.toLowerCase();
    
    // Get available sizes for this product
    let sizes = [];
    let defaultSize = null;
    if (window.DermalogicaData) {
      sizes = window.DermalogicaData.getProductSizes(product.product) || [];
      defaultSize = window.DermalogicaData.getDefaultSize(product.product) || { size: 'Standard', price: details.price || 0 };
    } else {
      defaultSize = { size: 'Standard', price: details.price || 0 };
      sizes = [defaultSize];
    }
    
    const defaultPrice = defaultSize.price.toFixed(2);
    const hasMultipleSizes = sizes.length > 1;
    
    // If upgrade, use minimal horizontal card
    if (isUpgrade) {
      return renderMinimalUpgradeCard(product, productTitle, defaultPrice, image, description, timing, productSlug, sizes, defaultSize);
    }
    
    // Build size selector HTML (custom dropdown)
    let sizeSelectorHTML = '';
    if (hasMultipleSizes) {
      sizeSelectorHTML = buildSizeDropdownHTML(productSlug, sizes, defaultSize);
    }
    
    // Build step banner that spans across the top
    const timingIcon = timing === 'AM' ? 'sun' : 'moon';
    const stepBanner = `
      <div class="product-step-banner">
        <span class="product-step-banner-text">STEP ${stepNumber}</span>
        ${timing ? `<span class="product-step-banner-timing"><i data-lucide="${timingIcon}" width="10" height="10" aria-hidden="true"></i>${timing}</span>` : ''}
      </div>
    `;
    
    return `
      <div class="product-card" data-product-slug="${productSlug}">
        ${stepBanner}
        <div class="product-card-img">
          <img src="${image}" alt="${productTitle}" loading="lazy" />
        </div>
        <div class="product-card-body">
          <button class="tooltip-trigger product-card-info-btn flex-shrink-0 z-10" aria-label="Product info" data-tooltip="${description}">
            <i data-lucide="info" width="14" height="14" aria-hidden="true"></i>
          </button>
          <div class="mb-[--space-1]">
            <span class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground]">${category}</span>
          </div>
          <div class="flex items-start justify-between gap-[--space-2] pr-[--space-6] mb-[--space-2]">
            <h4 class="text-sm font-bold text-[--foreground] leading-tight">${productTitle}</h4>
          </div>
          ${sizeSelectorHTML}
          <div class="mt-auto pt-[--space-3] flex items-center justify-between">
            <div class="flex flex-col">
              <span class="product-price text-sm font-bold text-[--foreground]" data-default-price="${defaultPrice}">$${defaultPrice}</span>
            </div>
            <div class="flex items-center gap-[--space-2]">
              <button class="remove-from-cart-btn hidden" data-product="${productSlug}" data-size="${defaultSize.size}" aria-label="Remove from cart">
                <i data-lucide="trash-2" width="14" height="14" aria-hidden="true"></i>
              </button>
              <button class="add-to-bag-btn" data-product="${productSlug}" data-price="${defaultPrice}" data-size="${defaultSize.size}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderMinimalUpgradeCard(product, productTitle, price, image, description, timing, productSlug, sizes, defaultSize) {
    // Get available sizes if not provided
    if (!sizes || !defaultSize) {
      if (window.DermalogicaData) {
        sizes = window.DermalogicaData.getProductSizes(product.product) || [];
        defaultSize = window.DermalogicaData.getDefaultSize(product.product) || { size: 'Standard', price: parseFloat(price) || 0 };
      } else {
        defaultSize = { size: 'Standard', price: parseFloat(price) || 0 };
        sizes = [defaultSize];
      }
    }
    
    const defaultPrice = defaultSize.price.toFixed(2);
    const hasMultipleSizes = sizes.length > 1;
    
    // Build size selector HTML (custom dropdown)
    let sizeSelectorHTML = '';
    if (hasMultipleSizes) {
      sizeSelectorHTML = buildSizeDropdownHTML(productSlug, sizes, defaultSize);
    }
    
    return `
      <div class="bg-[--card] rounded border border-[--border] shadow-sm flex flex-col sm:flex-row" data-product-slug="${productSlug}" style="overflow: visible;">
        <div class="sm:w-[200px] sm:h-[200px] w-full aspect-square bg-[--card-header] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-l sm:rounded-l sm:rounded-r-none rounded-t">
          <img src="${image}" alt="${productTitle}" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="upgrade-card-content p-[--space-5] flex flex-col flex-1 justify-between relative" style="overflow: visible; min-height: 200px;">
          <button class="tooltip-trigger product-card-info-btn flex-shrink-0 z-10" aria-label="Product info" data-tooltip="${description}">
            <i data-lucide="info" width="14" height="14" aria-hidden="true"></i>
          </button>
          ${timing ? `<div class="flex items-center gap-[--space-2] mb-[--space-2]"><span class="inline-flex items-center gap-[--space-1] px-[--space-2] py-[--space-1] rounded text-[10px] font-bold bg-[--primary] text-[--primary-foreground]"><i data-lucide="${timing === 'AM' ? 'sun' : 'moon'}" width="10" height="10" aria-hidden="true"></i>${timing}</span></div>` : ''}
          <h3 class="text-base font-bold text-[--foreground] mb-[--space-2] pr-[--space-6]">${productTitle}</h3>
          ${sizeSelectorHTML}
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="product-price text-sm font-bold text-[--foreground]" data-default-price="${defaultPrice}">$${defaultPrice}</span>
            </div>
            <div class="flex items-center gap-[--space-2]">
              <button class="remove-from-cart-btn hidden" data-product="${productSlug}" data-size="${defaultSize.size}" aria-label="Remove from cart">
                <i data-lucide="trash-2" width="14" height="14" aria-hidden="true"></i>
              </button>
              <button class="add-to-bag-btn" data-product="${productSlug}" data-price="${defaultPrice}" data-size="${defaultSize.size}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRoutineSummary(tier, productCount, totalPrice, timing) {
    return `
      <div class="flex flex-col sm:flex-row items-center justify-between gap-[--space-4] p-[--space-6] bg-white rounded border border-[--border]">
        <div>
          <p class="text-base font-bold text-[--foreground]">${tier} ${timing} Routine — ${productCount} Products</p>
          <p class="text-sm font-light text-[--muted-foreground]">Total: <span class="font-bold text-[--foreground]">$${totalPrice.toFixed(2)}</span></p>
        </div>
        <button class="add-all-btn" data-routine="${tier.toLowerCase()}">Add All to Cart</button>
      </div>
    `;
  }

  function renderDynamicSkinSculptorCard(uniqueId = '') {
    const productSlug = 'dynamic-skin-sculptor';
    const productTitle = 'dynamic skin sculptor';
    const description = 'Body serum that visibly firms, smooths, and sculpts skin texture with advanced peptides and botanical actives.';
    const image = 'https://www.dermalogica.com/cdn/shop/files/DSS_Benefits_5.1oz.jpg?v=1762198119&width=990';
    const sizeSelectId = `size-select-${productSlug}${uniqueId ? '-' + uniqueId : ''}`;
    
    // Get sizes for Dynamic Skin Sculptor
    let sizes = [];
    let defaultSize = null;
    if (window.DermalogicaData) {
      sizes = window.DermalogicaData.getProductSizes('Dynamic Skin Sculptor') || [];
      defaultSize = window.DermalogicaData.getDefaultSize('Dynamic Skin Sculptor') || { size: '5.1 oz', price: 89.00 };
    } else {
      defaultSize = { size: '5.1 oz', price: 89.00 };
      sizes = [
        { size: '1.7 oz', price: 62.00 },
        { size: '5.1 oz', price: 89.00 }
      ];
    }
    
    const defaultPrice = defaultSize.price.toFixed(2);
    const hasMultipleSizes = sizes.length > 1;
    
    // Build size selector HTML (custom dropdown)
    let sizeSelectorHTML = '';
    if (hasMultipleSizes) {
      sizeSelectorHTML = buildSizeDropdownHTML(productSlug, sizes, defaultSize);
    }
    
    return `
      <div class="bg-[--card] rounded border border-[--border] shadow-sm flex flex-col sm:flex-row" data-product-slug="${productSlug}" style="overflow: visible;">
        <div class="sm:w-[200px] sm:h-[200px] w-full aspect-square bg-[--card-header] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-l sm:rounded-l sm:rounded-r-none rounded-t">
          <img src="${image}" alt="${productTitle}" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="upgrade-card-content p-[--space-5] flex flex-col flex-1 justify-between relative" style="overflow: visible; min-height: 200px;">
          <button class="tooltip-trigger product-card-info-btn flex-shrink-0 z-10" aria-label="Product info" data-tooltip="${description}">
            <i data-lucide="info" width="14" height="14" aria-hidden="true"></i>
          </button>
          <div class="flex items-center gap-[--space-2] mb-[--space-2]">
            <span class="inline-flex items-center px-[--space-2] py-[--space-1] rounded text-[10px] font-bold bg-[--primary] text-[--primary-foreground]">
              Bestseller · Body Care
            </span>
          </div>
          <h3 class="text-base font-bold text-[--foreground] mb-[--space-2] pr-[--space-6]">${productTitle}</h3>
          ${sizeSelectorHTML}
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="product-price text-sm font-bold text-[--foreground]" data-default-price="${defaultPrice}">$${defaultPrice}</span>
            </div>
            <div class="flex items-center gap-[--space-2]">
              <button class="remove-from-cart-btn hidden" data-product="${productSlug}" data-size="${defaultSize.size}" aria-label="Remove from cart">
                <i data-lucide="trash-2" width="14" height="14" aria-hidden="true"></i>
              </button>
              <button class="add-to-bag-btn" data-product="${productSlug}" data-price="${defaultPrice}" data-size="${defaultSize.size}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  //  RENDER KIT CARD (helper)
  // ──────────────────────────────────────────────
  function renderKitCard(productSlug, productTitle, price, image, description, label, retailPrice) {
    return `
      <div class="bg-[--card] rounded border border-[--border] shadow-sm flex flex-col sm:flex-row" data-product-slug="${productSlug}" style="overflow: visible;">
        <div class="sm:w-[200px] sm:h-[200px] w-full aspect-square bg-[--card-header] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-l sm:rounded-l sm:rounded-r-none rounded-t">
          <img src="${image}" alt="${productTitle}" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="upgrade-card-content p-[--space-5] flex flex-col flex-1 justify-between relative" style="overflow: visible; min-height: 200px;">
          <button class="tooltip-trigger product-card-info-btn flex-shrink-0 z-10" aria-label="Product info" data-tooltip="${description}">
            <i data-lucide="info" width="14" height="14" aria-hidden="true"></i>
          </button>
          <div class="flex items-center gap-[--space-2] mb-[--space-2]">
            <span class="inline-flex items-center px-[--space-2] py-[--space-1] rounded text-[10px] font-bold bg-[--primary] text-[--primary-foreground]">
              ${label}
            </span>
          </div>
          <h3 class="text-base font-bold text-[--foreground] mb-[--space-2] pr-[--space-6]">${productTitle}</h3>
          <div class="mb-[--space-2]">
            <label class="block text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-[--space-2]">Size</label>
            <div class="inline-flex px-[--space-3] py-[--space-2] rounded text-xs font-bold text-[--muted-foreground] bg-[--card]" style="width: fit-content; border: 1.5px solid var(--border); pointer-events: none; user-select: none; -webkit-user-select: none;" aria-hidden="true">KIT</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center" style="gap: 6px;">
              <span class="product-price text-sm font-bold text-[--foreground]" data-default-price="${price}">$${price}</span>
              <span class="text-xs text-[--muted-foreground]" style="text-decoration: line-through;">$${retailPrice}</span>
            </div>
            <div class="flex items-center gap-[--space-2]">
              <button class="remove-from-cart-btn hidden" data-product="${productSlug}" data-size="Kit" aria-label="Remove from cart">
                <i data-lucide="trash-2" width="14" height="14" aria-hidden="true"></i>
              </button>
              <button class="add-to-bag-btn" data-product="${productSlug}" data-price="${price}" data-size="Kit">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  //  RENDER KITS SECTION
  // ──────────────────────────────────────────────
  function renderKitsSection() {
    var container = document.getElementById('kits-section');
    if (!container) return;

    var html = `
      <div class="mb-[--space-6]">
        <h2 class="text-xl font-bold text-[--heading] mb-[--space-2]">Recommended Skin Kits &amp; Sets</h2>
        <p class="text-[14px] font-light text-[--muted-foreground]">Curated collections that make a great introduction to Dermalogica or a thoughtful gift for any skin type.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[--space-4]">
        ${renderKitCard(
          'daily-brightness-boosters-kit',
          'daily brightness boosters kit',
          '49.50',
          'https://www.dermalogica.com/cdn/shop/files/PDP_DailyBrightnessBoosters_UpdatedValueBadge_Cartion.jpg?v=1762198006&width=1946',
          'Brighten, condition and hydrate your skin for a radiance boost.',
          'Recommended For You',
          '76.00'
        )}
        ${renderKitCard(
          'discover-healthy-skin-kit',
          'discover healthy skin kit',
          '39.50',
          'https://www.dermalogica.com/cdn/shop/files/PDP_DiscoverHealthySkinKit_UpdatedValueBadge_Cartion_e96c52a8-e3b3-4b27-8f75-7c49d6e21c7e.jpg?v=1756236678&width=1946',
          'The perfect introduction to Dermalogica, this special collection of our favorite and most popular products is a complete regimen for all skin types.',
          'Great For Gifting',
          '59.00'
        )}
      </div>
    `;

    cleanupOrphanedPanels();
    container.innerHTML = html;

    // Wire up tooltips and cart buttons using the same pattern as the upgrade section
    attachPanelListeners(container);
    updateButtonStates();
    if (window.lucide) lucide.createIcons({ nodes: [container] });
  }

  function renderUpgradeSection(currentTier, upgradeProductSlugs, nextTierName) {
    const upgradeContainerId = 'upgrade-' + currentTier;
    const container = document.getElementById(upgradeContainerId);
    
    if (!container) return;
    
    // If no upgrade products (i.e., already at highest tier), hide the section
    if (upgradeProductSlugs.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    // Get full product details from the next tier, filtered by selected timing
    const quizForNextTier = { ...QUIZ_RESULTS, tier: nextTierName };
    let nextTierProducts = window.DermalogicaData.getRecommendations(quizForNextTier);
    
    // Filter by selected timing
    if (selectedTiming === 'AM') {
      nextTierProducts = nextTierProducts.filter(p => p.timing === 'AM');
    } else if (selectedTiming === 'PM') {
      nextTierProducts = nextTierProducts.filter(p => p.timing === 'PM');
    }
    
    // Find products by slug, matching selected timing
    const upgradeProducts = upgradeProductSlugs.map(slug => {
      const product = nextTierProducts.find(p => slugify(p.product) === slug && p.timing === selectedTiming) ||
                      nextTierProducts.find(p => slugify(p.product) === slug);
      return product;
    }).filter(p => p); // Remove any undefined
    
    // Sort by step number to maintain order
    upgradeProducts.sort((a, b) => a.step - b.step);
    
    // If no products match the selected timing, hide the section
    if (upgradeProducts.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    const upgradeCopy = currentTier === 'enhanced'
      ? {
          title: 'Take Your Routine Further',
          subtitle: "Take your skincare further with these targeted additions designed to complement and amplify your Enhanced routine."
        }
      : {
          title: 'Enhance Your Routine',
          subtitle: 'Take your skincare to the next level with these targeted products designed to amplify your results.'
        };

    let html = `
      <div class="mb-[--space-6]">
        <h2 class="text-xl font-bold text-[--heading] mb-[--space-2]">${upgradeCopy.title}</h2>
        <p class="text-[14px] font-light text-[--muted-foreground]">${upgradeCopy.subtitle}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[--space-4]">
    `;
    
    // Render first upgrade product
    if (upgradeProducts.length > 0) {
      html += renderProductCard(upgradeProducts[0], true);
    }
    
    // Insert Dynamic Skin Sculptor as 2nd item
    html += renderDynamicSkinSculptorCard(currentTier);
    
    html += '</div>';
    
    cleanupOrphanedPanels();
    container.innerHTML = html;
    container.style.display = 'block';
    
    // Re-attach event listeners
    attachUpgradeListeners(container);
    
    // Update button states after rendering
    updateButtonStates();

    // Initialize Lucide icons injected into this upgrade section
    if (window.lucide) lucide.createIcons({ nodes: [container] });
  }

  function attachUpgradeListeners(container) {
    // Add tooltips
    container.querySelectorAll('.tooltip-trigger[data-tooltip]').forEach(trigger => {
      const text = trigger.getAttribute('data-tooltip');
      if (!text) return;
      const bubble = document.createElement('span');
      bubble.className = 'tooltip-bubble';
      bubble.textContent = text;
      trigger.appendChild(bubble);
    });

    // Wire custom size dropdowns
    setupCustomSizeDropdowns(container);

    // Add remove from cart button handlers
    container.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
      if (btn.hasAttribute('data-listener-attached')) return;
      btn.setAttribute('data-listener-attached', 'true');
      
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productSlug = btn.getAttribute('data-product');
        const size = btn.getAttribute('data-size') || 'Standard';
        
        removeFromCart(productSlug, size);
        updateButtonStates();
      });
    });

    // Add to cart buttons
    container.querySelectorAll('.add-to-bag-btn').forEach(btn => {
      // Skip if listener already attached
      if (btn.hasAttribute('data-listener-attached')) return;
      btn.setAttribute('data-listener-attached', 'true');
      
      // Check initial state
      const product = btn.getAttribute('data-product');
      const size = btn.getAttribute('data-size') || 'Standard';
      const cartItem = cart.find(item => item.product === product && item.size === size);
      if (cartItem) {
        btn.classList.add('in-cart');
        btn.innerHTML = `<span>In Cart</span> <span class="cart-quantity">${cartItem.quantity}</span>`;
      }

      btn.addEventListener('click', function () {
        // Prevent multiple clicks
        if (btn.classList.contains('loading') || btn.classList.contains('added')) {
          return;
        }

        const price = parseFloat(btn.getAttribute('data-price'));
        const size = btn.getAttribute('data-size') || 'Standard';
        const productName = formatProductName(product);
        
        // Set loading state
        btn.classList.add('loading');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Adding...';
        
        // Simulate API call delay
        setTimeout(function() {
          addToCart(product, price, productName, size);
          
          // Set added state
          btn.classList.remove('loading');
          btn.classList.add('added');
          btn.innerHTML = '<i data-lucide="check" width="14" height="14" class="inline mr-1" aria-hidden="true"></i> Added';
          if (window.lucide) lucide.createIcons({ nodes: [btn] });
          
          // Update to in-cart state after brief delay
          setTimeout(function() {
            btn.classList.remove('added');
            updateButtonStates();
          }, 1500);
        }, 300);
      });
    });
  }

  function attachPanelListeners(panel) {
    // Add tooltips
    panel.querySelectorAll('.tooltip-trigger[data-tooltip]').forEach(trigger => {
      const text = trigger.getAttribute('data-tooltip');
      if (!text) return;
      const bubble = document.createElement('span');
      bubble.className = 'tooltip-bubble';
      bubble.textContent = text;
      trigger.appendChild(bubble);
    });

    // Wire custom size dropdowns
    setupCustomSizeDropdowns(panel);

    // Add remove from cart button handlers
    panel.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
      if (btn.hasAttribute('data-listener-attached')) return;
      btn.setAttribute('data-listener-attached', 'true');
      
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productSlug = btn.getAttribute('data-product');
        const size = btn.getAttribute('data-size') || 'Standard';
        
        removeFromCart(productSlug, size);
        updateButtonStates();
      });
    });

    // Add to cart buttons
    panel.querySelectorAll('.add-to-bag-btn').forEach(btn => {
      // Skip if listener already attached
      if (btn.hasAttribute('data-listener-attached')) return;
      btn.setAttribute('data-listener-attached', 'true');
      
      // Check initial state
      const product = btn.getAttribute('data-product');
      const size = btn.getAttribute('data-size') || 'Standard';
      const cartItem = cart.find(item => item.product === product && item.size === size);
      if (cartItem) {
        btn.classList.add('in-cart');
        btn.innerHTML = `<span>In Cart</span> <span class="cart-quantity">${cartItem.quantity}</span>`;
      }

      btn.addEventListener('click', function () {
        // Prevent multiple clicks
        if (btn.classList.contains('loading') || btn.classList.contains('added')) {
          return;
        }

        const price = parseFloat(btn.getAttribute('data-price'));
        const size = btn.getAttribute('data-size') || 'Standard';
        const productName = formatProductName(product);
        
        // Set loading state
        btn.classList.add('loading');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Adding...';
        
        // Simulate API call delay
        setTimeout(function() {
          addToCart(product, price, productName, size);
          
          // Set added state
          btn.classList.remove('loading');
          btn.classList.add('added');
          btn.innerHTML = '<i data-lucide="check" width="14" height="14" class="inline mr-1" aria-hidden="true"></i> Added';
          if (window.lucide) lucide.createIcons({ nodes: [btn] });
          
          // Update to in-cart state after brief delay
          setTimeout(function() {
            btn.classList.remove('added');
            updateButtonStates();
          }, 1500);
        }, 300);
      });
    });

    // Add all button
    const addAllBtn = panel.querySelector('.add-all-btn');
    if (addAllBtn && !addAllBtn.hasAttribute('data-listener-attached')) {
      addAllBtn.setAttribute('data-listener-attached', 'true');
      
      addAllBtn.addEventListener('click', function () {
        // Prevent multiple clicks
        if (addAllBtn.classList.contains('loading') || addAllBtn.classList.contains('added')) {
          return;
        }

        const routine = addAllBtn.getAttribute('data-routine');
        const buttons = panel.querySelectorAll('.add-to-bag-btn:not(.in-cart)');
        let addedCount = 0;
        
        // Set loading state
        addAllBtn.classList.add('loading');
        addAllBtn.disabled = true;
        addAllBtn.innerHTML = '<span class="loading-spinner"></span> Adding...';
        
        // Add products with slight delay between each
        buttons.forEach(function(pBtn, index) {
          setTimeout(function() {
            const product = pBtn.getAttribute('data-product');
            const price = parseFloat(pBtn.getAttribute('data-price'));
            const size = pBtn.getAttribute('data-size') || 'Standard';
            const productName = formatProductName(product);
            
            addToCart(product, price, productName, size);
            addedCount++;
            
            // Update button state
            pBtn.classList.add('added');
            pBtn.innerHTML = '<i data-lucide="check" width="14" height="14" class="inline mr-1" aria-hidden="true"></i> Added';
            if (window.lucide) lucide.createIcons({ nodes: [pBtn] });
            
            // If this is the last button, update add all button
            if (index === buttons.length - 1) {
              setTimeout(function() {
                addAllBtn.classList.remove('loading');
                addAllBtn.classList.add('added');
                addAllBtn.innerHTML = '<i data-lucide="check" width="14" height="14" class="inline mr-1" aria-hidden="true"></i> Added to Cart';
                if (window.lucide) lucide.createIcons({ nodes: [addAllBtn] });
                
                setTimeout(function() {
                  addAllBtn.classList.remove('added');
                  addAllBtn.disabled = false;
                  addAllBtn.innerHTML = 'Add All to Cart';
                  updateButtonStates();
                }, 2000);
              }, 300);
            }
          }, index * 200);
        });
        
        // If no buttons to add
        if (buttons.length === 0) {
          addAllBtn.classList.remove('loading');
          addAllBtn.disabled = false;
        }
      });
    }
  }

  function updateTabCounts() {
    const expectedCounts = {
      essential: 3,
      enhanced: 5,
      comprehensive: 7
    };
    
    ['essential', 'enhanced', 'comprehensive'].forEach(tier => {
      const tab = document.getElementById('tab-' + tier);
      if (tab) {
        const countSpan = tab.querySelector('.routine-tab-count');
        if (countSpan) {
          // Show the expected count per routine
          countSpan.textContent = expectedCounts[tier] + ' Products';
        }
      }
    });
  }

  // ──────────────────────────────────────────────
  //  TIMING TOGGLE
  // ──────────────────────────────────────────────
  function setupTimingToggle() {
    const toggleContainer = document.getElementById('timing-toggle-container');
    const timingDropdownBtn = document.getElementById('timing-dropdown-btn');
    const timingDropdownMenu = document.getElementById('timing-dropdown-menu');
    const timingDropdownLabel = document.getElementById('timing-dropdown-label');
    const timingToggleMobile = document.getElementById('timing-toggle-mobile');
    
    // Function to switch timing
    function switchTiming(newTiming) {
      selectedTiming = newTiming;

      // Immediately update all rendered panel headings and subheadings so the
      // text reflects the new timing before the full product re-render fires
      updatePanelHeadings(newTiming);
      
      // Update desktop toggle buttons
      if (toggleContainer) {
        toggleContainer.querySelectorAll('.timing-toggle-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-timing') === newTiming);
        });
      }
      
      // Update mobile pill toggle (same as desktop)
      const timingToggleMobileContainer = document.getElementById('mobile-ampm-toggle');
      if (timingToggleMobileContainer) {
        timingToggleMobileContainer.querySelectorAll('.timing-toggle-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-timing') === newTiming);
        });
      }
      
      // Update thumb icon + label in every toggle track (desktop + mobile)
      document.querySelectorAll('.timing-toggle-track').forEach(function(track) {
        var thumb = track.querySelector('.timing-toggle-thumb');
        if (thumb) {
          var icon = newTiming === 'AM' ? 'sun' : 'moon';
          thumb.innerHTML = '<i data-lucide="' + icon + '" width="12" height="12" aria-hidden="true"></i><span>' + newTiming + '</span>';
          if (window.lucide) lucide.createIcons({ nodes: [thumb] });
        }
      });
      
      // Update mobile dropdown label (if present, e.g. other UI)
      if (timingDropdownLabel) {
        timingDropdownLabel.textContent = newTiming + ' Routine';
      }
      
      // Update selected state in dropdown menu
      if (timingDropdownMenu) {
        timingDropdownMenu.querySelectorAll('.timing-dropdown-option').forEach(option => {
          if (option.getAttribute('data-value') === newTiming) {
            option.setAttribute('aria-selected', 'true');
            option.classList.add('selected');
          } else {
            option.setAttribute('aria-selected', 'false');
            option.classList.remove('selected');
          }
        });
      }
      
      // Close mobile dropdown
      if (timingDropdownMenu && timingDropdownBtn) {
        timingDropdownMenu.classList.add('hidden');
        timingDropdownBtn.setAttribute('aria-expanded', 'false');
        if (timingDropdownBtn.querySelector('svg')) {
          timingDropdownBtn.querySelector('svg').style.transform = 'rotate(0deg)';
        }
      }
      
      // Re-render all panels with new timing
      loadRoutineRecommendations();
    }
    
    function attachTimingToggleListeners(container) {
      if (!container) return;
      container.querySelectorAll('.timing-toggle-btn').forEach(btn => {
        const handler = function() {
          const newTiming = btn.getAttribute('data-timing');
          switchTiming(newTiming);
        };
        btn.addEventListener('click', handler);
        btn.addEventListener('touchend', function(e) {
          e.preventDefault();
          handler();
        }, { passive: false });
      });
    }
    
    // Desktop pill toggle
    attachTimingToggleListeners(toggleContainer);
    // Mobile pill toggle (same component, touch-friendly)
    attachTimingToggleListeners(document.getElementById('mobile-ampm-toggle'));
    
    // Initialize thumb icon + label to match current selectedTiming
    document.querySelectorAll('.timing-toggle-track').forEach(function(track) {
      var thumb = track.querySelector('.timing-toggle-thumb');
      if (thumb) {
        var icon = selectedTiming === 'AM' ? 'sun' : 'moon';
        thumb.innerHTML = '<i data-lucide="' + icon + '" width="12" height="12" aria-hidden="true"></i><span>' + selectedTiming + '</span>';
        if (window.lucide) lucide.createIcons({ nodes: [thumb] });
      }
    });
  }

  // ──────────────────────────────────────────────
  //  TABS
  // ──────────────────────────────────────────────
  function setupTabs() {
    var tabs = document.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('[role="tabpanel"]');
    var tierDropdownBtn = document.getElementById('tier-dropdown-btn');
    var tierDropdownMenu = document.getElementById('tier-dropdown-menu');
    var tierDropdownLabel = document.getElementById('tier-dropdown-label');
    // Mobile custom dropdown elements
    var mobileTierDropdown       = document.getElementById('mobile-tier-dropdown');
    var mobileTierTrigger        = document.getElementById('mobile-tier-trigger');
    var mobileTierPanel          = document.getElementById('mobile-tier-panel');
    var mobileTierTriggerText    = document.getElementById('mobile-tier-trigger-text');
    var mobileTierTriggerBadge   = document.getElementById('mobile-tier-trigger-badge');
    // Tier labels mapping
    const tierLabels = {
      essential: 'Essential (3 Products)',
      enhanced: 'Enhanced (5 Products)',
      comprehensive: 'Comprehensive (7 Products)'
    };

    // Tier level-indicator SVG — identical markup for all tiers; CSS fills bars based on data-tier context
    var TIER_ICON_SVG = '<svg class="mobile-tier-trigger-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect class="tier-bar-1" x="1.5" y="10.5" width="3" height="4" rx="1"/><rect class="tier-bar-2" x="6.5" y="6.5" width="3" height="8" rx="1"/><rect class="tier-bar-3" x="11.5" y="2.5" width="3" height="12" rx="1"/></svg>';
    var TIER_SVG = {
      essential:     TIER_ICON_SVG,
      enhanced:      TIER_ICON_SVG,
      comprehensive: TIER_ICON_SVG
    };

    // Per-tier data for the mobile custom dropdown
    var tierData = {
      essential:     { name: 'Essential',     count: '3 Products', svgIcon: TIER_SVG.essential     },
      enhanced:      { name: 'Enhanced',      count: '5 Products', svgIcon: TIER_SVG.enhanced      },
      comprehensive: { name: 'Comprehensive', count: '7 Products', svgIcon: TIER_SVG.comprehensive }
    };

    // Function to switch tabs
    function switchToTier(tierId) {
      // Update desktop tabs
      tabs.forEach(function (t) {
        t.classList.remove('routine-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) {
        p.classList.add('hidden');
      });

      var tab = document.getElementById('tab-' + tierId);
      if (tab) {
        tab.classList.add('routine-tab--active');
        tab.setAttribute('aria-selected', 'true');
      }

      var panel = document.getElementById('panel-' + tierId);
      if (panel) {
        panel.classList.remove('hidden');
        panel.style.animation = 'none';
        void panel.offsetHeight;
        panel.style.animation = '';
      }
      
      // Update mobile dropdown label
      if (tierDropdownLabel && tierLabels[tierId]) {
        tierDropdownLabel.textContent = tierLabels[tierId];
      }
      
      // Update selected state in dropdown menu
      if (tierDropdownMenu) {
        tierDropdownMenu.querySelectorAll('.tier-dropdown-option').forEach(option => {
          if (option.getAttribute('data-value') === tierId) {
            option.setAttribute('aria-selected', 'true');
            option.classList.add('selected');
          } else {
            option.setAttribute('aria-selected', 'false');
            option.classList.remove('selected');
          }
        });
      }
      
      // Close mobile dropdown
      if (tierDropdownMenu && tierDropdownBtn) {
        tierDropdownMenu.classList.add('hidden');
        tierDropdownBtn.setAttribute('aria-expanded', 'false');
        if (tierDropdownBtn.querySelector('svg')) {
          tierDropdownBtn.querySelector('svg').style.transform = 'rotate(0deg)';
        }
      }
      
      // Show/hide appropriate upgrade section
      updateUpgradeVisibility(tierId);
      
      // Sync mobile custom dropdown trigger label, badge, icon, and data-tier (for CSS fill state)
      if (tierData[tierId]) {
        if (mobileTierTriggerText)  mobileTierTriggerText.textContent = tierData[tierId].name;
        if (mobileTierTriggerBadge) mobileTierTriggerBadge.textContent = tierData[tierId].count;
        if (mobileTierTrigger) mobileTierTrigger.setAttribute('data-tier', tierId);
        var iconWrap = document.getElementById('mobile-tier-trigger-icon-wrap');
        if (iconWrap) {
          iconWrap.innerHTML = tierData[tierId].svgIcon;
        }
      }
      // Update active state on panel options
      if (mobileTierPanel) {
        mobileTierPanel.querySelectorAll('.mobile-tier-option').forEach(function(opt) {
          opt.setAttribute('aria-selected', opt.getAttribute('data-tier') === tierId ? 'true' : 'false');
        });
      }
      // Close the panel after any tier change
      if (mobileTierPanel)   mobileTierPanel.classList.remove('open');
      if (mobileTierTrigger) mobileTierTrigger.setAttribute('aria-expanded', 'false');
    }

    // Desktop tab clicks
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var tierId = tab.id.replace('tab-', '');
        switchToTier(tierId);
      });
    });

    // Mobile custom tier dropdown (≤560px)
    if (mobileTierTrigger && mobileTierPanel) {
      function openMobileTierDropdown() {
        mobileTierPanel.classList.add('open');
        mobileTierTrigger.setAttribute('aria-expanded', 'true');
      }
      function closeMobileTierDropdown() {
        mobileTierPanel.classList.remove('open');
        mobileTierTrigger.setAttribute('aria-expanded', 'false');
      }

      mobileTierTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (mobileTierPanel.classList.contains('open')) {
          closeMobileTierDropdown();
        } else {
          openMobileTierDropdown();
        }
      });
      mobileTierTrigger.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (mobileTierPanel.classList.contains('open')) {
          closeMobileTierDropdown();
        } else {
          openMobileTierDropdown();
        }
      }, { passive: false });

      mobileTierPanel.querySelectorAll('.mobile-tier-option').forEach(function(option) {
        option.addEventListener('click', function(e) {
          e.stopPropagation();
          switchToTier(this.getAttribute('data-tier'));
        });
        option.addEventListener('touchend', function(e) {
          e.preventDefault();
          e.stopPropagation();
          switchToTier(this.getAttribute('data-tier'));
        }, { passive: false });
      });

      document.addEventListener('click', function(e) {
        if (mobileTierDropdown && !mobileTierDropdown.contains(e.target)) {
          closeMobileTierDropdown();
        }
      });
      document.addEventListener('touchend', function(e) {
        if (mobileTierDropdown && !mobileTierDropdown.contains(e.target)) {
          closeMobileTierDropdown();
        }
      });
    }

    // Mobile tier dropdown (click + touchend for touch devices)
    if (tierDropdownBtn && tierDropdownMenu) {
      function toggleTierDropdown() {
        const isExpanded = tierDropdownBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          tierDropdownMenu.classList.add('hidden');
          tierDropdownBtn.setAttribute('aria-expanded', 'false');
          var svg = tierDropdownBtn.querySelector('svg');
          if (svg) svg.style.transform = 'rotate(0deg)';
        } else {
          tierDropdownMenu.classList.remove('hidden');
          tierDropdownBtn.setAttribute('aria-expanded', 'true');
          var svg = tierDropdownBtn.querySelector('svg');
          if (svg) svg.style.transform = 'rotate(180deg)';
        }
      }
      function closeTierDropdown() {
        tierDropdownMenu.classList.add('hidden');
        tierDropdownBtn.setAttribute('aria-expanded', 'false');
        var svg = tierDropdownBtn.querySelector('svg');
        if (svg) svg.style.transform = 'rotate(0deg)';
      }
      tierDropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleTierDropdown();
      });
      tierDropdownBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleTierDropdown();
      }, { passive: false });
      
      tierDropdownMenu.querySelectorAll('.tier-dropdown-option').forEach(option => {
        option.addEventListener('click', function() {
          const value = this.getAttribute('data-value');
          switchToTier(value);
        });
        option.addEventListener('touchend', function(e) {
          e.preventDefault();
          const value = this.getAttribute('data-value');
          switchToTier(value);
        }, { passive: false });
      });
      
      document.addEventListener('click', function(e) {
        if (!tierDropdownBtn.contains(e.target) && !tierDropdownMenu.contains(e.target)) {
          closeTierDropdown();
        }
      });
      document.addEventListener('touchend', function(e) {
        if (!tierDropdownBtn.contains(e.target) && !tierDropdownMenu.contains(e.target)) {
          closeTierDropdown();
        }
      });
    }
  }

  function updateUpgradeVisibility(activeTier) {
    // Hide all upgrade sections
    ['essential', 'enhanced', 'comprehensive'].forEach(function(tier) {
      var upgradeSection = document.getElementById('upgrade-' + tier);
      if (upgradeSection) {
        upgradeSection.style.display = 'none';
      }
    });
    
    // Show the upgrade section for the active tier (if it exists)
    var activeUpgradeSection = document.getElementById('upgrade-' + activeTier);
    if (activeUpgradeSection && activeUpgradeSection.innerHTML.trim()) {
      activeUpgradeSection.style.display = 'block';
    }
  }

  // ──────────────────────────────────────────────
  //  TOOLTIPS
  // ──────────────────────────────────────────────
  function setupTooltips() {
    var triggers = document.querySelectorAll('.tooltip-trigger[data-tooltip]');

    triggers.forEach(function (trigger) {
      var text = trigger.getAttribute('data-tooltip');
      if (!text) return;

      var bubble = document.createElement('span');
      bubble.className = 'tooltip-bubble';
      bubble.textContent = text;
      trigger.appendChild(bubble);
    });
  }

  // ──────────────────────────────────────────────
  //  ADD TO CART + CART STATE MANAGEMENT
  // ──────────────────────────────────────────────
  var cart = [];
  var upgradeProductsForTier = {
    essential: [],
    enhanced: []
  };

  function setupAddToBag() {
    // Initial setup handled by attachPanelListeners after dynamic rendering
    setupMiniCart();
    setupSizeSelectors();
    
    // Handle body care and other static add-to-cart buttons
    document.querySelectorAll('.add-to-bag-btn').forEach(function(btn) {
      if (btn.hasAttribute('data-listener-attached')) return;
      btn.setAttribute('data-listener-attached', 'true');
      
      // Check initial state
      const product = btn.getAttribute('data-product');
      const size = btn.getAttribute('data-size') || 'Standard';
      const cartItem = cart.find(item => item.product === product && item.size === size);
      if (cartItem) {
        btn.classList.add('in-cart');
        btn.innerHTML = `<span>In Cart</span> <span class="cart-quantity">${cartItem.quantity}</span>`;
      }

      btn.addEventListener('click', function() {
        // Prevent multiple clicks
        if (btn.classList.contains('loading') || btn.classList.contains('added')) {
          return;
        }

        const price = parseFloat(btn.getAttribute('data-price'));
        const size = btn.getAttribute('data-size') || 'Standard';
        const productName = formatProductName(product);
        
        // Set loading state
        btn.classList.add('loading');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Adding...';
        
        // Simulate API call delay
        setTimeout(function() {
          addToCart(product, price, productName, size);
          
          // Set added state
          btn.classList.remove('loading');
          btn.classList.add('added');
          btn.innerHTML = '<i data-lucide="check" width="14" height="14" class="inline mr-1" aria-hidden="true"></i> Added';
          if (window.lucide) lucide.createIcons({ nodes: [btn] });
          
          // Update to in-cart state after brief delay
          setTimeout(function() {
            btn.classList.remove('added');
            updateButtonStates();
          }, 1500);
        }, 300);
      });
    });
  }

  function setupMiniCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const miniCart = document.getElementById('mini-cart');
    
    if (!cartToggle || !miniCart) return;

    // Toggle mini-cart on click
    cartToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = cartToggle.getAttribute('aria-expanded') === 'true';
      cartToggle.setAttribute('aria-expanded', !isExpanded);
      miniCart.classList.toggle('hidden');
    });

    // Close mini-cart when clicking outside
    document.addEventListener('click', function(e) {
      if (!cartToggle.contains(e.target) && !miniCart.contains(e.target)) {
        cartToggle.setAttribute('aria-expanded', 'false');
        miniCart.classList.add('hidden');
      }
    });
  }

  function setupSizeSelectors() {
    // Wire custom size dropdowns for any statically rendered cards
    setupCustomSizeDropdowns(document);

    // Handle remove from cart buttons (for static elements)
    document.querySelectorAll('.remove-from-cart-btn').forEach(function(btn) {
      if (btn.hasAttribute('data-listener-attached')) return;
      btn.setAttribute('data-listener-attached', 'true');
      
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productSlug = btn.getAttribute('data-product');
        const size = btn.getAttribute('data-size') || 'Standard';
        
        removeFromCart(productSlug, size);
        updateButtonStates();
      });
    });
  }

  function addToCart(productSlug, price, productName, size) {
    // Check if product with same size is already in cart
    const existingItem = cart.find(item => item.product === productSlug && item.size === size);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ 
        product: productSlug, 
        price: parseFloat(price),
        size: size || 'Standard',
        name: productName || formatProductName(productSlug),
        quantity: 1
      });
    }
    
    updateCartBadge();
    updateMiniCart();
    checkForTierUpgrade(productSlug);
    
    // Show mini-cart briefly when item is added
    const miniCart = document.getElementById('mini-cart');
    const cartToggle = document.getElementById('cart-toggle');
    if (miniCart && cartToggle) {
      cartToggle.setAttribute('aria-expanded', 'true');
      miniCart.classList.remove('hidden');
      
      // Auto-hide after 3 seconds if user doesn't interact
      setTimeout(function() {
        if (miniCart && !miniCart.matches(':hover') && !cartToggle.matches(':hover')) {
          cartToggle.setAttribute('aria-expanded', 'false');
          miniCart.classList.add('hidden');
        }
      }, 3000);
    }
  }

  function checkForTierUpgrade(addedProduct) {
    // Check if we should auto-upgrade to next tier
    var currentTab = document.querySelector('.routine-tab--active');
    if (!currentTab) return;
    
    var currentTierId = currentTab.id.replace('tab-', '');
    var upgradeProducts = upgradeProductsForTier[currentTierId];
    
    if (!upgradeProducts || upgradeProducts.length === 0) return;
    
    // Check if all upgrade products have been added to cart
    var addedUpgradeProducts = cart.filter(function(item) {
      return upgradeProducts.includes(item.product);
    });
    
    // Create a set of unique upgrade products in cart
    var uniqueAddedUpgrades = new Set(addedUpgradeProducts.map(function(item) { return item.product; }));
    
    // If all upgrade products are in cart, switch to next tier
    if (uniqueAddedUpgrades.size === upgradeProducts.length) {
      var nextTier = currentTierId === 'essential' ? 'enhanced' : 'comprehensive';
      var nextTab = document.getElementById('tab-' + nextTier);
      
      if (nextTab) {
        // Small delay for better UX
        setTimeout(function() {
          nextTab.click();
        }, 500);
      }
    }
  }

  function updateCartBadge() {
    var badge = document.getElementById('cart-count');
    if (!badge) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    
    if (totalItems > 0) {
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  }

  function updateMiniCart() {
    const miniCartItems = document.getElementById('mini-cart-items');
    const miniCartFooter = document.getElementById('mini-cart-footer');
    const miniCartCount = document.getElementById('mini-cart-count');
    const miniCartTotal = document.getElementById('mini-cart-total');
    
    if (!miniCartItems) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update count
    if (miniCartCount) {
      miniCartCount.textContent = totalItems + (totalItems === 1 ? ' item' : ' items');
    }

    if (totalItems === 0) {
      miniCartItems.innerHTML = '<div class="p-[--space-6] text-center"><p class="text-sm font-light text-[--muted-foreground]">Your cart is empty</p></div>';
      if (miniCartFooter) miniCartFooter.classList.add('hidden');
    } else {
      // Render cart items
      let html = '<div class="divide-y divide-[--border]">';
      cart.forEach(function(item) {
        html += `
          <div class="p-[--space-4] flex items-center gap-[--space-3]">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-[--foreground] leading-tight">${item.name}</p>
              <div class="flex items-center gap-[--space-2] mt-[--space-1]">
                <span class="text-xs font-light text-[--muted-foreground]">$${item.price.toFixed(2)}</span>
                ${item.size && item.size !== 'Standard' ? `<span class="text-xs font-light text-[--muted-foreground]">• ${item.size}</span>` : ''}
                ${item.quantity > 1 ? `<span class="text-xs font-light text-[--muted-foreground]">× ${item.quantity}</span>` : ''}
              </div>
            </div>
            <button class="remove-from-cart-btn text-[--muted-foreground] hover:text-[--foreground] transition-colors" data-product="${item.product}" data-size="${item.size || 'Standard'}" aria-label="Remove item">
              <i data-lucide="x" width="16" height="16" aria-hidden="true"></i>
            </button>
          </div>
        `;
      });
      html += '</div>';
      miniCartItems.innerHTML = html;
      if (window.lucide) lucide.createIcons({ nodes: [miniCartItems] });

      // Update total
      if (miniCartTotal) {
        miniCartTotal.textContent = '$' + totalPrice.toFixed(2);
      }
      if (miniCartFooter) miniCartFooter.classList.remove('hidden');

      // Attach remove button listeners
      miniCartItems.querySelectorAll('.remove-from-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const productSlug = btn.getAttribute('data-product');
          const size = btn.getAttribute('data-size') || 'Standard';
          removeFromCart(productSlug, size);
        });
      });
    }
  }

  function removeFromCart(productSlug, size) {
    const itemIndex = cart.findIndex(item => item.product === productSlug && item.size === (size || 'Standard'));
    if (itemIndex !== -1) {
      const item = cart[itemIndex];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
      updateCartBadge();
      updateMiniCart();
      updateButtonStates();
    }
  }

  function updateButtonStates() {
    // Update all add-to-cart buttons to reflect cart state
    document.querySelectorAll('.add-to-bag-btn').forEach(function(btn) {
      // Skip if button is in loading or added state (let those complete first)
      if (btn.classList.contains('loading') || btn.classList.contains('added')) {
        return;
      }
      
      const productSlug = btn.getAttribute('data-product');
      const size = btn.getAttribute('data-size') || 'Standard';
      const cartItem = cart.find(item => item.product === productSlug && item.size === size);
      
      const productCard = btn.closest('[data-product-slug]');
      const removeBtn = productCard ? productCard.querySelector('.remove-from-cart-btn') : null;
      
      if (cartItem) {
        btn.classList.add('in-cart');
        btn.classList.remove('loading', 'added');
        btn.disabled = false;
        btn.innerHTML = `<span>In Cart</span> <span class="cart-quantity">${cartItem.quantity}</span>`;
        
        // Show remove button
        if (removeBtn) {
          removeBtn.classList.remove('hidden');
        }
      } else {
        btn.classList.remove('in-cart', 'loading', 'added');
        btn.disabled = false;
        btn.innerHTML = 'Add to Cart';
        
        // Hide remove button
        if (removeBtn) {
          removeBtn.classList.add('hidden');
        }
      }
    });
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
  //  MOBILE HEADER PADDING
  // ──────────────────────────────────────────────
  function setupMobileHeaderPadding() {
    const header = document.querySelector('header');
    if (!header) return;
    
    function updateBodyPadding() {
      // Only apply on mobile (max-width: 767px)
      if (window.innerWidth <= 767) {
        const headerHeight = header.offsetHeight;
        document.body.style.paddingTop = headerHeight + 'px';
      } else {
        document.body.style.paddingTop = '';
      }
    }
    
    // Set initial padding
    updateBodyPadding();
    
    // Update on resize
    window.addEventListener('resize', updateBodyPadding);
    
    // Update when mobile nav is toggled (header height changes)
    const mobileNavBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNavBtn && mobileNav) {
      mobileNavBtn.addEventListener('click', function() {
        setTimeout(updateBodyPadding, 100); // Small delay to allow nav to toggle
      });
    }
  }

  // ──────────────────────────────────────────────
  //  SAVE RESULTS VIA EMAIL
  // ──────────────────────────────────────────────
  function setupSaveResults() {
    const btn = document.getElementById('save-results-btn');
    const modal = document.getElementById('email-modal');
    const form = document.getElementById('email-form');
    const emailInput = document.getElementById('email-input');
    const emailError = document.getElementById('email-error');
    
    if (!btn || !modal || !form) return;

    // Open modal
    btn.addEventListener('click', function() {
      emailInput.value = '';
      emailError.classList.add('hidden');
      emailError.textContent = '';
      showModal('email-modal');
      emailInput.focus();
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      emailError.classList.add('hidden');
      emailError.textContent = '';
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.remove('hidden');
        emailInput.focus();
        return;
      }

      // Collect routine data
      const routineData = {
        quizResults: QUIZ_RESULTS,
        selectedTier: getCurrentActiveTier(),
        selectedTiming: selectedTiming,
        products: getCurrentRoutineProducts()
      };

      // In a real implementation, this would send data to a backend API
      // fetch('/api/save-results', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: email, data: routineData })
      // })
      // .then(response => response.json())
      // .then(data => {
      //   hideModal('email-modal');
      //   showToast('Your routine has been sent to ' + email + '!');
      // })
      // .catch(error => {
      //   emailError.textContent = 'Something went wrong. Please try again.';
      //   emailError.classList.remove('hidden');
      // });

      // For now, simulate success
      hideModal('email-modal');
      showToast('Your routine has been sent to ' + email + '!');
    });

    // Setup modal close handlers
    setupModalClose('email-modal');
  }

  // ──────────────────────────────────────────────
  //  RETAKE QUIZ
  // ──────────────────────────────────────────────
  function setupRetakeQuiz() {
    const btn = document.getElementById('retake-quiz-btn');
    const modal = document.getElementById('retake-modal');
    const confirmBtn = document.getElementById('confirm-retake-btn');
    
    if (!btn || !modal || !confirmBtn) return;

    // Open modal
    btn.addEventListener('click', function() {
      showModal('retake-modal');
    });

    // Handle confirmation
    confirmBtn.addEventListener('click', function() {
      // In a real implementation, this would redirect to the quiz page
      window.location.href = '/routine-finder'; // Update with actual quiz URL
    });

    // Setup modal close handlers
    setupModalClose('retake-modal');
  }

  // ──────────────────────────────────────────────
  //  MODAL HELPERS
  // ──────────────────────────────────────────────
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  function setupModalClose(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Close on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', function() {
        hideModal(modalId);
      });
    }

    // Close on close button click
    const closeButtons = modal.querySelectorAll('[data-modal-close="' + modalId + '"]');
    closeButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        hideModal(modalId);
      });
    });
  }

  // Global Escape key handler for any open modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('[id$="-modal"]:not(.hidden)');
      if (openModal) {
        hideModal(openModal.id);
      }
    }
  });

  // ──────────────────────────────────────────────
  //  HELPERS
  // ──────────────────────────────────────────────
  function formatProductName(slug) {
    // Try to get product name from product data first
    if (window.DermalogicaData && window.DermalogicaData.PRODUCT_DETAILS) {
      for (const [name, details] of Object.entries(window.DermalogicaData.PRODUCT_DETAILS)) {
        if (slugify(name) === slug) {
          return name.toLowerCase();
        }
      }
    }
    
    // Fallback to formatting slug (lowercase for consistency)
    return slug
      .split('-')
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join(' ')
      .toLowerCase();
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function getCurrentActiveTier() {
    const activeTab = document.querySelector('.routine-tab--active');
    if (!activeTab) return 'Essential';
    
    const tabId = activeTab.id;
    if (tabId.includes('essential')) return 'Essential';
    if (tabId.includes('enhanced')) return 'Enhanced';
    if (tabId.includes('comprehensive')) return 'Comprehensive';
    return 'Essential';
  }

  function getCurrentRoutineProducts() {
    const activeTier = getCurrentActiveTier();
    if (!window.DermalogicaData) return [];
    
    const quizForTier = { ...QUIZ_RESULTS, tier: activeTier };
    let products = window.DermalogicaData.getRecommendations(quizForTier);
    
    // Filter by selected timing
    if (selectedTiming === 'AM') {
      products = products.filter(p => p.timing === 'AM');
    } else if (selectedTiming === 'PM') {
      products = products.filter(p => p.timing === 'PM');
    }
    
    return products.map(p => ({
      name: p.product,
      step: p.step,
      timing: p.timing,
      price: p.details.price,
      category: p.details.category
    }));
  }
})();
