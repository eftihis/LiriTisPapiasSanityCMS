(function() {
  // Configuration for Sanity API
  const projectId = 'ivfy9y3f';
  const dataset = 'production';
  const apiVersion = '2024-03-19';
  
  // Load coffee menu using Sanity GROQ API endpoint (CORS-friendly)
  function loadCoffeeMenu() {
    const container = document.querySelector('[data-liri-coffee]');
    if (!container) {
      console.error('Coffee menu container not found. Add data-liri-coffee attribute to your container div.');
      return;
    }
    
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Loading coffee menu...';
    container.innerHTML = '';
    container.appendChild(loadingIndicator);
    
    // Based on your actual schema, use the correct query
    // coffeeItem schema has a direct price field, not prices array
    const query = encodeURIComponent(`*[_type == "coffeeItem"] | order(orderRank asc) {
      _id, 
      title,
      price
    }`);
    
    // Use the CORS-enabled API endpoint
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;
    
    // Fetch data using standard fetch API
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Sanity data received:', data);
        const coffeeItems = data.result || [];
        
        if (!coffeeItems || coffeeItems.length === 0) {
          container.innerHTML = '<div class="empty-menu">No coffee items found in Sanity</div>';
          return;
        }
        
        // Create the grid wrapper to match your structure
        const gridWrapper = document.createElement('div');
        gridWrapper.className = 'w-layout-grid menu-section-wrapper';
        
        // Add each coffee item from Sanity
        coffeeItems.forEach(item => {
          console.log('Processing coffee item:', item);
          
          const itemWrapper = document.createElement('div');
          itemWrapper.className = 'menu-item-wrapper';
          
          // Get price directly from the price field
          const priceText = typeof item.price === 'number' ? 
            item.price.toFixed(2).replace('.', ',') : '';
          
          // If price is missing, skip this item or show error
          if (!priceText) {
            console.error('Missing price for item:', item);
            return; // Skip this item
          }
          
          const innerGrid = document.createElement('div');
          innerGrid.className = 'w-layout-grid menu-item-tittle';
          
          const titleElement = document.createElement('div');
          // Get title from the object structure
          if (typeof item.title === 'object' && item.title.en) {
            titleElement.textContent = item.title.en;
          } else {
            console.error('Missing or invalid title for item:', item);
            return; // Skip this item
          }
          
          const dotsElement = document.createElement('div');
          dotsElement.className = 'menu-item-dots';
          
          const priceElement = document.createElement('div');
          priceElement.textContent = priceText;
          
          innerGrid.appendChild(titleElement);
          innerGrid.appendChild(dotsElement);
          innerGrid.appendChild(priceElement);
          
          itemWrapper.appendChild(innerGrid);
          gridWrapper.appendChild(itemWrapper);
        });
        
        if (gridWrapper.children.length === 0) {
          container.innerHTML = '<div class="error-message">Failed to load coffee menu. No valid items found.</div>';
          return;
        }
        
        container.innerHTML = '';
        container.appendChild(gridWrapper);
        console.log('Successfully loaded coffee data from Sanity');
      })
      .catch(error => {
        console.error('Error loading coffee data from Sanity:', error);
        container.innerHTML = '<div class="error-message">Failed to load coffee menu from Sanity</div>';
      });
  }
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCoffeeMenu);
  } else {
    loadCoffeeMenu();
  }
})(); 