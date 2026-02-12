# ReCharge Subscribe Swap

This project contains a JavaScript solution to swap the order of the radio options in the ReCharge widget for Webflow, placing the subscription option first and the one-time purchase option second.

## The Problem

In the original ReCharge widget implementation, the radio options are ordered with "One-time purchase" first, followed by "Subscribe & earn points". The desired order is to have the subscription option first, followed by the one-time purchase option.

## The Solution

The `swap-recharge-options.js` script uses vanilla JavaScript to:

1. Find the ReCharge widget container in the DOM
2. Identify the one-time purchase and subscription radio options
3. Remove them from the DOM
4. Reinsert them in the desired order (subscription first, one-time second)

The script includes multiple methods to ensure it works regardless of when the ReCharge widget loads:
- Immediate execution on DOM content loaded
- A mutation observer to detect when the widget is added to the DOM
- A fallback timeout to try again after a short delay

## Implementation

To implement this solution:

1. Add the `swap-recharge-options.js` script (or the minified version `swap-recharge-options.min.js` for production) to your Webflow site:
   - In the Webflow Designer, go to Site Settings > Custom Code
   - Add the script to the Footer Code section
   - Or include it directly on specific pages where the ReCharge widget appears

2. The script will automatically detect and swap the ReCharge subscription options when the page loads.

## Files

- `swap-recharge-options.js` - The main JavaScript solution
- `swap-recharge-options.min.js` - Minified version for production use
- `index.html` - A demo page showing how to include the script
- `original-code.html` - The original ReCharge widget HTML structure
- `desired-code.html` - The desired ReCharge widget HTML structure after swapping

## Performance Considerations

The script is lightweight and only makes DOM modifications when necessary. It includes error handling to prevent issues if the ReCharge widget is not found or has a different structure than expected.

## Compatibility

This solution uses standard DOM manipulation methods that are supported in all modern browsers.

## Webflow Integration

For Webflow sites, you can add the following code to the Footer Code section in Site Settings > Custom Code:

```html
<script>
document.addEventListener("DOMContentLoaded",function(){function e(){const e=document.querySelector(".rc-template__radio");if(!e)return void console.log("ReCharge radio container not found");const t=e.querySelector(".onetime-radio"),r=e.querySelector(".subscription-radio");if(!t||!r)return void console.log("ReCharge radio options not found");const o=e.querySelector(".rc-selling-plans");o?(t.remove(),r.remove(),o.remove(),e.appendChild(r),e.appendChild(o),e.appendChild(t),console.log("ReCharge options swapped successfully")):console.log("ReCharge selling plans not found")}e();const t=new MutationObserver(function(t){t.forEach(function(t){t.addedNodes&&t.addedNodes.length>0&&document.querySelector(".rc-template__radio")&&e()})});t.observe(document.body,{childList:!0,subtree:!0}),setTimeout(e,1e3)});
</script>
``` 