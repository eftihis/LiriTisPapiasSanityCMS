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
    
    // Create query based on the document type and template type
    let query;
    
    if (config.template === 'cocktail') {
      // Special query for cocktails including description and flavor tags
      query = encodeURIComponent(`*[_type == "${config.documentType}"] | order(orderRank asc) {
        _id, 
        title,
        price,
        description,
        cocktailTags[]->{ name },
        isNew
      }`);
    } else {
      // Standard query for simple menu items
      query = encodeURIComponent(`*[_type == "${config.documentType}"] | order(orderRank asc) {
        _id, 
        title,
        price
      }`);
    }
    
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
        
        // Choose the appropriate rendering method based on template
        if (config.template === 'cocktail') {
          renderCocktailItems(container, menuItems, config);
        } else {
          renderStandardMenuItems(container, menuItems, config);
        }
        
        console.log(`Successfully loaded ${config.name} data from Sanity`);
      })
      .catch(error => {
        console.error(`Error loading ${config.name} data from Sanity:`, error);
        container.innerHTML = `<div class="error-message">Failed to load ${config.name} menu from Sanity</div>`;
      });
  }
  
  // Function to render standard menu items (coffee, tea, etc.)
  function renderStandardMenuItems(container, menuItems, config) {
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
  }
  
  // Function to render cocktail items with complex structure
  function renderCocktailItems(container, cocktailItems, config) {
    // Create the main grid wrapper
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'w-layout-grid menu-section-wrapper';
    
    // Create the dynamic list container
    const dynList = document.createElement('div');
    dynList.className = 'w-dyn-list';
    
    // Create the collection list for items
    const collectionList = document.createElement('div');
    collectionList.setAttribute('role', 'list');
    collectionList.className = 'collection-list w-dyn-items';
    
    // Add each cocktail from Sanity
    cocktailItems.forEach(cocktail => {
      console.log(`Processing cocktail:`, cocktail);
      
      // Get price and title
      const priceText = typeof cocktail.price === 'number' ? 
        cocktail.price.toFixed(2).replace('.', ',') : '';
      
      let titleText = '';
      if (typeof cocktail.title === 'object' && cocktail.title.en) {
        titleText = cocktail.title.en;
      } else if (typeof cocktail.title === 'string') {
        titleText = cocktail.title;
      } else {
        console.error(`Missing or invalid title for cocktail:`, cocktail);
        return; // Skip this item
      }
      
      // Get description
      let descriptionText = '';
      if (typeof cocktail.description === 'object' && cocktail.description.en) {
        descriptionText = cocktail.description.en;
      } else if (typeof cocktail.description === 'string') {
        descriptionText = cocktail.description;
      }
      
      // Create list item
      const listItem = document.createElement('div');
      listItem.setAttribute('role', 'listitem');
      listItem.className = 'w-dyn-item';
      
      // Create cocktail item wrapper
      const cocktailWrapper = document.createElement('div');
      cocktailWrapper.id = 'w-node-_6fc9b54d-6d10-e16a-9501-92c1f4f9b040-95124043';
      cocktailWrapper.className = 'cocktail-item_wrapper';
      
      // Create title area with grid
      const titleGrid = document.createElement('div');
      titleGrid.className = 'w-layout-grid cocktail-item-tittle';
      
      // Create title element
      const titleElement = document.createElement('div');
      titleElement.id = 'w-node-_41be4b10-f887-8210-43b8-967ceb9acdbf-95124043';
      titleElement.className = 'heading-style-h3';
      titleElement.textContent = titleText;
      
      // Create dots element
      const dotsElement = document.createElement('div');
      dotsElement.id = 'w-node-ec8ddda1-0533-d137-8aba-b0da214cb062-95124043';
      dotsElement.className = 'menu-item-dots';
      
      // Create price element
      const priceElement = document.createElement('div');
      priceElement.className = 'heading-style-h5';
      priceElement.textContent = priceText;
      
      // Add title, dots, and price to the title grid
      titleGrid.appendChild(titleElement);
      titleGrid.appendChild(dotsElement);
      titleGrid.appendChild(priceElement);
      
      // Create description wrapper
      const descriptionWrapper = document.createElement('div');
      descriptionWrapper.className = 'cocktail-description_wrapper';
      
      // Create description element
      const descriptionElement = document.createElement('div');
      descriptionElement.id = 'w-node-_6fc9b54d-6d10-e16a-9501-92c1f4f9b042-95124043';
      descriptionElement.className = 'text-size-medium';
      descriptionElement.textContent = descriptionText;
      
      // Add description to wrapper
      descriptionWrapper.appendChild(descriptionElement);
      
      // Create spacer
      const spacer = document.createElement('div');
      spacer.className = 'spacer-tiny';
      
      // Create bottom area for tags
      const bottomArea = document.createElement('div');
      bottomArea.className = 'cocktail-item_bottom-area';
      
      // Create flavor tags section if available
      if (cocktail.cocktailTags && cocktail.cocktailTags.length > 0) {
        const tagsDynList = document.createElement('div');
        tagsDynList.className = 'w-dyn-list';
        
        const tagsContainer = document.createElement('div');
        tagsContainer.setAttribute('role', 'list');
        tagsContainer.className = 'flavour-tags w-dyn-items';
        
        // Add each flavor tag
        cocktail.cocktailTags.forEach(tag => {
          let tagName = '';
          if (tag.name) {
            tagName = tag.name;
          } else {
            return; // Skip invalid tag
          }
          
          const tagContainer = document.createElement('div');
          tagContainer.setAttribute('role', 'listitem');
          tagContainer.className = 'flavour-tag_container w-dyn-item';
          
          const tagElement = document.createElement('div');
          tagElement.className = 'flavour-tag';
          
          const tagText = document.createElement('div');
          tagText.className = 'text-size-small';
          tagText.textContent = tagName;
          
          tagElement.appendChild(tagText);
          tagContainer.appendChild(tagElement);
          tagsContainer.appendChild(tagContainer);
        });
        
        tagsDynList.appendChild(tagsContainer);
        bottomArea.appendChild(tagsDynList);
      }
      
      // Create the icon element (invisible by default)
      const iconElement = document.createElement('div');
      iconElement.className = 'icon_white w-condition-invisible w-embed';
      iconElement.innerHTML = `<svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.0039 9.414L7.39691 18.021L5.98291 16.607L14.5889 8H7.00391V6H18.0039V17H16.0039V9.414V9.414Z" fill="currentColor"></path>
</svg>`;
      
      bottomArea.appendChild(iconElement);
      
      // Create the link element (invisible by default)
      const linkElement = document.createElement('a');
      linkElement.className = 'cocktail-page_link w-inline-block w-condition-invisible';
      linkElement.href = `/signature-cocktails/${titleText.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Create new cocktail badge if applicable
      const newBadgeWrapper = document.createElement('div');
      newBadgeWrapper.className = cocktail.isNew ? 'new-cocktail_wrapper' : 'new-cocktail_wrapper w-condition-invisible';
      
      const newBadgeText = document.createElement('div');
      newBadgeText.className = 'text-size-tiny';
      newBadgeText.textContent = 'NEW';
      
      newBadgeWrapper.appendChild(newBadgeText);
      
      // Assemble all components
      cocktailWrapper.appendChild(titleGrid);
      cocktailWrapper.appendChild(descriptionWrapper);
      cocktailWrapper.appendChild(spacer);
      cocktailWrapper.appendChild(bottomArea);
      cocktailWrapper.appendChild(linkElement);
      cocktailWrapper.appendChild(newBadgeWrapper);
      
      listItem.appendChild(cocktailWrapper);
      collectionList.appendChild(listItem);
    });
    
    // Assemble the final structure
    dynList.appendChild(collectionList);
    gridWrapper.appendChild(dynList);
    
    if (collectionList.children.length === 0) {
      container.innerHTML = `<div class="error-message">Failed to load ${config.name} menu. No valid items found.</div>`;
      return;
    }
    
    container.innerHTML = '';
    container.appendChild(gridWrapper);
  }
  
  // Define menu sections with their configurations
  const menuConfigs = [
    {
      name: 'coffee',
      selector: '[data-liri-coffee]',
      documentType: 'coffeeItem',
      template: 'standard'
    },
    {
      name: 'tea',
      selector: '[data-liri-tea]',
      documentType: 'teaItem',
      template: 'standard'
    },
    {
      name: 'soft drinks',
      selector: '[data-liri-softdrinks]',
      documentType: 'softDrinkItem',
      template: 'standard'
    },
    {
      name: 'sparkling water',
      selector: '[data-liri-sparklingwater]',
      documentType: 'sparklingWaterItem',
      template: 'standard'
    },
    {
      name: 'juices',
      selector: '[data-liri-juices]',
      documentType: 'juiceItem',
      template: 'standard'
    },
    {
      name: 'signature cocktails',
      selector: '[data-liri-cocktails]',
      documentType: 'signatureCocktailItem',
      template: 'cocktail'
    }
    // Add more menu sections as needed:
    // { name: 'wine', selector: '[data-liri-wine]', documentType: 'wineItem', template: 'standard' }
    // { name: 'spirits', selector: '[data-liri-spirits]', documentType: 'spiritItem', template: 'standard' }
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