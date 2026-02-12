const {
    log,
    plugins: {
      utils: { stringToHtmlNode },
    },
  } = window.intellimize;
  
  const productInfoContainer = document.querySelector('.product__info-container');
  
  const showPairing = () => {
    const hasDuration = productInfoContainer.querySelector('#recommended-pro-treatment');
    if (hasDuration) return; // If already added, do nothing
  
    const productForm = productInfoContainer.querySelector('form');
    if (!productForm) {
      log('[617103982] Product form not found', 4);
      return;
    }
  
    const productId = productForm.dataset.productid;
    if (!productId) {
      log('[617103982] Product ID not found', 4);
      return;
    }
  
    const proSkinTreatmentPairingsData = window.iDermalogica?.pdpMethods?.getProSkinTreatmentPairings?.getData?.();
    if (!proSkinTreatmentPairingsData || !Array.isArray(proSkinTreatmentPairingsData)) {
      log('[617103982] Invalid or missing pairing data', 4);
      return;
    }
  
    const productData = proSkinTreatmentPairingsData.find((product) => product.productID === Number(productId));
    if (!productData) {
      log(`[617103982] No data found for product ID ${productId}`, 4);
      return;
    }
  
    const { proTreatment, proTreatmentURL, proTreatmentImageURL, proTreatmentDescription } = productData;
  
    const complementaryProducts = productInfoContainer.querySelector('.complementary_products_container');
    if (!complementaryProducts) {
      log('[617103982] Complementary products container not found', 4);
      return;
    }
  
    const generateTreatment = () =>
      stringToHtmlNode(`<div>
        <h4 class="complementary_products_heading" style="">professional treatment pairing:</h4>
        <div id="recommended-pro-treatment" class="product complementary_products_wrapper">
          <div class="complementary_products_image">
            <img class="product__img" src="${proTreatmentImageURL}" alt="${proTreatment}" />
          </div>
          <div class="complementary_product__info">
            <div class="complementary_product__content">
              <div class="complementary_product__title_price">
                <p class="complementary_product__title">${proTreatment}</p>
              </div>
              <p class="complementary_product__benefits">${proTreatmentDescription}</p>
            </div>
            <button alt="Find a Skin Therapist Button" class="atc_variant_button wf-find-skin-therapist-button" style="white-space: nowrap;">
              <span style="pointer-events: none;">FIND PROFESSIONAL</span>
              <div class="derm-loading-spinner">
                  <div></div>
              </div>
            </button>
          </div>
        </div>
      </div>`);
  
    const treatmentPairing = generateTreatment();
  
    const button = treatmentPairing.querySelector('button');
    button.addEventListener('click', () => {
      window.location.href = proTreatmentURL;
    });
  
    try {
      complementaryProducts.after(treatmentPairing);
      log('[617103982] Treatment pairing added successfully', 1);
    } catch (error) {
      log(`[617103982] Error adding treatment pairing: ${error.message}`, 4);
    }
  };
  
  // Debounce function to limit how frequently showPairing is called
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };
  
  const debouncedShowPairing = debounce(showPairing, 200);
  
  // MutationObserver to handle dynamic DOM changes
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        debouncedShowPairing();
      }
    }
  });
  
  // Start observing changes in the product info container
  observer.observe(productInfoContainer, {
    childList: true,
    subtree: true,
  });
  
  // Initial call to showPairing
  showPairing();
  
  // Cleanup observer after a set timeout (e.g., 1 minute)
  setTimeout(() => {
    observer.disconnect();
    log('[617103982] MutationObserver disconnected after 1 minute', 1);
  }, 60_000);
  