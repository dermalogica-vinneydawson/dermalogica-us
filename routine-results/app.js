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
    setupMobileHeaderPadding();
    initializeDropdownStates();
    
    // Initialize cart display
    updateCartBadge();
    updateMiniCart();
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
      const isMobile = window.innerWidth <= 767;
      
      // On mobile, header is fixed, so sticky tabs should stick at top: 0
      // (they'll appear below the fixed header visually)
      // On desktop, sticky tabs should stick below the header
      const topValue = isMobile ? '0' : headerHeight + 'px';
      
      // Set position and top using inline styles (these have high specificity)
      stickyTabs.style.setProperty('position', 'sticky', 'important');
      stickyTabs.style.setProperty('top', topValue, 'important');
      stickyTabs.style.setProperty('z-index', '40', 'important');
      stickyTabs.style.setProperty('width', '100%', 'important');
      
      // For webkit browsers, the browser will automatically handle -webkit-sticky
      // when position: sticky is set
    }
    
    // Set initial position immediately
    updateStickyPosition();
    
    // Also set it after delays to ensure header height is calculated
    setTimeout(updateStickyPosition, 50);
    setTimeout(updateStickyPosition, 200);
    setTimeout(updateStickyPosition, 500);
    
    // Update on resize (in case header height changes or screen size changes)
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateStickyPosition, 50);
    });
    
    // Also update when mobile nav toggles (header height changes)
    const mobileNavBtn = document.getElementById('mobile-menu-btn');
    if (mobileNavBtn) {
      mobileNavBtn.addEventListener('click', function() {
        setTimeout(updateStickyPosition, 100);
        setTimeout(updateStickyPosition, 300);
      });
    }
    
    // Also update when window loads completely
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
    
    // Set initial state based on screen size
    // Mobile (< 768px): collapsed, Desktop (>= 768px): expanded
    function setInitialState() {
      const isMobile = window.innerWidth < 768;
      const isExpanded = !isMobile;
      
      toggle.setAttribute('aria-expanded', isExpanded);
      content.style.overflow = 'hidden';
      
      if (isExpanded) {
        content.style.display = 'block';
        // Wait for content to render, then set maxHeight
        setTimeout(() => {
          content.style.maxHeight = content.scrollHeight + 'px';
        }, 100);
        chevron.style.transform = 'rotate(0deg)';
      } else {
        content.style.display = 'none';
        content.style.maxHeight = '0';
        chevron.style.transform = 'rotate(180deg)';
      }
    }
    
    // Set initial state
    setInitialState();
    
    // Toggle on click
    toggle.addEventListener('click', function() {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      toggle.setAttribute('aria-expanded', newState);
      
      if (newState) {
        content.style.display = 'block';
        // Use setTimeout to ensure display is set before animating
        setTimeout(() => {
          content.style.maxHeight = content.scrollHeight + 'px';
        }, 10);
        chevron.style.transform = 'rotate(0deg)';
      } else {
        content.style.maxHeight = '0';
        chevron.style.transform = 'rotate(180deg)';
        // Hide after animation completes
        setTimeout(() => {
          if (content.style.maxHeight === '0px') {
            content.style.display = 'none';
          }
        }, 300);
      }
    });
    
    // Update maxHeight when content changes (e.g., after dynamic content loads)
    const updateMaxHeight = function() {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    };
    
    // Watch for content changes
    const observer = new MutationObserver(updateMaxHeight);
    observer.observe(content, { childList: true, subtree: true });
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

    // Icon component helper - smaller icons for compact layout
    const iconSVG = (iconType) => {
      const icons = {
        age: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 5v5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        concern: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 17c0-2.5 2.2-5 5-5s5 2.5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        timing: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        preference: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L3 7v10l7 4 7-4V7l-7-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M10 3v18M3 7l7 4 7-4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>`,
        sensitivity: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3v14M10 3c2.5 0 4.5 2 4.5 4.5S12.5 12 10 12s-4.5-2-4.5-4.5S7.5 3 10 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="10" cy="17" r="1.5" fill="currentColor"/>
        </svg>`,
        franchise: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>`,
        goal: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M6 10l2.5 2.5 5.5-5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
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
        <!-- Recommended Franchise -->
        <div class="flex items-start gap-[--space-2] p-[--space-3] bg-[--card-header] rounded border border-[--border]">
          <div class="flex-shrink-0 text-[--primary] mt-0.5">
            ${iconSVG('franchise')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-0.5">Recommended Franchise</h3>
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
    
    // Update maxHeight if section is expanded (for smooth animation)
    setTimeout(() => {
      const toggle = document.getElementById('skin-analysis-toggle');
      const isExpanded = toggle && toggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded && container.style.maxHeight !== '0px') {
        container.style.maxHeight = container.scrollHeight + 'px';
      }
    }, 50);
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
        // Update toggle button states
        toggleContainer.querySelectorAll('.timing-toggle-btn').forEach(btn => {
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
    
    // Render routine header
    html += '<div class="mb-[--space-6]">';
    html += '<h3 class="text-xl font-bold text-[--heading] mb-[--space-2]">' + selectedTiming + ' Routine</h3>';
    html += '<p class="text-sm font-light text-[--muted-foreground] mb-[--space-6]">Add these ' + displayProducts.length + ' products to complete your ' + tier.toLowerCase() + ' ' + selectedTiming + ' routine.</p>';
    html += '</div>';
    
    // Render product grid - extends to page margins on mobile
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[--space-4] mb-[--space-8]">';
    displayProducts.forEach(product => {
      html += renderProductCard(product);
    });
    html += '</div>';

    // Add summary CTA
    html += renderRoutineSummary(tier, displayProducts.length, totalPrice, selectedTiming);

    panel.innerHTML = html;
    
    // Re-attach event listeners for this panel
    attachPanelListeners(panel);
    
    // Update button states after rendering
    updateButtonStates();
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
    
    // Build size selector HTML (dropdown)
    let sizeSelectorHTML = '';
    if (hasMultipleSizes) {
      sizeSelectorHTML = `
        <div class="mb-[--space-2]">
          <label for="size-select-${productSlug}" class="block text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-[--space-2]">Size</label>
          <select 
            id="size-select-${productSlug}"
            class="product-size-select" 
            data-product-slug="${productSlug}"
            aria-label="Select product size"
          >
            ${sizes.map((sizeOption, index) => {
              const isDefault = index === sizes.length - 1;
              return `
                <option 
                  value="${sizeOption.size}"
                  data-price="${sizeOption.price.toFixed(2)}"
                  ${isDefault ? 'selected' : ''}
                >
                  ${sizeOption.size}
                </option>
              `;
            }).join('')}
          </select>
        </div>
      `;
    }
    
    // Build step banner that spans across the top
    const stepBanner = `
      <div class="product-step-banner">
        <span class="product-step-banner-text">STEP ${stepNumber}</span>
        ${timing ? `<span class="product-step-banner-timing">${timing}</span>` : ''}
      </div>
    `;
    
    return `
      <div class="product-card" data-product-slug="${productSlug}">
        ${stepBanner}
        <div class="product-card-img">
          <img src="${image}" alt="${productTitle}" loading="lazy" />
        </div>
        <div class="product-card-body relative">
          <button class="tooltip-trigger absolute top-[--space-2] right-[--space-2] flex-shrink-0" aria-label="Product info" data-tooltip="${description}">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--muted-foreground)" stroke-width="1.2"/><text x="8" y="11.5" text-anchor="middle" font-size="10" font-weight="700" fill="var(--muted-foreground)">i</text></svg>
          </button>
          <div class="mb-[--space-1]">
            <span class="text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground]">${category}</span>
          </div>
          <div class="flex items-start justify-between gap-[--space-2] pr-[--space-6]">
            <h4 class="text-sm font-bold text-[--foreground] leading-tight">${productTitle}</h4>
          </div>
          ${sizeSelectorHTML}
          <div class="mt-auto pt-[--space-3] flex items-center justify-between">
            <div class="flex flex-col">
              <span class="product-price text-sm font-bold text-[--foreground]" data-default-price="${defaultPrice}">$${defaultPrice}</span>
            </div>
            <div class="flex items-center gap-[--space-2]">
              <button class="remove-from-cart-btn hidden" data-product="${productSlug}" data-size="${defaultSize.size}" aria-label="Remove from cart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
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
    
    // Build size selector HTML (dropdown)
    let sizeSelectorHTML = '';
    if (hasMultipleSizes) {
      sizeSelectorHTML = `
        <div class="mb-[--space-2]">
          <label for="size-select-${productSlug}" class="block text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-[--space-2]">Size</label>
          <select 
            id="size-select-${productSlug}"
            class="product-size-select" 
            data-product-slug="${productSlug}"
            aria-label="Select product size"
          >
            ${sizes.map((sizeOption, index) => {
              const isDefault = index === sizes.length - 1;
              return `
                <option 
                  value="${sizeOption.size}"
                  data-price="${sizeOption.price.toFixed(2)}"
                  ${isDefault ? 'selected' : ''}
                >
                  ${sizeOption.size}
                </option>
              `;
            }).join('')}
          </select>
        </div>
      `;
    }
    
    return `
      <div class="bg-[--card] rounded border border-[--border] shadow-sm flex flex-col sm:flex-row" data-product-slug="${productSlug}" style="overflow: visible;">
        <div class="sm:w-[200px] sm:h-[200px] w-full aspect-square bg-[--card-header] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-l sm:rounded-l sm:rounded-r-none rounded-t">
          <img src="${image}" alt="${productTitle}" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="p-[--space-5] flex flex-col flex-1 relative justify-between" style="overflow: visible; min-height: 200px;">
          <button class="tooltip-trigger absolute top-[--space-2] right-[--space-2] flex-shrink-0" aria-label="Product info" data-tooltip="${description}">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--muted-foreground)" stroke-width="1.2"/><text x="8" y="11.5" text-anchor="middle" font-size="10" font-weight="700" fill="var(--muted-foreground)">i</text></svg>
          </button>
          ${timing ? `<div class="flex items-center gap-[--space-2] mb-[--space-2]"><span class="inline-flex items-center px-[--space-2] py-[--space-1] rounded text-[10px] font-bold bg-[--primary] text-[--primary-foreground]">${timing}</span></div>` : ''}
          <h3 class="text-base font-bold text-[--foreground] mb-[--space-2] pr-[--space-6]">${productTitle}</h3>
          ${sizeSelectorHTML}
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="product-price text-sm font-bold text-[--foreground]" data-default-price="${defaultPrice}">$${defaultPrice}</span>
            </div>
            <div class="flex items-center gap-[--space-2]">
              <button class="remove-from-cart-btn hidden" data-product="${productSlug}" data-size="${defaultSize.size}" aria-label="Remove from cart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
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
      <div class="flex flex-col sm:flex-row items-center justify-between gap-[--space-4] p-[--space-6] bg-[--card-header] rounded border border-[--border]">
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
    
    // Build size selector HTML (dropdown)
    let sizeSelectorHTML = '';
    if (hasMultipleSizes) {
      sizeSelectorHTML = `
        <div class="mb-[--space-2]">
          <label for="${sizeSelectId}" class="block text-[10px] font-bold uppercase tracking-[0.08em] text-[--muted-foreground] mb-[--space-2]">Size</label>
          <select 
            id="${sizeSelectId}"
            class="product-size-select" 
            data-product-slug="${productSlug}"
            aria-label="Select product size"
          >
            ${sizes.map((sizeOption, index) => {
              const isDefault = index === sizes.length - 1;
              return `
                <option 
                  value="${sizeOption.size}"
                  data-price="${sizeOption.price.toFixed(2)}"
                  ${isDefault ? 'selected' : ''}
                >
                  ${sizeOption.size}
                </option>
              `;
            }).join('')}
          </select>
        </div>
      `;
    }
    
    return `
      <div class="bg-[--card] rounded border border-[--border] shadow-sm flex flex-col sm:flex-row" data-product-slug="${productSlug}" style="overflow: visible;">
        <div class="sm:w-[200px] sm:h-[200px] w-full aspect-square bg-[--card-header] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-l sm:rounded-l sm:rounded-r-none rounded-t">
          <img src="${image}" alt="${productTitle}" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="p-[--space-5] flex flex-col flex-1 relative justify-between" style="overflow: visible; min-height: 200px;">
          <button class="tooltip-trigger absolute top-[--space-2] right-[--space-2] flex-shrink-0" aria-label="Product info" data-tooltip="${description}">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--muted-foreground)" stroke-width="1.2"/><text x="8" y="11.5" text-anchor="middle" font-size="10" font-weight="700" fill="var(--muted-foreground)">i</text></svg>
          </button>
          <div class="flex items-center gap-[--space-2] mb-[--space-2]">
            <span class="inline-flex items-center px-[--space-2] py-[--space-1] rounded text-[10px] font-bold bg-[--primary] text-[--primary-foreground]">
              BODY CARE
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <button class="add-to-bag-btn" data-product="${productSlug}" data-price="${defaultPrice}" data-size="${defaultSize.size}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
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
    
    let html = `
      <div class="mb-[--space-6]">
        <h2 class="text-xl font-bold text-[--heading] mb-[--space-2]">Enhance Your Routine</h2>
        <p class="text-sm font-light text-[--muted-foreground]">Take your skincare to the next level with these targeted products designed to amplify your results.</p>
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
    
    container.innerHTML = html;
    container.style.display = 'block';
    
    // Re-attach event listeners
    attachUpgradeListeners(container);
    
    // Update button states after rendering
    updateButtonStates();
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

    // Add size selector handlers (dropdown)
    container.querySelectorAll('.product-size-select').forEach(select => {
      if (select.hasAttribute('data-listener-attached')) return;
      select.setAttribute('data-listener-attached', 'true');
      
      select.addEventListener('change', function() {
        const productCard = select.closest('[data-product-slug]');
        if (!productCard) return;
        
        const selectedOption = select.options[select.selectedIndex];
        const selectedSize = selectedOption.value;
        const selectedPrice = selectedOption.getAttribute('data-price');
        const productSlug = select.getAttribute('data-product-slug');
        
        // Update price display with smooth transition
        const priceElement = productCard.querySelector('.product-price');
        if (priceElement) {
          priceElement.style.opacity = '0.5';
          setTimeout(function() {
            priceElement.textContent = '$' + selectedPrice;
            priceElement.style.opacity = '1';
          }, 150);
        }
        
        // Update add to cart button with new variant
        const addToCartBtn = productCard.querySelector('.add-to-bag-btn');
        const removeBtn = productCard.querySelector('.remove-from-cart-btn');
        if (addToCartBtn) {
          addToCartBtn.setAttribute('data-price', selectedPrice);
          addToCartBtn.setAttribute('data-size', selectedSize);
          if (removeBtn) {
            removeBtn.setAttribute('data-size', selectedSize);
          }
          
          // If button was in "In Cart" state, check if new variant is in cart
          if (addToCartBtn.classList.contains('in-cart')) {
            addToCartBtn.classList.remove('in-cart');
            if (removeBtn) removeBtn.classList.add('hidden');
            updateButtonStates();
          } else {
            updateButtonStates();
          }
        }
      });
    });

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
        showToast('Item removed from cart');
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
          showToast('"' + productName + '" (' + size + ') added to cart');
          
          // Set added state
          btn.classList.remove('loading');
          btn.classList.add('added');
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="inline mr-1"><path d="M13 4L6 11l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Added';
          
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

    // Add size selector handlers (dropdown)
    panel.querySelectorAll('.product-size-select').forEach(select => {
      if (select.hasAttribute('data-listener-attached')) return;
      select.setAttribute('data-listener-attached', 'true');
      
      select.addEventListener('change', function() {
        const productCard = select.closest('[data-product-slug]');
        if (!productCard) return;
        
        const selectedOption = select.options[select.selectedIndex];
        const selectedSize = selectedOption.value;
        const selectedPrice = selectedOption.getAttribute('data-price');
        const productSlug = select.getAttribute('data-product-slug');
        
        // Update price display with smooth transition
        const priceElement = productCard.querySelector('.product-price');
        if (priceElement) {
          priceElement.style.opacity = '0.5';
          setTimeout(function() {
            priceElement.textContent = '$' + selectedPrice;
            priceElement.style.opacity = '1';
          }, 150);
        }
        
        // Update add to cart button with new variant
        const addToCartBtn = productCard.querySelector('.add-to-bag-btn');
        const removeBtn = productCard.querySelector('.remove-from-cart-btn');
        if (addToCartBtn) {
          addToCartBtn.setAttribute('data-price', selectedPrice);
          addToCartBtn.setAttribute('data-size', selectedSize);
          if (removeBtn) {
            removeBtn.setAttribute('data-size', selectedSize);
          }
          
          // If button was in "In Cart" state, check if new variant is in cart
          if (addToCartBtn.classList.contains('in-cart')) {
            addToCartBtn.classList.remove('in-cart');
            if (removeBtn) removeBtn.classList.add('hidden');
            updateButtonStates();
          } else {
            updateButtonStates();
          }
        }
      });
    });

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
        showToast('Item removed from cart');
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
          showToast('"' + productName + '" (' + size + ') added to cart');
          
          // Set added state
          btn.classList.remove('loading');
          btn.classList.add('added');
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="inline mr-1"><path d="M13 4L6 11l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Added';
          
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
            pBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="inline mr-1"><path d="M13 4L6 11l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Added';
            
            // If this is the last button, update add all button
            if (index === buttons.length - 1) {
              setTimeout(function() {
                addAllBtn.classList.remove('loading');
                addAllBtn.classList.add('added');
                addAllBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="inline mr-1"><path d="M13 4L6 11l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Added to Cart';
                
                showToast('All ' + capitalize(routine) + ' products added to cart');
                
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
      
      // Update desktop toggle buttons
      if (toggleContainer) {
        toggleContainer.querySelectorAll('.timing-toggle-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-timing') === newTiming);
        });
      }
      
      // Update mobile dropdown label
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
    
    // Desktop toggle buttons
    if (toggleContainer) {
      toggleContainer.querySelectorAll('.timing-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const newTiming = this.getAttribute('data-timing');
          switchTiming(newTiming);
        });
      });
    }
    
    // Mobile custom dropdown
    if (timingDropdownBtn && timingDropdownMenu) {
      // Toggle dropdown on button click
      timingDropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = timingDropdownBtn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
          timingDropdownMenu.classList.add('hidden');
          timingDropdownBtn.setAttribute('aria-expanded', 'false');
          timingDropdownBtn.querySelector('svg').style.transform = 'rotate(0deg)';
        } else {
          timingDropdownMenu.classList.remove('hidden');
          timingDropdownBtn.setAttribute('aria-expanded', 'true');
          timingDropdownBtn.querySelector('svg').style.transform = 'rotate(180deg)';
        }
      });
      
      // Handle option clicks
      timingDropdownMenu.querySelectorAll('.timing-dropdown-option').forEach(option => {
        option.addEventListener('click', function() {
          const value = this.getAttribute('data-value');
          switchTiming(value);
        });
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!timingDropdownBtn.contains(e.target) && !timingDropdownMenu.contains(e.target)) {
          timingDropdownMenu.classList.add('hidden');
          timingDropdownBtn.setAttribute('aria-expanded', 'false');
          if (timingDropdownBtn.querySelector('svg')) {
            timingDropdownBtn.querySelector('svg').style.transform = 'rotate(0deg)';
          }
        }
      });
    }
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

    // Tier labels mapping
    const tierLabels = {
      essential: 'Essential (3 Products)',
      enhanced: 'Enhanced (5 Products)',
      comprehensive: 'Comprehensive (7 Products)'
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
    }

    // Desktop tab clicks
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var tierId = tab.id.replace('tab-', '');
        switchToTier(tierId);
      });
    });

    // Mobile custom dropdown
    if (tierDropdownBtn && tierDropdownMenu) {
      // Toggle dropdown on button click
      tierDropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = tierDropdownBtn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
          tierDropdownMenu.classList.add('hidden');
          tierDropdownBtn.setAttribute('aria-expanded', 'false');
          tierDropdownBtn.querySelector('svg').style.transform = 'rotate(0deg)';
        } else {
          tierDropdownMenu.classList.remove('hidden');
          tierDropdownBtn.setAttribute('aria-expanded', 'true');
          tierDropdownBtn.querySelector('svg').style.transform = 'rotate(180deg)';
        }
      });
      
      // Handle option clicks
      tierDropdownMenu.querySelectorAll('.tier-dropdown-option').forEach(option => {
        option.addEventListener('click', function() {
          const value = this.getAttribute('data-value');
          switchToTier(value);
        });
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!tierDropdownBtn.contains(e.target) && !tierDropdownMenu.contains(e.target)) {
          tierDropdownMenu.classList.add('hidden');
          tierDropdownBtn.setAttribute('aria-expanded', 'false');
          if (tierDropdownBtn.querySelector('svg')) {
            tierDropdownBtn.querySelector('svg').style.transform = 'rotate(0deg)';
          }
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
          showToast('"' + productName + '" (' + size + ') added to cart');
          
          // Set added state
          btn.classList.remove('loading');
          btn.classList.add('added');
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="inline mr-1"><path d="M13 4L6 11l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Added';
          
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
    // Handle size selector dropdowns (for static elements like body care)
    document.querySelectorAll('.product-size-select').forEach(function(select) {
      if (select.hasAttribute('data-listener-attached')) return;
      select.setAttribute('data-listener-attached', 'true');
      
      select.addEventListener('change', function() {
        const productCard = select.closest('[data-product-slug]');
        if (!productCard) return;
        
        const selectedOption = select.options[select.selectedIndex];
        const selectedSize = selectedOption.value;
        const selectedPrice = selectedOption.getAttribute('data-price');
        const productSlug = select.getAttribute('data-product-slug');
        
        // Update price display with smooth transition
        const priceElement = productCard.querySelector('.product-price');
        if (priceElement) {
          priceElement.style.opacity = '0.5';
          setTimeout(function() {
            priceElement.textContent = '$' + selectedPrice;
            priceElement.style.opacity = '1';
          }, 150);
        }
        
        // Update add to cart button with new variant
        const addToCartBtn = productCard.querySelector('.add-to-bag-btn');
        const removeBtn = productCard.querySelector('.remove-from-cart-btn');
        if (addToCartBtn) {
          addToCartBtn.setAttribute('data-price', selectedPrice);
          addToCartBtn.setAttribute('data-size', selectedSize);
          if (removeBtn) {
            removeBtn.setAttribute('data-size', selectedSize);
          }
          
          // If button was in "In Cart" state, check if new variant is in cart
          if (addToCartBtn.classList.contains('in-cart')) {
            addToCartBtn.classList.remove('in-cart');
            if (removeBtn) removeBtn.classList.add('hidden');
            updateButtonStates();
          } else {
            updateButtonStates();
          }
        }
      });
    });

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
        showToast('Item removed from cart');
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
          showToast('🎉 Upgraded to ' + capitalize(nextTier) + ' routine!');
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        `;
      });
      html += '</div>';
      miniCartItems.innerHTML = html;

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
