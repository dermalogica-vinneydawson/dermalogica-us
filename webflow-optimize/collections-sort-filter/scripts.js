const { stringToHtmlNode } = window.intellimize.plugins.utils;

// let lastToggledFilterType;
let activeDropdown;
// Store the resize handler reference so we can remove it later
let resizeHandler;

// Debounce function to limit how often a function can be called
const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const applyCustomFacetFilters = () => {
  const container = document.querySelector('div.facets-vertical');
  if (!container) return;

  // Clean up previous resize handler if it exists
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  container.id = 'i-facet-container';

  const horizontalFacetFilters = container.querySelector('.product-grid-container facet-filters-form');
  if (!horizontalFacetFilters) return;

  horizontalFacetFilters.classList.add('i-horizontal-facet-filters');

  const sidebarFilters = container.querySelector('aside');
  if (!sidebarFilters) return;

  const sortByDropdown = horizontalFacetFilters.querySelector('#FacetSortForm');
  if (!sortByDropdown) return;

  // Define price ranges for the price filter
  const priceRanges = [
    { name: 'Under $25', value: 'price-under-25', range: [0, 25] },
    { name: '$25 - $50', value: 'price-25-50', range: [25, 50] },
    { name: '$50 - $75', value: 'price-50-75', range: [50, 75] },
    { name: '$75 - $100', value: 'price-75-100', range: [75, 100] },
    { name: '$100+', value: 'price-100-plus', range: [100, Infinity] }
  ];

  const getFacetFilters = () => {
    const skinConcerns = sidebarFilters.querySelectorAll('details.it_skin_concern li .facet-value');
    const productCategories = sidebarFilters.querySelectorAll('details.it_product_category li .facet-value');
    const priceFilters = sidebarFilters.querySelectorAll('details.price-disclosure.filter-group li .facet-value');

    return {
      skinConcerns,
      productCategories,
      priceFilters: priceFilters.length > 0 ? priceFilters : null
    };
  };

  const createDropdownMenu = (label, filters, type, icon) => {
    // For price filter, if no filters are found, use our predefined price ranges
    let filterItems = '';
    
    if (type === 'priceFilters' && (!filters || filters.length <= 1)) {
      filterItems = priceRanges.map(range => `
        <label class="facet-checkbox" for="i-${range.value}">
          <input type="checkbox" class="facet-checkbox" id="i-${range.value}" name="${range.value}" data-min="${range.range[0]}" data-max="${range.range[1]}">
          <svg width="1.6rem" height="1.6rem" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <rect width="16" height="16" stroke="currentColor" fill="none" stroke-width="1"></rect>
          </svg>
          <svg class="icon-checkmark" width="1.1rem" height="0.7rem" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 3.5L2.83333 4.75L4.16667 6L9.5 1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span>${range.name}</span>
        </label>
      `).join('');
    } else if (filters && filters.length > 0) {
      filterItems = [...filters].map((filter) => {
        const value = filter.textContent;
        const name = filter.closest('label').querySelector('input').value;
        const id = 'i-' + name;

        return `
          <label class="facet-checkbox" for="${id}">
            <input type="checkbox" class="facet-checkbox" id="${id}" name="${name}">
            <svg width="1.6rem" height="1.6rem" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <rect width="16" height="16" stroke="currentColor" fill="none" stroke-width="1"></rect>
            </svg>
            <svg class="icon-checkmark" width="1.1rem" height="0.7rem" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 3.5L2.83333 4.75L4.16667 6L9.5 1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span>${value}</span>
          </label>
        `;
      }).join('');
    }

    // Return empty string if no filter items and this is not the price filter
    if (!filterItems && type !== 'priceFilters') return '';

    return `
      <div class="i-new-facet-filter-controls__dropdown" data-filter-type="${type}">
        <button class="i-new-facet-filter-controls__dropdown-button">
          ${icon}
          ${label}
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 8L10 13L15 8" stroke="#5B6670" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="i-new-facet-filter-controls__dropdown-menu">
          ${filterItems}
        </div>
      </div>
    `;
  };

  const priceIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.08329 12.2222C7.08329 13.2961 7.95385 14.1667 9.02774 14.1667H10.8333C11.9839 14.1667 12.9166 13.2339 12.9166 12.0834C12.9166 10.9328 11.9839 10 10.8333 10H9.16663C8.01603 10 7.08329 9.06728 7.08329 7.91669C7.08329 6.76609 8.01603 5.83335 9.16663 5.83335H10.9722C12.0461 5.83335 12.9166 6.70391 12.9166 7.7778M9.99996 4.58335V5.83335M9.99996 14.1667V15.4167M18.3333 10C18.3333 14.6024 14.6023 18.3334 9.99996 18.3334C5.39759 18.3334 1.66663 14.6024 1.66663 10C1.66663 5.39765 5.39759 1.66669 9.99996 1.66669C14.6023 1.66669 18.3333 5.39765 18.3333 10Z" stroke="#5B6670" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const collectionIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66663 9.99997L9.70182 14.0176C9.81114 14.0722 9.86579 14.0996 9.92313 14.1103C9.97391 14.1198 10.026 14.1198 10.0768 14.1103C10.1341 14.0996 10.1888 14.0722 10.2981 14.0176L18.3333 9.99997M1.66663 14.1666L9.70182 18.1842C9.81114 18.2389 9.86579 18.2662 9.92313 18.277C9.97391 18.2865 10.026 18.2865 10.0768 18.277C10.1341 18.2662 10.1888 18.2389 10.2981 18.1842L18.3333 14.1666M1.66663 5.83331L9.70182 1.81571C9.81114 1.76105 9.86579 1.73372 9.92313 1.72297C9.97391 1.71344 10.026 1.71344 10.0768 1.72297C10.1341 1.73372 10.1888 1.76105 10.2981 1.81571L18.3333 5.83331L10.2981 9.8509C10.1888 9.90556 10.1341 9.93289 10.0768 9.94365C10.026 9.95317 9.97391 9.95317 9.92313 9.94365C9.86579 9.93289 9.81114 9.90556 9.70182 9.8509L1.66663 5.83331Z" stroke="#5B6670" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const skinConcernIcon = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.66667 1.5H5.5C4.09987 1.5 3.3998 1.5 2.86502 1.77248C2.39462 2.01217 2.01217 2.39462 1.77248 2.86502C1.5 3.3998 1.5 4.09987 1.5 5.5V5.66667M5.66667 16.5H5.5C4.09987 16.5 3.3998 16.5 2.86502 16.2275C2.39462 15.9878 2.01217 15.6054 1.77248 15.135C1.5 14.6002 1.5 13.9001 1.5 12.5V12.3333M16.5 5.66667V5.5C16.5 4.09987 16.5 3.3998 16.2275 2.86502C15.9878 2.39462 15.6054 2.01217 15.135 1.77248C14.6002 1.5 13.9001 1.5 12.5 1.5H12.3333M16.5 12.3333V12.5C16.5 13.9001 16.5 14.6002 16.2275 15.135C15.9878 15.6054 15.6054 15.9878 15.135 16.2275C14.6002 16.5 13.9001 16.5 12.5 16.5H12.3333M5.25 5.66667V6.91667M12.75 5.66667V6.91667M8.16667 9.50008C8.83333 9.50008 9.41667 8.91675 9.41667 8.25008V5.66667M11.6668 11.6666C10.1668 13.1666 7.75016 13.1666 6.25016 11.6666" stroke="#5B6670" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const sortByIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="#5B6670" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const filters = getFacetFilters();

  const newDropdowns = stringToHtmlNode(`
    <div class="i-new-facet-filter-controls">
      ${createDropdownMenu('Price', filters.priceFilters, 'priceFilters', priceIcon)}
      ${createDropdownMenu('Collections', filters.productCategories, 'collectionsFilters', collectionIcon)}
      ${createDropdownMenu('Skin Concern', filters.skinConcerns, 'skinConcerns', skinConcernIcon)}
    </div>
  `);

  // Customize the sort by dropdown to have a single border
  const sortSelect = sortByDropdown.querySelector('select');
  if (sortSelect) {
    // Create a new wrapper for sort by
    const sortByWrapper = document.createElement('div');
    sortByWrapper.className = 'i-sort-by-wrapper';
    
    // Get the current selected option
    const selectedOption = sortSelect.options[sortSelect.selectedIndex].text;
    
    // Create the dropdown HTML with more compact structure
    sortByWrapper.innerHTML = `
      ${sortByIcon}
      <span>Sort by</span>
      <select id="SortBy_custom" style="width:auto; max-width:70px; padding:0;">
        ${Array.from(sortSelect.options).map(option => 
          `<option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>`
        ).join('')}
      </select>
      <div class="select-icon" style="margin-left:-2px;">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8L10 13L15 8" stroke="#5B6670" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
    
    // Replace the existing sort by form with our custom wrapper
    const parentElement = sortByDropdown.parentNode;
    parentElement.replaceChild(sortByWrapper, sortByDropdown);
    
    // Add event listener to sync our custom select with the original
    const customSelect = sortByWrapper.querySelector('#SortBy_custom');
    customSelect.addEventListener('change', (event) => {
      // Find the original form and submit it with the new value
      const form = document.createElement('form');
      form.method = 'get';
      form.action = window.location.pathname;
      
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'sort_by';
      input.value = event.target.value;
      
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    });
  }

  // Remove previous custom filters to prevent duplicates after reload
  const previousDropdowns = document.querySelector('.i-new-facet-filter-controls');
  if (previousDropdowns) previousDropdowns.remove();

  // Insert the new dropdowns
  const sortWrapper = document.querySelector('.i-sort-by-wrapper');
  if (sortWrapper) {
    sortWrapper.parentNode.insertBefore(newDropdowns, sortWrapper.nextSibling);
  } else {
    const facetsVerticalForm = horizontalFacetFilters.querySelector('.facets-vertical-form');
    if (facetsVerticalForm) {
      facetsVerticalForm.parentNode.insertBefore(newDropdowns, facetsVerticalForm);
    }
  }

  // Remove the previous resize handler to avoid memory leaks
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }

  // Add a class to the container to indicate the layout is initialized
  horizontalFacetFilters.classList.add('i-layout-initialized');
  
  // Ensure mobile filters are always visible
  const filterDropdownContainer = newDropdowns.querySelector('.i-filter-dropdown-container');
  if (filterDropdownContainer) {
    filterDropdownContainer.classList.add('i-show-mobile-filters');
  }

  // We don't need to manipulate the DOM for the sort by position anymore
  // The CSS will handle the positioning based on screen size

  const dropdownButtons = newDropdowns.querySelectorAll('.i-new-facet-filter-controls__dropdown-button');
  dropdownButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const parentDropdown = button.closest('.i-new-facet-filter-controls__dropdown');
      const dropdownMenu = parentDropdown.querySelector('.i-new-facet-filter-controls__dropdown-menu');
      const isActive = parentDropdown.classList.contains('i-active');

      // Close any open dropdowns
      document.querySelectorAll('.i-new-facet-filter-controls__dropdown.i-active').forEach((dropdown) => {
        dropdown.classList.remove('i-active');
        dropdown.querySelector('.i-new-facet-filter-controls__dropdown-menu').style.display = 'none';
      });

      if (isActive) {
        dropdownMenu.style.display = 'none';
        parentDropdown.classList.remove('i-active');
        activeDropdown = undefined;
        document.querySelector('.i-dropdown-backdrop').classList.remove('i-active');
      } else {
        // Dynamically calculate the position
        const buttonRect = button.getBoundingClientRect();
        const offset = 6;

        dropdownMenu.style.position = 'fixed';
        dropdownMenu.style.top = `${buttonRect.bottom + offset}px`;
        dropdownMenu.style.left = `${buttonRect.left}px`;
        dropdownMenu.style.width = 'max-content';
        dropdownMenu.style.display = 'flex';

        // Ensure the button is fully visible in the viewport
        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

        // Check if the dropdown is fully visible horizontally and reposition if needed
        const dropdownRect = dropdownMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (dropdownRect.right > viewportWidth) {
          dropdownMenu.style.left = `${Math.max(0, viewportWidth - dropdownRect.width)}px`;
        }

        parentDropdown.classList.add('i-active');
        activeDropdown = parentDropdown;
        document.querySelector('.i-dropdown-backdrop').classList.add('i-active');
      }
    });
  });

  const backdrop = document.querySelector('.i-dropdown-backdrop');
  if (backdrop) backdrop.classList.remove('i-active');

  newDropdowns.querySelectorAll('.i-new-facet-filter-controls__dropdown-menu input').forEach((checkbox) => {
    // For price filters that we created manually
    if (checkbox.hasAttribute('data-min') && checkbox.hasAttribute('data-max')) {
      checkbox.addEventListener('change', (event) => {
        const min = parseFloat(checkbox.getAttribute('data-min'));
        const max = parseFloat(checkbox.getAttribute('data-max'));
        
        // Find products within the price range
        const products = document.querySelectorAll('.card-wrapper');
        products.forEach(product => {
          const priceElement = product.querySelector('.price-item--regular');
          if (priceElement) {
            const priceText = priceElement.textContent.trim();
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            
            if (checkbox.checked) {
              // Filter products based on price range
              if (price >= min && (max === Infinity || price <= max)) {
                product.style.display = '';
              } else {
                product.style.display = 'none';
              }
            } else {
              // If unchecked, show all products again
              product.style.display = '';
            }
          }
        });
      });
      return;
    }

    // For standard filters from the sidebar
    const correspondingBaseFilter = sidebarFilters.querySelector(`input[value="${checkbox.name}"]`);
    if (!correspondingBaseFilter) return;

    // Sync checkbox state
    if (correspondingBaseFilter.checked) {
      checkbox.checked = true;
    }

    // Add event listener to trigger base filter clicks
    checkbox.addEventListener('change', (event) => {
      const { name } = event.target;
      const correspondingBaseFilter = sidebarFilters.querySelector(`input[value="${name}"]`);
      if (correspondingBaseFilter) {
        correspondingBaseFilter.click();
      }
    });
  });

  window.addEventListener('scroll', () => {
    const button = document.querySelector('.i-new-facet-filter-controls__dropdown.i-active');
    if (!button) return;
    const dropdownMenu = button.querySelector('.i-new-facet-filter-controls__dropdown-menu');
    const buttonRect = button.getBoundingClientRect();
    const offset = 6;

    dropdownMenu.style.top = `${buttonRect.bottom + offset}px`;
  });

  const existingRemoveFilterButtonsWrapper = document.querySelector('.i-remove-filters');
  const removeFilterButtons = sidebarFilters.querySelectorAll(
    'aside #FacetsWrapperDesktop .active-facets > facet-remove'
  );

  const appendButtons = (wrapper) => {
    [...removeFilterButtons].forEach((button) => {
      if (button.classList.contains('mobile-facets__clear-wrapper, active-facets__button-wrapper')) return;
      wrapper.append(button);

      const buttonInner = button.querySelector('span.active-facets__button-inner');
      const labelText = buttonInner.firstChild;
      labelText.textContent = labelText.textContent.split(':')[1].trim();

      buttonInner.classList.add('i-facet-remove');
    });
  };

  const removeFilterButtonsWrapper =
    existingRemoveFilterButtonsWrapper || stringToHtmlNode('<div class="i-remove-filters"></div>');

  if (!existingRemoveFilterButtonsWrapper) {
    horizontalFacetFilters.prepend(removeFilterButtonsWrapper);
  }

  const isMobile = window.icntxtlftrs && window.icntxtlftrs.D ? window.icntxtlftrs.D === 'P' : false;
  if (isMobile) {
    horizontalFacetFilters.after(removeFilterButtonsWrapper);
  }

  appendButtons(removeFilterButtonsWrapper);

  // Modify price position in product cards
  document.querySelectorAll('.card-wrapper').forEach(card => {
    const reviewPriceWrapper = card.querySelector('.card-information.review-price-wrapper');
    if (reviewPriceWrapper) {
      // If the price-variant-wrapper doesn't exist, create it and move the price elements
      if (!reviewPriceWrapper.querySelector('.price-variant-wrapper')) {
        const priceElements = reviewPriceWrapper.querySelectorAll('.price');
        if (priceElements.length) {
          const priceVariantWrapper = document.createElement('div');
          priceVariantWrapper.className = 'price-variant-wrapper';
          
          priceElements.forEach(price => {
            priceVariantWrapper.appendChild(price.cloneNode(true));
            price.remove();
          });
          
          reviewPriceWrapper.insertBefore(priceVariantWrapper, reviewPriceWrapper.firstChild);
        }
      }
    }
  });
};

// Function to close dropdowns when backdrop is clicked
const closeDropdowns = () => {
  if (activeDropdown) {
    activeDropdown.classList.remove('i-active');
    activeDropdown.querySelector('.i-new-facet-filter-controls__dropdown-menu').style.display = 'none';
    activeDropdown = undefined;
  }

  const backdrop = document.querySelector('.i-dropdown-backdrop');
  if (backdrop) backdrop.classList.remove('i-active');
};

// Initialize the custom facet filters on initial load
applyCustomFacetFilters();

// Add a global backdrop click listener
document.body.insertAdjacentHTML('beforeend', '<div class="i-dropdown-backdrop"></div>');
const backdrop = document.querySelector('.i-dropdown-backdrop');
backdrop.addEventListener('click', closeDropdowns);

// Watch for DOM changes and add new filters again
const observerTarget = document.querySelector('aside');
const observer = new MutationObserver(() => {
  applyCustomFacetFilters();
});
if (observerTarget) {
  observer.observe(observerTarget, { childList: true, subtree: true });
}