(function() {
  // Configuration for Sanity API
  const projectId = 'ivfy9y3f';
  const dataset = 'production';
  const apiVersion = '2024-03-19';
  
  // Cache configuration
  const CACHE_ENABLED = true;
  const CACHE_EXPIRATION = 3600000; // Cache expiration in milliseconds (1 hour)
  const CACHE_VERSION = '1.0'; // Used to invalidate cache when the structure changes
  
  // Cache helper functions
  function getCacheKey(documentType) {
    return `liri-menu-${CACHE_VERSION}-${documentType}`;
  }
  
  function saveToCache(documentType, data) {
    if (!CACHE_ENABLED) return;
    try {
      const cacheItem = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(getCacheKey(documentType), JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  }
  
  function getFromCache(documentType) {
    if (!CACHE_ENABLED) return null;
    try {
      const cacheItem = localStorage.getItem(getCacheKey(documentType));
      if (!cacheItem) return null;
      
      const parsedItem = JSON.parse(cacheItem);
      const now = Date.now();
      
      // Check if cache is expired
      if (now - parsedItem.timestamp > CACHE_EXPIRATION) {
        localStorage.removeItem(getCacheKey(documentType));
        return null;
      }
      
      return parsedItem.data;
    } catch (error) {
      console.warn('Failed to retrieve from cache:', error);
      return null;
    }
  }
  
  // Create a function for the enhanced loading indicator
  function createLoadingIndicator(name) {
    // Create main container
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-indicator flex flex-col items-center justify-center p-6 w-full';
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'h-10 w-10 rounded-full border-4 border-solid border-gray-300 border-t-primary animate-spin mb-4';
    
    // Create text
    const loadingText = document.createElement('div');
    loadingText.className = 'text-gray-700 font-medium text-center';
    loadingText.textContent = `Loading ${name} menu...`;
    
    // Assemble the loading indicator
    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(loadingText);
    
    return loadingContainer;
  }

  // Create a function for error messages
  function createErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message p-4 rounded-md bg-destructive/10 border border-destructive text-destructive text-center';
    errorContainer.textContent = message;
    return errorContainer;
  }

  // Create a function for empty menu messages
  function createEmptyMessage(name) {
    const emptyContainer = document.createElement('div');
    emptyContainer.className = 'empty-menu p-4 rounded-md bg-muted text-muted-foreground text-center';
    emptyContainer.textContent = `No ${name} items available at the moment`;
    return emptyContainer;
  }
  
  // Common function to load menu items
  function loadMenuItems(config) {
    const container = document.querySelector(config.selector);
    if (!container) {
      console.error(`${config.name} menu container not found. Add ${config.selector} attribute to your container div.`);
      return;
    }
    
    // Show loading indicator
    container.innerHTML = '';
    container.appendChild(createLoadingIndicator(config.name));
    
    // Check cache first
    const cachedData = getFromCache(config.documentType);
    if (cachedData) {
      processMenuData(cachedData, container, config);
      return;
    }
    
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
    } else if (config.template === 'beer') {
      // Special query for beers including type and optional description
      query = encodeURIComponent(`*[_type == "${config.documentType}"] | order(orderRank asc) {
        _id, 
        title,
        price,
        description,
        beerType,
        size
      }`);
    } else if (config.template === 'spirit') {
      // Special query for spirits including subcategory, variants, and description
      query = encodeURIComponent(`*[_type == "${config.documentType}"] | order(orderRank asc) {
        _id, 
        title,
        description,
        subCategory,
        variants[] {
          _key,
          size,
          price
        },
        orderRank
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
        
        // Save to cache for future use
        saveToCache(config.documentType, data);
        
        // Process the data
        processMenuData(data, container, config);
      })
      .catch(error => {
        console.error(`Error loading ${config.name} data from Sanity:`, error);
        container.innerHTML = createErrorMessage(`Failed to load ${config.name} menu from Sanity`);
      });
  }
  
  // Process and render menu data
  function processMenuData(data, container, config) {
    const menuItems = data.result || [];
    
    if (!menuItems || menuItems.length === 0) {
      container.innerHTML = createEmptyMessage(config.name);
      return;
    }
    
    // Choose the appropriate rendering method based on template
    if (config.template === 'cocktail') {
      renderCocktailItems(container, menuItems, config);
    } else if (config.template === 'regularCocktail') {
      renderRegularCocktailItems(container, menuItems, config);
    } else if (config.template === 'wine') {
      renderWineItems(container, menuItems, config);
    } else if (config.template === 'beer') {
      renderBeerItems(container, menuItems, config);
    } else if (config.template === 'spirit') {
      renderSpiritItems(container, menuItems, config);
    } else {
      renderStandardMenuItems(container, menuItems, config);
    }
    
    console.log(`Successfully rendered ${config.name} data`);
  }
  
  // Function to render standard menu items (coffee, tea, etc.)
  function renderStandardMenuItems(container, menuItems, config) {
    // Show loading indicator while preparing the grid
    container.innerHTML = '';
    container.appendChild(createLoadingIndicator(config.name));
    
    // Create the grid wrapper to match your structure
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'w-layout-grid menu-section-wrapper';
    
    // Add each menu item from Sanity
    menuItems.forEach(item => {
      console.log(`Processing ${config.name} item:`, item);
      
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'menu-item-wrapper';
      
      const priceText = typeof item.price === 'number' ? 
        item.price.toFixed(2).replace('.', ',') : '';
      
      if (!priceText) {
        console.error(`Missing price for ${config.name} item:`, item);
        return;
      }
      
      const innerGrid = document.createElement('div');
      innerGrid.className = 'w-layout-grid menu-item-tittle';
      
      const titleElement = document.createElement('div');
      if (typeof item.title === 'object' && item.title.en) {
        titleElement.textContent = item.title.en;
      } else {
        console.error(`Missing or invalid title for ${config.name} item:`, item);
        return;
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
      container.innerHTML = '';
      container.appendChild(createEmptyMessage(config.name));
      return;
    }
    
    // Replace loading indicator with the actual content
    container.innerHTML = '';
    container.appendChild(gridWrapper);
  }

  // Function to render regular cocktails by categories
  function renderRegularCocktailItems(container, cocktailItems, config) {
    container.innerHTML = '';
    container.appendChild(createLoadingIndicator(config.name));
    
    const categorizedCocktails = {};
    
    const categoryOrder = ['classics', 'g_and_t', 'spritz', 'tropical_touch'];
    const categoryLabels = {
      'classics': 'Classics',
      'g_and_t': 'G&T',
      'spritz': 'Spritz',
      'tropical_touch': 'Tropical Touch'
    };
    
    categoryOrder.forEach(category => {
      categorizedCocktails[category] = [];
    });
    
    cocktailItems.forEach(cocktail => {
      const category = cocktail.category;
      if (category && categorizedCocktails.hasOwnProperty(category)) {
        categorizedCocktails[category].push(cocktail);
      } else {
        console.warn(`Cocktail has unknown category: ${category}`, cocktail);
      }
    });
    
    // Check if we have any cocktails
    let totalCocktails = 0;
    for (const category in categorizedCocktails) {
      const count = categorizedCocktails[category].length;
      totalCocktails += count;
      console.log(`Category ${category} has ${count} cocktails`);
    }
    
    if (totalCocktails === 0) {
      container.innerHTML = '';
      container.appendChild(createEmptyMessage(config.name));
      return;
    }
    
    // Clear the main container since we'll be populating individual category containers
    container.innerHTML = '';
    
    // Create containers for each category in the defined order
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
      
      // Show loading indicator in the category container
      categoryContainer.innerHTML = '';
      categoryContainer.appendChild(createLoadingIndicator(categoryLabels[category]));
      
      // Create the grid wrapper for this category
      const gridWrapper = document.createElement('div');
      gridWrapper.className = 'w-layout-grid accordion-content';
      gridWrapper.style.width = '100%';
      
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
        priceElement.textContent = typeof cocktail.price === 'number' ? 
          cocktail.price.toFixed(2).replace('.', ',') : '';
        
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
      
      // Replace loading indicator with the actual content
      // Add the grid to the category container
      categoryContainer.innerHTML = '';
      categoryContainer.appendChild(gridWrapper);
    });
  }
  
  // Function to render cocktail items with complex structure
  function renderCocktailItems(container, cocktailItems, config) {
    // Show loading indicator in the container
    container.innerHTML = '';
    container.appendChild(createLoadingIndicator(config.name));
    
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
      container.innerHTML = '';
      container.appendChild(createEmptyMessage(config.name));
      return;
    }
    
    // Replace loading indicator with the actual content
    container.innerHTML = '';
    container.appendChild(gridWrapper);
  }
  
  // Function to render wine items
  function renderWineItems(container, wineItems, config) {
    container.innerHTML = '';
    container.appendChild(createLoadingIndicator(config.name));
    
    let foundWineContainers = false;
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const liriAttrs = Array.from(el.attributes || [])
        .filter(attr => attr.name && attr.name.toLowerCase().startsWith('data-liri-') && 
                (attr.name.toLowerCase().includes('wine') || attr.name.toLowerCase().includes('red-wine') || 
                 attr.name.toLowerCase().includes('white-wine') || attr.name.toLowerCase().includes('rose-wine') || 
                 attr.name.toLowerCase().includes('sparkling-wine')))
        .map(attr => attr.name);
      
      if (liriAttrs.length > 0) {
        foundWineContainers = true;
      }
    }
    
    if (!foundWineContainers) {
      console.error("NO WINE CONTAINERS FOUND - check HTML for correct data-liri-* attributes");
    }
    
    // Group wines by their subcategory
    const categorizedWines = {};
    
    // Define expected categories in the order they should appear
    const categoryOrder = ['sparkling-wine', 'white-wine', 'rose-wine', 'red-wine'];
    const categoryLabels = {
      'sparkling-wine': 'Sparkling Wine',
      'white-wine': 'White Wine',
      'rose-wine': 'Rosé Wine',
      'red-wine': 'Red Wine'
    };
    
    // Also check for possible case variants of these categories in the HTML
    console.log("Checking for case variants of wine category attributes:");
    categoryOrder.forEach(category => {
      const variants = [
        `data-liri-${category}`,
        `data-liri-${category.toUpperCase()}`,
        `data-liri-${category.toLowerCase()}`,
        `data-liri-${category.replace(/-/g, '_')}`
      ];
      
      variants.forEach(variant => {
        const elements = document.querySelectorAll(`[${variant}]`);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with attribute ${variant}`);
        }
      });
    });
    
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
    
    // Check if we have any wines
    let totalWines = 0;
    for (const category in categorizedWines) {
      const count = categorizedWines[category].length;
      totalWines += count;
      console.log(`Category ${category} has ${count} wines`);
    }
    
    if (totalWines === 0) {
      container.innerHTML = '';
      container.appendChild(createEmptyMessage(config.name));
      return;
    }
    
    // Special handling - if no category containers exist, create them in the main container
    let needToCreateCategoryContainers = true;
    
    // Check if any category containers actually exist
    for (const category of categoryOrder) {
      const selector = `[data-liri-${category}]`;
      if (document.querySelector(selector)) {
        needToCreateCategoryContainers = false;
        break;
      }
    }
    
    // If no category containers exist, we'll create them all in the main container
    if (needToCreateCategoryContainers) {
      console.log("No wine category containers found - creating them in the main container");
      
      // Clear the main container
      container.innerHTML = '';
      
      // Create a grid for all wine categories
      const mainGrid = document.createElement('div');
      mainGrid.className = 'w-layout-grid _2col_grid';
      container.appendChild(mainGrid);
      
      // Create containers for each category
      categoryOrder.forEach(category => {
        const wines = categorizedWines[category];
        if (wines.length === 0) return; // Skip empty categories
        
        // Section wrapper
        const sectionWrapper = document.createElement('div');
        sectionWrapper.className = 'menu-section-wrapper';
        
        // Title wrapper
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'menu-section-tittle-wrapper';
        
        // Title text
        const titleText = document.createElement('div');
        titleText.className = 'text-block';
        titleText.textContent = categoryLabels[category];
        titleWrapper.appendChild(titleText);
        
        // Category container with data attribute
        const categoryContainer = document.createElement('div');
        categoryContainer.setAttribute(`data-liri-${category}`, '');
        
        // Show loading indicator in the category container
        categoryContainer.appendChild(createLoadingIndicator(categoryLabels[category]));
        
        // Add to section
        sectionWrapper.appendChild(titleWrapper);
        sectionWrapper.appendChild(categoryContainer);
        
        // Add to main grid
        mainGrid.appendChild(sectionWrapper);
        
        // Now populate this category container
        populateWineCategory(categoryContainer, wines, category);
      });
      
      return; // We've handled everything in this case
    }
    
    // Clear the main container since we'll populate individual category containers
    container.innerHTML = '';
    
    // Original flow - categories exist, populate them
    categoryOrder.forEach(category => {
      const wines = categorizedWines[category];
      if (wines.length === 0) return; // Skip empty categories
      
      // Find the container for this category
      const categorySelector = `[data-liri-${category}]`;
      let categoryContainer = document.querySelector(categorySelector);
      
      // Try different selector variations if needed
      if (!categoryContainer) {
        console.warn(`Container for wine category ${category} not found with selector ${categorySelector}, trying alternative selector`);
        
        // Try alternatives - either the attribute might be empty or might have a value
        const alternativeSelectors = [
          `[data-liri-${category}=""]`,  // Empty value
          `div[data-liri-${category}]`,  // Specifically a div
          `*[data-liri-${category}]`     // Any element with wildcard
        ];
        
        for (const altSelector of alternativeSelectors) {
          const altContainer = document.querySelector(altSelector);
          if (altContainer) {
            console.log(`Found container with alternative selector: ${altSelector}`);
            categoryContainer = altContainer;
            break;
          }
        }
      }
      
      if (!categoryContainer) {
        console.warn(`Container for wine category ${category} not found with any selector, skipping this category`);
        return;
      }
      
      // Populate this category
      populateWineCategory(categoryContainer, wines, category);
    });
    
    // Helper function to populate a single wine category
    function populateWineCategory(categoryContainer, wines, category) {
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
      
      // Replace loading indicator with the actual content
      categoryContainer.innerHTML = '';
      categoryContainer.appendChild(gridWrapper);
    }
  }
  
  // Function to render beer items by type
  function renderBeerItems(container, beerItems, config) {
    container.innerHTML = '';
    container.appendChild(createLoadingIndicator(config.name));
    
    let foundBeerContainers = false;
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const liriAttrs = Array.from(el.attributes || [])
        .filter(attr => attr.name && attr.name.toLowerCase().startsWith('data-liri-') && 
                (attr.name.toLowerCase().includes('beer') || attr.name.toLowerCase().includes('beer-local') || 
                 attr.name.toLowerCase().includes('beer-imported')))
        .map(attr => attr.name);
      
      if (liriAttrs.length > 0) {
        foundBeerContainers = true;
      }
    }
    
    if (!foundBeerContainers) {
      console.error("NO BEER CONTAINERS FOUND - check HTML for correct data-liri-* attributes");
    }
    
    // Group beers by their beerType
    const categorizedBeers = {};
    
    // Define expected categories in the order they should appear
    const categoryOrder = ['local', 'imported'];
    const categoryLabels = {
      'local': 'Greek Microbreweries',
      'imported': 'Imported Beers'
    };
    
    // Initialize categories
    categoryOrder.forEach(category => {
      categorizedBeers[category] = [];
    });
    
    // Group beers by their type
    beerItems.forEach(beer => {
      const category = beer.beerType;
      if (category && categorizedBeers.hasOwnProperty(category)) {
        categorizedBeers[category].push(beer);
        console.log(`Added beer to category ${category}:`, beer.title);
      } else {
        console.warn(`Beer has unknown category: ${category}`, beer);
      }
    });
    
    // Check if we have any beers
    let totalBeers = 0;
    for (const category in categorizedBeers) {
      const count = categorizedBeers[category].length;
      totalBeers += count;
      console.log(`Category ${category} has ${count} beers`);
    }
    
    if (totalBeers === 0) {
      container.innerHTML = '';
      container.appendChild(createEmptyMessage(config.name));
      return;
    }
    
    // Special handling - if no category containers exist, create them in the main container
    let needToCreateCategoryContainers = true;
    
    // Check if any category containers actually exist
    for (const category of categoryOrder) {
      const selector = `[data-liri-beer-${category}]`;
      if (document.querySelector(selector)) {
        needToCreateCategoryContainers = false;
        break;
      }
    }
    
    // If no category containers exist, we'll create them all in the main container
    if (needToCreateCategoryContainers) {
      console.log("No beer category containers found - creating them in the main container");
      
      // Clear the main container
      container.innerHTML = '';
      
      // Create a grid for all beer categories
      const mainGrid = document.createElement('div');
      mainGrid.className = 'w-layout-grid _2col_grid';
      container.appendChild(mainGrid);
      
      // Create containers for each category
      categoryOrder.forEach(category => {
        const beers = categorizedBeers[category];
        if (beers.length === 0) return; // Skip empty categories
        
        // Section wrapper
        const sectionWrapper = document.createElement('div');
        sectionWrapper.className = 'menu-section-wrapper';
        
        // Title wrapper
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'menu-section-tittle-wrapper';
        
        // Title text
        const titleText = document.createElement('div');
        titleText.className = 'text-block';
        titleText.textContent = categoryLabels[category];
        titleWrapper.appendChild(titleText);
        
        // Category container with data attribute
        const categoryContainer = document.createElement('div');
        categoryContainer.setAttribute(`data-liri-beer-${category}`, '');
        
        // Show loading indicator in the category container
        categoryContainer.appendChild(createLoadingIndicator(categoryLabels[category]));
        
        // Add to section
        sectionWrapper.appendChild(titleWrapper);
        sectionWrapper.appendChild(categoryContainer);
        
        // Add to main grid
        mainGrid.appendChild(sectionWrapper);
        
        // Now populate this category container
        populateBeerCategory(categoryContainer, beers, category);
      });
      
      return; // We've handled everything in this case
    }
    
    // Original flow - categories exist, populate them
    categoryOrder.forEach(category => {
      const beers = categorizedBeers[category];
      if (beers.length === 0) return; // Skip empty categories
      
      // Find the container for this category
      const categorySelector = `[data-liri-beer-${category}]`;
      let categoryContainer = document.querySelector(categorySelector);
      
      // Try different selector variations if needed
      if (!categoryContainer) {
        console.warn(`Container for beer category ${category} not found with selector ${categorySelector}, trying alternative selector`);
        
        // Try alternatives - either the attribute might be empty or might have a value
        const alternativeSelectors = [
          `[data-liri-beer-${category}=""]`,  // Empty value
          `div[data-liri-beer-${category}]`,  // Specifically a div
          `*[data-liri-beer-${category}]`     // Any element with wildcard
        ];
        
        for (const altSelector of alternativeSelectors) {
          const altContainer = document.querySelector(altSelector);
          if (altContainer) {
            console.log(`Found container with alternative selector: ${altSelector}`);
            categoryContainer = altContainer;
            break;
          }
        }
      }
      
      if (!categoryContainer) {
        console.warn(`Container for beer category ${category} not found with any selector, skipping this category`);
        return;
      }
      
      // Populate this category
      populateBeerCategory(categoryContainer, beers, category);
    });
    
    // Helper function to populate a single beer category
    function populateBeerCategory(categoryContainer, beers, category) {
      // Create the grid wrapper for this category
      const gridWrapper = document.createElement('div');
      gridWrapper.className = 'w-layout-grid menu-section-wrapper';
      
      // Add each beer in this category
      beers.forEach(beer => {
        const itemWrapper = document.createElement('div');
        itemWrapper.id = `w-node-${generateRandomId()}`;
        itemWrapper.className = 'menu-item-wrapper';
        
        // Create title bar with dots and price
        const titleGrid = document.createElement('div');
        titleGrid.className = 'w-layout-grid menu-item-tittle';
        
        // Create title element with size info
        const titleElement = document.createElement('div');
        titleElement.id = `w-node-${generateRandomId()}`;
        if (typeof beer.title === 'object' && beer.title.en) {
          // Get the basic title
          let titleText = beer.title.en;
          
          // Check if we should add size directly (if not already in the title)
          if (beer.size && !titleText.includes(beer.size.toString())) {
            // Create the size span
            const sizeSpan = document.createElement('span');
            sizeSpan.className = 'text-size-tiny text-weight-normal';
            sizeSpan.textContent = ` ${beer.size}ml`;
            
            // Set the base title text
            titleElement.textContent = titleText;
            // Append the size span
            titleElement.appendChild(sizeSpan);
          } else {
            // Size is already in the title or not applicable
            titleElement.textContent = titleText;
          }
        } else if (typeof beer.title === 'string') {
          titleElement.textContent = beer.title;
        } else {
          console.warn('Invalid beer title', beer);
          return; // Skip this item
        }
        
        // Create dots element
        const dotsElement = document.createElement('div');
        dotsElement.id = `w-node-${generateRandomId()}`;
        dotsElement.className = 'menu-item-dots';
        
        // Create price element
        const priceElement = document.createElement('div');
        priceElement.id = `w-node-${generateRandomId()}`;
        
        // Format price
        const priceText = typeof beer.price === 'number' ? 
          beer.price.toFixed(2).replace('.', ',') : '';
        
        if (!priceText) {
          console.warn('Missing price for beer item:', beer);
          return; // Skip this item
        }
        
        priceElement.textContent = priceText;
        
        // Add components to title grid
        titleGrid.appendChild(titleElement);
        titleGrid.appendChild(dotsElement);
        titleGrid.appendChild(priceElement);
        itemWrapper.appendChild(titleGrid);
        
        // Add description if available
        if (beer.description && typeof beer.description === 'object' && beer.description.en) {
          const descriptionElement = document.createElement('div');
          descriptionElement.className = 'menu-item-description';
          descriptionElement.textContent = beer.description.en;
          itemWrapper.appendChild(descriptionElement);
        }
        
        gridWrapper.appendChild(itemWrapper);
      });
      
      // Replace loading indicator with the actual content
      categoryContainer.innerHTML = '';
      categoryContainer.appendChild(gridWrapper);
    }
  }
  
  // Function to render spirit items by subcategories
  function renderSpiritItems(container, spiritItems, config) {
    const categorizedSpirits = {};
    
    const categoryOrder = ['vodka', 'gin', 'tequila', 'mezcal', 'rum', 'spiced-rum', 'irish-whiskey', 'scotch-whiskey', 'bourbon-rye', 'cognac', 'liqueur', 'bitters', 'greek-spirits'];
    const categoryLabels = {
      'vodka': 'Vodka',
      'gin': 'Gin',
      'tequila': 'Tequila',
      'mezcal': 'Mezcal',
      'rum': 'Rum',
      'spiced-rum': 'Spiced Rum',
      'irish-whiskey': 'Irish Whiskey',
      'scotch-whiskey': 'Scotch Whiskey',
      'bourbon-rye': 'Bourbon & Rye',
      'cognac': 'Cognac',
      'liqueur': 'Liqueur',
      'bitters': 'Bitters',
      'greek-spirits': 'Greek Spirits'
    };
    
    categoryOrder.forEach(category => {
      categorizedSpirits[category] = [];
    });
    
    spiritItems.forEach(spirit => {
      const category = spirit.subCategory;
      if (category && categorizedSpirits.hasOwnProperty(category)) {
        categorizedSpirits[category].push(spirit);
      } else {
        console.warn(`Spirit has unknown category: ${category}`, spirit);
      }
    });
    
    for (const category in categorizedSpirits) {
      categorizedSpirits[category].sort((a, b) => {
        const titleA = (typeof a.title === 'object') ? a.title.en : a.title;
        const titleB = (typeof b.title === 'object') ? b.title.en : b.title;
        return titleA.localeCompare(titleB);
      });
    }
    
    let totalSpirits = 0;
    for (const category in categorizedSpirits) {
      totalSpirits += categorizedSpirits[category].length;
    }
    
    if (totalSpirits === 0) {
      container.innerHTML = createEmptyMessage(config.name);
      return;
    }
    
    categoryOrder.forEach(category => {
      const spirits = categorizedSpirits[category];
      if (spirits.length === 0) return;
      
      const categorySelector = `[data-liri-spirit-${category.replace('_', '-')}]`;
      const categoryContainer = document.querySelector(categorySelector);
      
      if (!categoryContainer) {
        console.warn(`Container for category ${category} not found with selector ${categorySelector}`);
        return;
      }
      
      const gridWrapper = document.createElement('div');
      gridWrapper.className = 'w-layout-grid accordion-content';
      gridWrapper.style.width = '100%';
      
      const topSpacer = document.createElement('div');
      topSpacer.className = 'spacer-small';
      gridWrapper.appendChild(topSpacer);
      
      spirits.forEach(spirit => {
        const itemWrapper = document.createElement('div');
        itemWrapper.id = `w-node-${generateRandomId()}`;
        itemWrapper.className = 'menu-item-wrapper';
        
        const titleGrid = document.createElement('div');
        titleGrid.className = 'w-layout-grid menu-item-tittle';
        
        const titleElement = document.createElement('div');
        titleElement.id = `w-node-${generateRandomId()}`;
        if (typeof spirit.title === 'object' && spirit.title.en) {
          titleElement.textContent = spirit.title.en;
        } else if (typeof spirit.title === 'string') {
          titleElement.textContent = spirit.title;
        } else {
          console.warn('Invalid spirit title', spirit);
          return;
        }
        
        const dotsElement = document.createElement('div');
        dotsElement.id = `w-node-${generateRandomId()}`;
        dotsElement.className = 'menu-item-dots';
        
        const priceElement = document.createElement('div');
        priceElement.id = `w-node-${generateRandomId()}`;
        
        let priceText = '';
        if (spirit.variants && spirit.variants.length > 0) {
          const sortedVariants = [...spirit.variants].sort((a, b) => a.price - b.price);
          const hasUnavailable = sortedVariants.some(variant => variant.price === 0);
          
          if (hasUnavailable) {
            priceText = 'unavailable';
          } else if (sortedVariants.length === 1) {
            priceText = sortedVariants[0].price.toFixed(2).replace('.', ',');
          } else {
            priceText = sortedVariants
              .map(variant => variant.price.toFixed(2).replace('.', ','))
              .join(' / ');
          }
        } else {
          priceText = 'Price not available';
        }
        
        priceElement.textContent = priceText;
        
        titleGrid.appendChild(titleElement);
        titleGrid.appendChild(dotsElement);
        titleGrid.appendChild(priceElement);
        itemWrapper.appendChild(titleGrid);
        
        if (spirit.description && 
           ((typeof spirit.description === 'object' && spirit.description.en) || 
            (typeof spirit.description === 'string' && spirit.description))) {
          const descriptionElement = document.createElement('div');
          descriptionElement.className = 'menu-item-description';
          
          if (typeof spirit.description === 'object' && spirit.description.en) {
            descriptionElement.textContent = spirit.description.en;
          } else if (typeof spirit.description === 'string') {
            descriptionElement.textContent = spirit.description;
          }
          
          itemWrapper.appendChild(descriptionElement);
        }
        
        gridWrapper.appendChild(itemWrapper);
      });
      
      const bottomSpacer = document.createElement('div');
      bottomSpacer.className = 'spacer-small';
      gridWrapper.appendChild(bottomSpacer);
      
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
    },
    {
      name: 'beer',
      selector: '[data-liri-beer]',
      documentType: 'beerItem',
      template: 'beer'
    },
    {
      name: 'spirits',
      selector: '[data-liri-spirits]',
      documentType: 'spiritItem',
      template: 'spirit'
    }
    // Add more menu sections as needed:
    // { name: 'spirits', selector: '[data-liri-spirits]', documentType: 'spiritItem', template: 'standard' }
  ];
  
  // Function to initialize all menu sections
  function initializeMenus() {
    // First, check the wine container situation and fix any case mismatches
    fixWineContainerAttributes();
    
    menuConfigs.forEach(config => {
      if (document.querySelector(config.selector)) {
        loadMenuItems(config);
      }
    });
  }
  
  // Function to fix potential issues with wine container attributes
  function fixWineContainerAttributes() {
    const correctAttributeNames = [
      'data-liri-red-wine',
      'data-liri-white-wine', 
      'data-liri-rose-wine',
      'data-liri-sparkling-wine',
      'data-liri-wine',
      'data-liri-beer',
      'data-liri-beer-local',
      'data-liri-beer-imported'
    ];
    
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(el => {
      if (!el.attributes || el.attributes.length === 0) return;
      
      Array.from(el.attributes).forEach(attr => {
        if (!attr.name.toLowerCase().startsWith('data-')) return;
        
        if (attr.name.toLowerCase().includes('wine') || 
            attr.name.toLowerCase().includes('beer')) {
          const matchedAttribute = correctAttributeNames.find(
            correctAttr => correctAttr.toLowerCase() === attr.name.toLowerCase()
          );
          
          if (matchedAttribute && matchedAttribute !== attr.name) {
            const value = el.getAttribute(attr.name);
            el.removeAttribute(attr.name);
            el.setAttribute(matchedAttribute, value || '');
          }
        }
      });
    });
  }
  
  // Add a new standalone function for loading and rendering spirits
  function loadSpiritMenuItems() {
    const spiritCategories = [
      'vodka', 'gin', 'tequila', 'mezcal', 'rum', 'spiced-rum', 'irish-whiskey', 
      'scotch-whiskey', 'bourbon-rye', 'cognac', 'liqueur', 'bitters', 'greek-spirits'
    ];
    
    let foundAnyContainer = false;
    spiritCategories.forEach(category => {
      const selector = `[data-liri-spirit-${category}]`;
      const container = document.querySelector(selector);
      if (container) {
        foundAnyContainer = true;
        container.innerHTML = '';
        container.appendChild(createLoadingIndicator(category));
      }
    });
    
    if (!foundAnyContainer) {
      console.warn("No spirit category containers found. Add elements with data-liri-spirit-[category] attributes.");
      return;
    }
    
    const cachedData = getFromCache('spiritItem');
    if (cachedData) {
      processSpiritData(cachedData);
      return;
    }
    
    const query = encodeURIComponent(`*[_type == "spiritItem"] | order(orderRank asc) {
      _id, 
      title,
      description,
      subCategory,
      variants[] {
        _key,
        size,
        price
      },
      orderRank
    }`);
    
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        saveToCache('spiritItem', data);
        processSpiritData(data);
      })
      .catch(error => {
        console.error("Error loading spirit data:", error);
        spiritCategories.forEach(category => {
          const container = document.querySelector(`[data-liri-spirit-${category}]`);
          if (container) {
            container.innerHTML = '';
            container.appendChild(createErrorMessage("Failed to load spirits menu"));
          }
        });
      });
  }

  function processSpiritData(data) {
    const spiritItems = data.result || [];
    
    if (!spiritItems || spiritItems.length === 0) {
      console.warn("No spirit items found in the data");
      return;
    }
    
    const spiritsByCategory = {};
    
    spiritItems.forEach(spirit => {
      const category = spirit.subCategory;
      if (!category) return;
      
      if (!spiritsByCategory[category]) {
        spiritsByCategory[category] = [];
      }
      
      spiritsByCategory[category].push(spirit);
    });
    
    Object.keys(spiritsByCategory).forEach(category => {
      spiritsByCategory[category].sort((a, b) => {
        const titleA = (typeof a.title === 'object') ? a.title.en : a.title;
        const titleB = (typeof b.title === 'object') ? b.title.en : b.title;
        return titleA.localeCompare(titleB);
      });
    });
    
    const categories = ['vodka', 'gin', 'tequila', 'mezcal', 'rum', 'spiced-rum', 'irish-whiskey', 
                        'scotch-whiskey', 'bourbon-rye', 'cognac', 'liqueur', 'bitters', 'greek-spirits'];
    
    categories.forEach(category => {
      const spirits = spiritsByCategory[category] || [];
      const categoryContainer = document.querySelector(`[data-liri-spirit-${category}]`);
      
      if (!categoryContainer) {
        return;
      }
      
      if (spirits.length === 0) {
        categoryContainer.innerHTML = '';
        categoryContainer.appendChild(createEmptyMessage(category));
        return;
      }
      
      renderSpiritCategory(categoryContainer, spirits);
    });
  }
  
  function renderSpiritCategory(container, spirits) {
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'w-layout-grid accordion-content';
    contentWrapper.style.width = '100%';
    
    const topSpacer = document.createElement('div');
    topSpacer.className = 'spacer-small';
    contentWrapper.appendChild(topSpacer);
    
    spirits.forEach(spirit => {
      const itemWrapper = document.createElement('div');
      itemWrapper.id = `w-node-${generateRandomId()}`;
      itemWrapper.className = 'menu-item-wrapper';
      
      const titleGrid = document.createElement('div');
      titleGrid.className = 'w-layout-grid menu-item-tittle';
      
      const titleElement = document.createElement('div');
      titleElement.id = `w-node-${generateRandomId()}`;
      if (typeof spirit.title === 'object' && spirit.title.en) {
        titleElement.textContent = spirit.title.en;
      } else if (typeof spirit.title === 'string') {
        titleElement.textContent = spirit.title;
      } else {
        return;
      }
      
      const dotsElement = document.createElement('div');
      dotsElement.id = `w-node-${generateRandomId()}`;
      dotsElement.className = 'menu-item-dots';
      
      const priceElement = document.createElement('div');
      priceElement.id = `w-node-${generateRandomId()}`;
      
      let priceText = '';
      if (spirit.variants && spirit.variants.length > 0) {
        const sortedVariants = [...spirit.variants].sort((a, b) => a.price - b.price);
        
        const hasUnavailable = sortedVariants.some(variant => variant.price === 0);
        
        if (hasUnavailable) {
          priceText = 'unavailable';
        } else if (sortedVariants.length === 1) {
          priceText = sortedVariants[0].price.toFixed(2).replace('.', ',');
        } else {
          priceText = sortedVariants
            .map(variant => variant.price.toFixed(2).replace('.', ','))
            .join(' / ');
        }
      } else {
        priceText = 'Price not available';
      }
      
      priceElement.textContent = priceText;
      
      titleGrid.appendChild(titleElement);
      titleGrid.appendChild(dotsElement);
      titleGrid.appendChild(priceElement);
      itemWrapper.appendChild(titleGrid);
      
      if (spirit.description && 
         ((typeof spirit.description === 'object' && spirit.description.en) || 
          (typeof spirit.description === 'string' && spirit.description))) {
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'menu-item-description';
        
        if (typeof spirit.description === 'object' && spirit.description.en) {
          descriptionElement.textContent = spirit.description.en;
        } else if (typeof spirit.description === 'string') {
          descriptionElement.textContent = spirit.description;
        }
        
        itemWrapper.appendChild(descriptionElement);
      }
      
      contentWrapper.appendChild(itemWrapper);
    });
    
    const bottomSpacer = document.createElement('div');
    bottomSpacer.className = 'spacer-small';
    contentWrapper.appendChild(bottomSpacer);
    
    container.innerHTML = '';
    container.appendChild(contentWrapper);
  }

  function initializeWithSpirits() {
    initializeMenus();
    setTimeout(loadSpiritMenuItems, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWithSpirits);
  } else {
    initializeWithSpirits();
  }

  // Rename the file to liri-menu.js since it now handles multiple menu types
})(); 