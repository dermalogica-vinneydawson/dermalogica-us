// Function to get URL parameters
function getUrlParameter(name) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
}

// Function to create and insert callout element
function insertCallout(text, targetElement, position = 'after', className = '') {
    if (!text || !targetElement) return;
    
    const calloutDiv = document.createElement('div');
    calloutDiv.className = `variant-callout ${className}`;
    calloutDiv.textContent = text;
    
    if (position === 'after') {
        targetElement.parentNode.insertBefore(calloutDiv, targetElement.nextSibling);
    } else {
        targetElement.parentNode.insertBefore(calloutDiv, targetElement);
    }
}

// Main function to handle callouts
function handleVariantCallouts() {
    // Get variant ID from URL
    const variantId = getUrlParameter('variant');
    if (!variantId) return;

    // Fetch the callout data from hosted URL
    fetch('https://cdn.shopify.com/s/files/1/0420/7683/1896/files/Jumbos_Value_and_Savings.json?v=1730746038')
        .then(response => response.json())
        .then(data => {
            // Find the variant data
            const variantData = data.find(item => item['Variant ID'].toString() === variantId);
            if (!variantData) return;

            // Remove any existing callouts before adding new ones
            document.querySelectorAll('.variant-callout').forEach(el => el.remove());

            // Insert value callout if exists
            if (variantData.Value) {
                const priceElement = document.querySelector('.price__container');
                if (priceElement) {
                    insertCallout(
                        `Value: ${variantData.Value}`, 
                        priceElement, 
                        'after', 
                        'value-callout'
                    );
                }
            }

            // Insert savings callout if exists
            if (variantData['Percentage Savings']) {
                const yotpoWidget = document.querySelector('.yotpo-stars-and-sum-reviews');
                if (yotpoWidget) {
                    insertCallout(
                        `Save ${variantData['Percentage Savings']}`, 
                        yotpoWidget, 
                        'after', 
                        'savings-callout'
                    );
                }
            }
        })
        .catch(error => console.error('Error fetching variant data:', error));
}

// Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', handleVariantCallouts);

// Also handle callouts when the variant changes (for dynamic updates)
window.addEventListener('popstate', handleVariantCallouts);
document.addEventListener('variantChanged', handleVariantCallouts); // Custom event if needed
