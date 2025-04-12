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
    } else if (config.template === 'regularCocktail') {
      // Special query for regular cocktails including category and optional description
      query = encodeURIComponent(`*[_type == "${config.documentType}"] | order(orderRank asc) {
        _id, 
        title,
        price,
        description,
        category
      }`);
    } else if (config.template === 'wine') {
      // Special query for wines including subcategory, glass/bottle prices, and grape varieties
      query = encodeURIComponent(`*[_type == "${config.documentType}"] | order(orderRank asc) {
        _id, 
        title,
        description,
        grapeVarieties,
        subCategory,
        glassPrice,
        bottlePrice
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
        } else if (config.template === 'regularCocktail') {
          renderRegularCocktailItems(container, menuItems, config);
        } else if (config.template === 'wine') {
          renderWineItems(container, menuItems, config);
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

  // Function to render regular cocktails by categories
  function renderRegularCocktailItems(container, cocktailItems, config) {
    console.log("Starting to render regular cocktail items", cocktailItems);
    
    // More verbose debugging
    console.log("All data attributes on the page:");
    try {
      // This syntax for selecting attributes with wildcard isn't widely supported,
      // so let's use a different approach
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const liriAttrs = Array.from(el.attributes)
          .filter(attr => attr.name.startsWith('data-liri-'))
          .map(attr => attr.name);
        
        if (liriAttrs.length > 0) {
          console.log(`Element: ${el.tagName}, Attributes: ${liriAttrs.join(', ')}`);
        }
      }
    } catch (error) {
      console.error("Error selecting elements:", error);
    }
    
    // Log all matching data-* elements for debugging
    console.log("Available data containers for cocktails specifically:");
    document.querySelectorAll('[data-liri-classics], [data-liri-g-and-t], [data-liri-spritz], [data-liri-tropical-touch], [data-liri-regular-cocktails]').forEach(el => {
      console.log(`Found element with attribute: ${Array.from(el.attributes).filter(attr => attr.name.startsWith('data-liri')).map(attr => attr.name).join(', ')}`);
    });
    
    // Group cocktails by category
    const categorizedCocktails = {};
    
    // Define expected categories in the order they should appear
    const categoryOrder = ['classics', 'g_and_t', 'spritz', 'tropical_touch'];
    const categoryLabels = {
      'classics': 'Classics',
      'g_and_t': 'G&T',
      'spritz': 'Spritz',
      'tropical_touch': 'Tropical Touch'
    };
    
    // Initialize categories
    categoryOrder.forEach(category => {
      categorizedCocktails[category] = [];
    });
    
    // Group cocktails by their category
    cocktailItems.forEach(cocktail => {
      const category = cocktail.category;
      if (category && categorizedCocktails.hasOwnProperty(category)) {
        categorizedCocktails[category].push(cocktail);
        console.log(`Added cocktail to category ${category}:`, cocktail.title);
      } else {
        console.warn(`Cocktail has unknown category: ${category}`, cocktail);
      }
    });
    
    // Clear the container - but also render something in it to show it's working
    container.innerHTML = '';
    
    // Check if we have any cocktails
    let totalCocktails = 0;
    for (const category in categorizedCocktails) {
      const count = categorizedCocktails[category].length;
      totalCocktails += count;
      console.log(`Category ${category} has ${count} cocktails`);
    }
    
    if (totalCocktails === 0) {
      container.innerHTML = `<div class="empty-menu">No ${config.name} items found in Sanity</div>`;
      return;
    }
    
    // Create containers for each category section in the defined order
    categoryOrder.forEach(category => {
      const cocktails = categorizedCocktails[category];
      if (cocktails.length === 0) return; // Skip empty categories
      
      // Find the container for this category
      // The data attributes in HTML have dashes, not underscores
      let categorySelector;
      if (category === 'g_and_t') {
        categorySelector = '[data-liri-g-and-t]'; // Special case for G&T
      } else {
        categorySelector = `[data-liri-${category.replace(/_/g, '-')}]`;
      }
      
      const categoryContainer = document.querySelector(categorySelector);
      
      if (!categoryContainer) {
        console.warn(`Container for category ${category} not found with selector ${categorySelector}`);
        return;
      }
      
      // Create the grid wrapper for this category
      const gridWrapper = document.createElement('div');
      gridWrapper.className = 'w-layout-grid accordion-content';
      gridWrapper.style.width = '522.5px';
      
      // Add top spacer
      const topSpacer = document.createElement('div');
      topSpacer.className = 'spacer-small';
      gridWrapper.appendChild(topSpacer);
      
      // Add each cocktail in this category
      cocktails.forEach(cocktail => {
        const itemWrapper = document.createElement('div');
        itemWrapper.id = `w-node-${generateRandomId()}`;
        itemWrapper.className = 'menu-item-wrapper';
        
        // Create title bar with dots and price
        const titleGrid = document.createElement('div');
        titleGrid.className = 'w-layout-grid menu-item-tittle';
        
        // Create title element
        const titleElement = document.createElement('div');
        titleElement.id = `w-node-${generateRandomId()}`;
        if (typeof cocktail.title === 'object' && cocktail.title.en) {
          titleElement.textContent = cocktail.title.en;
        } else if (typeof cocktail.title === 'string') {
          titleElement.textContent = cocktail.title;
        } else {
          console.warn('Invalid cocktail title', cocktail);
          return; // Skip this item
        }
        
        // Create dots element
        const dotsElement = document.createElement('div');
        dotsElement.id = `w-node-${generateRandomId()}`;
        dotsElement.className = 'menu-item-dots';
        
        // Create price element
        const priceElement = document.createElement('div');
        priceElement.id = `w-node-${generateRandomId()}`;
        const priceText = typeof cocktail.price === 'number' ? 
          cocktail.price.toFixed(2).replace('.', ',') : '';
        priceElement.textContent = priceText;
        
        // Add components to title grid
        titleGrid.appendChild(titleElement);
        titleGrid.appendChild(dotsElement);
        titleGrid.appendChild(priceElement);
        itemWrapper.appendChild(titleGrid);
        
        // Add description if available
        if (cocktail.description) {
          const descriptionElement = document.createElement('div');
          descriptionElement.className = 'menu-item-description';
          
          if (typeof cocktail.description === 'object' && cocktail.description.en) {
            descriptionElement.textContent = cocktail.description.en;
          } else if (typeof cocktail.description === 'string') {
            descriptionElement.textContent = cocktail.description;
          }
          
          itemWrapper.appendChild(descriptionElement);
        }
        
        gridWrapper.appendChild(itemWrapper);
      });
      
      // Add bottom spacer
      const bottomSpacer = document.createElement('div');
      bottomSpacer.className = 'spacer-small';
      gridWrapper.appendChild(bottomSpacer);
      
      // Add the grid to the category container
      categoryContainer.innerHTML = '';
      categoryContainer.appendChild(gridWrapper);
    });
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
  
  // Function to render wine items
  function renderWineItems(container, wineItems, config) {
    console.log("Starting to render wine items", wineItems);
    
    // Group wines by their subcategory
    const categorizedWines = {};
    
    // Define expected categories in the order they should appear
    const categoryOrder = ['red-wine', 'white-wine', 'rose-wine', 'sparkling-wine'];
    const categoryLabels = {
      'red-wine': 'Red Wine',
      'white-wine': 'White Wine',
      'rose-wine': 'Rosé Wine',
      'sparkling-wine': 'Sparkling Wine'
    };
    
    // Initialize categories
    categoryOrder.forEach(category => {
      categorizedWines[category] = [];
    });
    
    // Group wines by their subcategory
    wineItems.forEach(wine => {
      const category = wine.subCategory;
      if (category && categorizedWines.hasOwnProperty(category)) {
        categorizedWines[category].push(wine);
        console.log(`Added wine to category ${category}:`, wine.title);
      } else {
        console.warn(`Wine has unknown category: ${category}`, wine);
      }
    });
    
    // Clear the container
    container.innerHTML = '';
    
    // Check if we have any wines
    let totalWines = 0;
    for (const category in categorizedWines) {
      const count = categorizedWines[category].length;
      totalWines += count;
      console.log(`Category ${category} has ${count} wines`);
    }
    
    if (totalWines === 0) {
      container.innerHTML = `<div class="empty-menu">No ${config.name} items found in Sanity</div>`;
      return;
    }
    
    // Create containers for each category section in the defined order
    categoryOrder.forEach(category => {
      const wines = categorizedWines[category];
      if (wines.length === 0) return; // Skip empty categories
      
      // Find the container for this category
      const categorySelector = `[data-liri-${category}]`;
      const categoryContainer = document.querySelector(categorySelector);
      
      if (!categoryContainer) {
        console.warn(`Container for wine category ${category} not found with selector ${categorySelector}`);
        return;
      }
      
      // Create the grid wrapper for this category
      const gridWrapper = document.createElement('div');
      gridWrapper.className = 'w-layout-grid menu-section-wrapper';
      
      // Add each wine in this category
      wines.forEach(wine => {
        const itemWrapper = document.createElement('div');
        itemWrapper.id = `w-node-${generateRandomId()}`;
        itemWrapper.className = 'menu-item-wrapper';
        
        // Create title bar with dots and price
        const titleGrid = document.createElement('div');
        titleGrid.className = 'w-layout-grid menu-item-tittle';
        
        // Create title element
        const titleElement = document.createElement('div');
        titleElement.id = `w-node-${generateRandomId()}`;
        if (typeof wine.title === 'object' && wine.title.en) {
          titleElement.textContent = wine.title.en;
        } else if (typeof wine.title === 'string') {
          titleElement.textContent = wine.title;
        } else {
          console.warn('Invalid wine title', wine);
          return; // Skip this item
        }
        
        // Create dots element
        const dotsElement = document.createElement('div');
        dotsElement.id = `w-node-${generateRandomId()}`;
        dotsElement.className = 'menu-item-dots';
        
        // Create price element with glass and optional bottle price
        const priceElement = document.createElement('div');
        priceElement.id = `w-node-${generateRandomId()}`;
        
        // Format glass price
        const glassPrice = typeof wine.glassPrice === 'number' ? 
          wine.glassPrice.toFixed(2).replace('.', ',') : '';
        
        // Format bottle price if it exists
        const bottlePrice = typeof wine.bottlePrice === 'number' ? 
          wine.bottlePrice.toFixed(2).replace('.', ',') : '';
        
        // Combine prices for display
        if (glassPrice && bottlePrice) {
          priceElement.textContent = `${glassPrice} / ${bottlePrice}`;
        } else if (glassPrice) {
          priceElement.textContent = glassPrice;
        } else {
          console.warn('Missing price for wine item:', wine);
          return; // Skip this item
        }
        
        // Add components to title grid
        titleGrid.appendChild(titleElement);
        titleGrid.appendChild(dotsElement);
        titleGrid.appendChild(priceElement);
        itemWrapper.appendChild(titleGrid);
        
        // Add description and grape varieties if available
        if (wine.description || wine.grapeVarieties) {
          const descriptionElement = document.createElement('div');
          descriptionElement.className = 'menu-item-description';
          
          // Add description text
          let descriptionText = '';
          if (wine.description && typeof wine.description === 'object' && wine.description.en) {
            descriptionText = wine.description.en;
          }
          
          // Add grape varieties in parentheses with special span
          let grapeVarietiesText = '';
          if (wine.grapeVarieties && typeof wine.grapeVarieties === 'object' && wine.grapeVarieties.en) {
            const grapeVarietiesSpan = document.createElement('span');
            grapeVarietiesSpan.className = 'grape_variety';
            grapeVarietiesSpan.textContent = `(${wine.grapeVarieties.en})`;
            
            if (descriptionText) {
              descriptionText += ' ';
              descriptionElement.textContent = descriptionText;
              descriptionElement.appendChild(grapeVarietiesSpan);
            } else {
              descriptionElement.appendChild(grapeVarietiesSpan);
            }
          } else {
            descriptionElement.textContent = descriptionText;
          }
          
          itemWrapper.appendChild(descriptionElement);
        }
        
        gridWrapper.appendChild(itemWrapper);
      });
      
      // Add the grid to the category container
      categoryContainer.innerHTML = '';
      categoryContainer.appendChild(gridWrapper);
    });
  }
  
  // Helper function to generate random IDs for w-node elements
  function generateRandomId() {
    return Array.from({ length: 24 }, () => 
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join('');
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
    },
    {
      name: 'regular cocktails',
      selector: '[data-liri-regular-cocktails]',
      documentType: 'regularCocktailItem',
      template: 'regularCocktail'
    },
    {
      name: 'wine',
      selector: '[data-liri-wine]',
      documentType: 'wineItem',
      template: 'wine'
    }
    // Add more menu sections as needed:
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