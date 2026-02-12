# Webflow Optimize A/B Test Instructions

## Test Setup

1. Log in to your Webflow dashboard and navigate to the Webflow Optimize section.
2. Create a new A/B test.
3. Name your test (e.g., "ReCharge Subscribe Option Order Test").
4. Select the pages where the ReCharge widget appears (typically product pages).

## Variant Setup

1. Create a new variant.
2. Name your variant (e.g., "Subscription First").
3. In the variant editor, add a Custom Code block.
4. Paste the following JavaScript code into the Custom Code block:

```javascript
(function(){function e(){const e=document.querySelector(".rc-template__radio");if(!e)return void console.log("ReCharge radio container not found");const t=e.querySelector(".onetime-radio"),n=e.querySelector(".subscription-radio");if(!t||!n)return void console.log("ReCharge radio options not found");const o=e.querySelector(".rc-selling-plans");o?(t.remove(),n.remove(),o.remove(),e.appendChild(n),e.appendChild(o),e.appendChild(t),console.log("ReCharge options swapped successfully")):console.log("ReCharge selling plans not found")}function t(){e();const t=new MutationObserver(function(t){t.forEach(function(t){t.addedNodes&&t.addedNodes.length>0&&document.querySelector(".rc-template__radio")&&e()})});t.observe(document.body,{childList:!0,subtree:!0}),setTimeout(e,1e3)}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t):t()})();
```

5. Set the placement to "Head" to ensure the script loads as early as possible.

## Test Goals

When setting up your test goals, consider tracking:

1. **Primary Goal**: Conversion rate (purchases)
2. **Secondary Goals**:
   - Subscription selection rate
   - Add to cart rate
   - Revenue per visitor

## Test Duration

Allow the test to run for at least 2-4 weeks to gather sufficient data, especially if your site has moderate traffic. For high-traffic sites, 1-2 weeks may be sufficient.

## Monitoring

Monitor the following during the test:

1. Check that the script is working correctly by visiting your product pages and verifying that the subscription option appears first in the variant.
2. Monitor for any JavaScript errors in the browser console that might be related to the script.
3. Track the conversion metrics to see if the variant is performing better than the control.

## After the Test

If the variant performs better:

1. Implement the change permanently by adding the script to your site's custom code section.
2. Consider further optimizations based on the data collected.

## Troubleshooting

If the script doesn't work as expected:

1. Check if the ReCharge widget has changed its HTML structure.
2. Verify that the script is loading before the ReCharge widget.
3. Check for JavaScript errors in the browser console.
4. Ensure there are no conflicts with other scripts on the page.

## Code Explanation

The script works by:

1. Finding the ReCharge widget container in the DOM
2. Identifying the one-time purchase and subscription radio options
3. Removing them from the DOM
4. Reinserting them in the desired order (subscription first, one-time second)

The script includes multiple methods to ensure it works regardless of when the ReCharge widget loads. 