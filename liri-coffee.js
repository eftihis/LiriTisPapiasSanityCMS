(function() {
  // Configuration for Sanity API
  const projectId = 'ivfy9y3f';
  const dataset = 'production';
  const apiVersion = '2024-03-19';
  
  // Common function to load menu items
  function loadMenuItems(config) {
    const container = document.querySelector(config.selector);
    if (!container) {
      console.error(`${config.name} menu container not found. Add ${config.selector} attribute to your container div.`);
      return;
    }
    
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = `Loading ${config.name} menu...`;
    container.innerHTML = '';
    container.appendChild(loadingIndicator);
    
    // Create query based on the document type
    const query = encodeURIComponent(`*[_type == "${config.documentType}"] | order(orderRank asc) {
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
        console.log(`Sanity ${config.name} data received:`, data);
        const menuItems = data.result || [];
        
        if (!menuItems || menuItems.length === 0) {
          container.innerHTML = `<div class="empty-menu">No ${config.name} items found in Sanity</div>`;
          return;
        }
        
        // Create the grid wrapper to match your structure
        const gridWrapper = document.createElement('div');
        gridWrapper.className = 'w-layout-grid menu-section-wrapper';
        
        // Add each menu item from Sanity
        menuItems.forEach(item => {
          console.log(`Processing ${config.name} item:`, item);
          
          const itemWrapper = document.createElement('div');
          itemWrapper.className = 'menu-item-wrapper';
          
          // Get price directly from the price field
          const priceText = typeof item.price === 'number' ? 
            item.price.toFixed(2).replace('.', ',') : '';
          
          // If price is missing, skip this item
          if (!priceText) {
            console.error(`Missing price for ${config.name} item:`, item);
            return; // Skip this item
          }
          
          const innerGrid = document.createElement('div');
          innerGrid.className = 'w-layout-grid menu-item-tittle';
          
          const titleElement = document.createElement('div');
          // Get title from the object structure
          if (typeof item.title === 'object' && item.title.en) {
            titleElement.textContent = item.title.en;
          } else {
            console.error(`Missing or invalid title for ${config.name} item:`, item);
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
          container.innerHTML = `<div class="error-message">Failed to load ${config.name} menu. No valid items found.</div>`;
          return;
        }
        
        container.innerHTML = '';
        container.appendChild(gridWrapper);
        console.log(`Successfully loaded ${config.name} data from Sanity`);
      })
      .catch(error => {
        console.error(`Error loading ${config.name} data from Sanity:`, error);
        container.innerHTML = `<div class="error-message">Failed to load ${config.name} menu from Sanity</div>`;
      });
  }
  
  // Define menu sections with their configurations
  const menuConfigs = [
    {
      name: 'coffee',
      selector: '[data-liri-coffee]',
      documentType: 'coffeeItem'
    },
    {
      name: 'tea',
      selector: '[data-liri-tea]',
      documentType: 'teaItem'
    },
    {
      name: 'soft drinks',
      selector: '[data-liri-softdrinks]',
      documentType: 'softDrinkItem'
    },
    {
      name: 'sparkling water',
      selector: '[data-liri-sparklingwater]',
      documentType: 'sparklingWaterItem'
    },
    {
      name: 'juices',
      selector: '[data-liri-juices]',
      documentType: 'juiceItem'
    }
    // Add more menu sections as needed:
    // { name: 'wine', selector: '[data-liri-wine]', documentType: 'wineItem' }
    // { name: 'spirits', selector: '[data-liri-spirits]', documentType: 'spiritItem' }
  ];
  
  // Function to initialize all menu sections
  function initializeMenus() {
    menuConfigs.forEach(config => {
      if (document.querySelector(config.selector)) {
        loadMenuItems(config);
      }
    });
  }
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenus);
  } else {
    initializeMenus();
  }

  // Rename the file to liri-menu.js since it now handles multiple menu types
})(); 