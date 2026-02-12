/**
 * ReCharge Subscribe Swap - Webflow Optimize A/B Test
 * 
 * This script swaps the order of the radio options in the ReCharge widget,
 * placing the subscription option first and the one-time purchase option second.
 * 
 * Optimized for use with Webflow Optimize A/B testing.
 */

(function() {
  // Function to swap the radio options
  function swapRechargeOptions() {
    // Get the container that holds the radio options
    const radioContainer = document.querySelector('.rc-template__radio');
    
    if (!radioContainer) {
      console.log('ReCharge radio container not found');
      return;
    }
    
    // Get the radio labels (one-time and subscription)
    const onetimeLabel = radioContainer.querySelector('.onetime-radio');
    const subscriptionLabel = radioContainer.querySelector('.subscription-radio');
    
    if (!onetimeLabel || !subscriptionLabel) {
      console.log('ReCharge radio options not found');
      return;
    }
    
    // Get the selling plans container (which appears after the subscription option)
    const sellingPlans = radioContainer.querySelector('.rc-selling-plans');
    
    if (!sellingPlans) {
      console.log('ReCharge selling plans not found');
      return;
    }
    
    // Remove the elements from the DOM
    onetimeLabel.remove();
    subscriptionLabel.remove();
    sellingPlans.remove();
    
    // Reinsert them in the desired order
    radioContainer.appendChild(subscriptionLabel);
    radioContainer.appendChild(sellingPlans);
    radioContainer.appendChild(onetimeLabel);
    
    console.log('ReCharge options swapped successfully');
  }
  
  // Function to initialize the swap
  function initSwap() {
    // Try to swap immediately if the elements are already in the DOM
    swapRechargeOptions();
    
    // Also set up a mutation observer to watch for the ReCharge widget being added to the DOM
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // Check if our target element now exists
          if (document.querySelector('.rc-template__radio')) {
            swapRechargeOptions();
          }
        }
      });
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Also try again after a short delay in case the widget loads after our script
    setTimeout(swapRechargeOptions, 1000);
  }
  
  // Check if the document is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwap);
  } else {
    // Document already loaded, run immediately
    initSwap();
  }
})(); 