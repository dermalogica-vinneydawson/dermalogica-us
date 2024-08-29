// Fetch the JSON data and populate the dropdown
fetch('recycling_data.json')
    .then(response => response.json())
    .then(data => {
        const dropdown = document.getElementById('productDropdown');
        const products = data.products;

        // Populate the dropdown with product titles and sizes
        products.forEach(productType => {
            productType.productExamples.forEach(example => {
                const option = document.createElement('option');

                // Check if size is available, and create the display text accordingly
                const displayText = example.size ? `${example.name} (${example.size})` : example.name;

                // Store product details: type, name, and size
                option.value = JSON.stringify({
                    type: productType.type,
                    name: example.name,
                    size: example.size || '' // Handle undefined size gracefully
                });
                option.text = displayText;
                dropdown.appendChild(option);
            });
        });
    })
    .catch(error => console.error('Error fetching JSON data:', error));

// Function to display recycling info based on selected product
function displayRecyclingInfo() {
    const dropdown = document.getElementById('productDropdown');
    const selectedProduct = JSON.parse(dropdown.value || '{}'); // Get selected product details
    const infoDiv = document.getElementById('recyclingInfo');

    // Clear previous content
    infoDiv.innerHTML = ''; 

    if (selectedProduct.type) {
        // Check if product is curbside recyclable or requires TerraCycle
        if (selectedProduct.recycleAtHome === "Yes" || selectedProduct.type === "Trial + Travel Sizes" || selectedProduct.type === "PET Bottles + Pumps") {
            // Curbside Recyclable Product
            infoDiv.innerHTML = `
                <p><strong>Great news!</strong> Your selected product, ${selectedProduct.name}${selectedProduct.size ? ` - ${selectedProduct.size}` : ''}, is eligible for curbside recycling.</p>
                <p>Simply rinse the container and place it in your regular recycling bin to help reduce waste!</p>
            `;
        } else {
            // TerraCycle® Eligible Product
            infoDiv.innerHTML = `
                <p>Your selected product, ${selectedProduct.name}${selectedProduct.size ? ` - ${selectedProduct.size}` : ''}, requires special recycling through TerraCycle®.</p>
                <p>Please clean the empty container, then click the button below to fill out a shipping form and send it to TerraCycle® for recycling. Together, we can make a difference!</p>
            `;

            // Dynamically create and append the button
            const button = document.createElement('a');
            button.href = "#";
            button.className = 'shipping-button';
            button.innerHTML = `Fill Out Shipping Form
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="#5B6670" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;

            // Append the button to the infoDiv
            infoDiv.appendChild(button);
        }
    } else {
        infoDiv.innerHTML = ''; // Clear previous content if no selection
    }
}
