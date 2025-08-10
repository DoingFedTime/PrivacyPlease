// Options page script for Privacy Redirect extension
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const masterToggle = document.getElementById('master-toggle');
  const sitesContainer = document.getElementById('sites-container');
  const saveBtn = document.getElementById('save-btn');
  const resetBtn = document.getElementById('reset-btn');
  
  // Store settings locally
  let currentSettings = {};
  
  // Load settings from background script
  loadSettings();
  
  // Load settings from background script
  function loadSettings() {
    chrome.runtime.sendMessage({ action: 'getSettings' }, function(response) {
      currentSettings = response.settings;
      
      // Check if all sites are enabled
      const allEnabled = Object.values(currentSettings).every(site => site.enabled);
      masterToggle.checked = allEnabled;
      
      // Populate sites container
      populateSitesContainer();
    });
  }
  
  // Populate the sites container with site cards
  function populateSitesContainer() {
    // Clear existing content
    sitesContainer.innerHTML = '';
    
    // Add site cards
    for (const [site, settings] of Object.entries(currentSettings)) {
      const siteCard = createSiteCard(site, settings);
      sitesContainer.appendChild(siteCard);
    }
  }
  
  // Create a site card element
  function createSiteCard(site, settings) {
    const card = document.createElement('div');
    card.className = 'site-card';
    
    // Create site header
    const header = document.createElement('div');
    header.className = 'site-header';
    
    const title = document.createElement('div');
    title.className = 'site-title';
    title.textContent = formatSiteName(site);
    
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-container';
    
    const label = document.createElement('label');
    label.className = 'switch';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = settings.enabled;
    input.dataset.site = site;
    input.className = 'site-toggle';
    
    const slider = document.createElement('span');
    slider.className = 'slider round';
    
    label.appendChild(input);
    label.appendChild(slider);
    toggleContainer.appendChild(label);
    
    header.appendChild(title);
    header.appendChild(toggleContainer);
    
    // Create site body
    const body = document.createElement('div');
    body.className = 'site-body';
    
    // Create instance selector
    const instanceSelector = document.createElement('div');
    instanceSelector.className = 'instance-selector';
    
    const instanceLabel = document.createElement('label');
    instanceLabel.textContent = 'Preferred Instance:';
    instanceLabel.htmlFor = `instance-${site}`;
    
    const select = document.createElement('select');
    select.id = `instance-${site}`;
    select.dataset.site = site;
    select.className = 'instance-select';
    
    // Add predefined instances as options
    settings.instances.forEach(instance => {
      const option = document.createElement('option');
      option.value = instance;
      option.textContent = instance;
      if (instance === settings.preferredInstance) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
    // Add custom instances as options
    if (settings.customInstances && settings.customInstances.length > 0) {
      const separator = document.createElement('option');
      separator.disabled = true;
      separator.textContent = '──────────';
      select.appendChild(separator);
      
      settings.customInstances.forEach(instance => {
        const option = document.createElement('option');
        option.value = instance;
        option.textContent = `${instance} (Custom)`;
        option.className = 'custom-option';
        if (instance === settings.preferredInstance) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    }
    
    instanceSelector.appendChild(instanceLabel);
    instanceSelector.appendChild(select);
    
    body.appendChild(instanceSelector);
    
    // Add custom instance section
    const customSection = document.createElement('div');
    customSection.className = 'custom-instance-section';
    
    const addCustomBtn = document.createElement('button');
    addCustomBtn.className = 'add-custom-btn';
    addCustomBtn.textContent = '+ Add Custom Instance';
    addCustomBtn.dataset.site = site;
    
    const customInputContainer = document.createElement('div');
    customInputContainer.className = 'custom-input-container';
    customInputContainer.style.display = 'none';
    
    const customInput = document.createElement('input');
    customInput.type = 'url';
    customInput.className = 'custom-instance-input';
    customInput.placeholder = 'https://your-custom-instance.com';
    customInput.dataset.site = site;
    
    const addBtn = document.createElement('button');
    addBtn.className = 'custom-add-btn';
    addBtn.textContent = 'Add';
    addBtn.dataset.site = site;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'custom-cancel-btn';
    cancelBtn.textContent = 'Cancel';
    
    customInputContainer.appendChild(customInput);
    customInputContainer.appendChild(addBtn);
    customInputContainer.appendChild(cancelBtn);
    
    customSection.appendChild(addCustomBtn);
    customSection.appendChild(customInputContainer);
    
    body.appendChild(customSection);
    
    // Show any existing custom instances
    if (settings.customInstances && settings.customInstances.length > 0) {
      const customList = document.createElement('div');
      customList.className = 'custom-instances-list';
      
      const customTitle = document.createElement('div');
      customTitle.className = 'custom-instances-title';
      customTitle.textContent = 'Custom Instances:';
      customList.appendChild(customTitle);
      
      settings.customInstances.forEach((instance, index) => {
        const customItem = document.createElement('div');
        customItem.className = 'custom-instance-item';
        
        const instanceUrl = document.createElement('span');
        instanceUrl.textContent = instance;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-custom-btn';
        removeBtn.textContent = '×';
        removeBtn.dataset.site = site;
        removeBtn.dataset.instance = instance;
        removeBtn.title = 'Remove custom instance';
        
        customItem.appendChild(instanceUrl);
        customItem.appendChild(removeBtn);
        customList.appendChild(customItem);
      });
      
      body.appendChild(customList);
    }
    
    // Add all elements to card
    card.appendChild(header);
    card.appendChild(body);
    
    return card;
  }
  
  // Format site name for display
  function formatSiteName(site) {
    return site
      .replace(/\.com(\/search)?$/, '')
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  
  // Save settings to background script
  async function saveSettings() {
    // Get all site toggles
    const siteToggles = document.querySelectorAll('.site-toggle');
    const instanceSelects = document.querySelectorAll('.instance-select');
    
    // Update settings based on UI state
    siteToggles.forEach(toggle => {
      const site = toggle.dataset.site;
      currentSettings[site].enabled = toggle.checked;
    });
    
    instanceSelects.forEach(select => {
      const site = select.dataset.site;
      currentSettings[site].preferredInstance = select.value;
    });
    
    // Create promises for all save operations
    const savePromises = [];
    for (const [site, settings] of Object.entries(currentSettings)) {
      const promise = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'updateSettings',
          data: {
            site: site,
            enabled: settings.enabled,
            preferredInstance: settings.preferredInstance,
            customInstances: settings.customInstances || []
          }
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(`Failed to save ${site}: ${chrome.runtime.lastError.message}`));
          } else if (response && response.success) {
            resolve(site);
          } else {
            reject(new Error(`Failed to save ${site}: ${response?.error || 'Unknown error'}`));
          }
        });
      });
      savePromises.push(promise);
    }
    
    try {
      // Wait for all save operations to complete
      await Promise.all(savePromises);
      showSaveConfirmation();
    } catch (error) {
      console.error('Save operation failed:', error);
      showSaveError(error.message);
    }
  }
  
  // Show save confirmation message
  function showSaveConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.className = 'save-confirmation';
    confirmation.textContent = 'Settings saved successfully!';
    confirmation.style.position = 'fixed';
    confirmation.style.top = '20px';
    confirmation.style.left = '50%';
    confirmation.style.transform = 'translateX(-50%)';
    confirmation.style.backgroundColor = '#2ecc71';
    confirmation.style.color = 'white';
    confirmation.style.padding = '10px 20px';
    confirmation.style.borderRadius = '4px';
    confirmation.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    document.body.appendChild(confirmation);
    
    // Remove confirmation after 3 seconds
    setTimeout(() => {
      document.body.removeChild(confirmation);
    }, 3000);
  }
  
  // Show save error message
  function showSaveError(errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'save-error';
    errorDiv.textContent = `Error saving settings: ${errorMessage}`;
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.backgroundColor = '#e74c3c';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 20px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    errorDiv.style.zIndex = '9999';
    
    document.body.appendChild(errorDiv);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 5000);
  }
  
  // Reset settings to defaults
  function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      chrome.runtime.sendMessage({ action: 'resetSettings' }, function(response) {
        if (response.success) {
          loadSettings();
        }
      });
    }
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Master toggle
    masterToggle.addEventListener('change', function() {
      const enabled = this.checked;
      
      // Update all site toggles
      const siteToggles = document.querySelectorAll('.site-toggle');
      siteToggles.forEach(toggle => {
        toggle.checked = enabled;
      });
    });
    
    // Save button
    saveBtn.addEventListener('click', saveSettings);
    
    // Reset button
    resetBtn.addEventListener('click', resetSettings);
    
    // Custom instance event listeners
    document.addEventListener('click', function(e) {
      // Add custom instance button
      if (e.target.classList.contains('add-custom-btn')) {
        const site = e.target.dataset.site;
        const container = e.target.nextElementSibling;
        container.style.display = 'block';
        e.target.style.display = 'none';
        container.querySelector('.custom-instance-input').focus();
      }
      
      // Cancel custom instance
      if (e.target.classList.contains('custom-cancel-btn')) {
        const container = e.target.parentElement;
        const addBtn = container.previousElementSibling;
        container.style.display = 'none';
        addBtn.style.display = 'block';
        container.querySelector('.custom-instance-input').value = '';
      }
      
      // Add custom instance
      if (e.target.classList.contains('custom-add-btn')) {
        const site = e.target.dataset.site;
        const input = e.target.parentElement.querySelector('.custom-instance-input');
        const url = input.value.trim();
        
        if (validateCustomInstance(url)) {
          addCustomInstance(site, url);
          // Hide input container
          const container = e.target.parentElement;
          const addBtn = container.previousElementSibling;
          container.style.display = 'none';
          addBtn.style.display = 'block';
          input.value = '';
        } else {
          showCustomInstanceError('Please enter a valid HTTPS URL');
        }
      }
      
      // Remove custom instance
      if (e.target.classList.contains('remove-custom-btn')) {
        const site = e.target.dataset.site;
        const instance = e.target.dataset.instance;
        removeCustomInstance(site, instance);
      }
    });
    
    // Enter key in custom instance input
    document.addEventListener('keypress', function(e) {
      if (e.target.classList.contains('custom-instance-input') && e.key === 'Enter') {
        const addBtn = e.target.nextElementSibling;
        addBtn.click();
      }
    });
  }
  
  // Validate custom instance URL
  function validateCustomInstance(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && urlObj.hostname.length > 0;
    } catch (e) {
      return false;
    }
  }
  
  // Add custom instance
  function addCustomInstance(site, url) {
    if (!currentSettings[site].customInstances) {
      currentSettings[site].customInstances = [];
    }
    
    // Check if instance already exists
    const allInstances = [...currentSettings[site].instances, ...currentSettings[site].customInstances];
    if (allInstances.includes(url)) {
      showCustomInstanceError('This instance already exists');
      return;
    }
    
    currentSettings[site].customInstances.push(url);
    
    // Refresh the site card to show the new custom instance
    populateSitesContainer();
    
    showCustomInstanceSuccess('Custom instance added successfully');
  }
  
  // Remove custom instance
  function removeCustomInstance(site, instance) {
    if (currentSettings[site].customInstances) {
      const index = currentSettings[site].customInstances.indexOf(instance);
      if (index > -1) {
        currentSettings[site].customInstances.splice(index, 1);
        
        // If this was the preferred instance, reset to default
        if (currentSettings[site].preferredInstance === instance) {
          currentSettings[site].preferredInstance = currentSettings[site].instances[0];
        }
        
        // Refresh the site card
        populateSitesContainer();
        
        showCustomInstanceSuccess('Custom instance removed successfully');
      }
    }
  }
  
  // Show custom instance success message
  function showCustomInstanceSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'custom-instance-message success';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.backgroundColor = '#2ecc71';
    successDiv.style.color = 'white';
    successDiv.style.padding = '10px 15px';
    successDiv.style.borderRadius = '4px';
    successDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    successDiv.style.zIndex = '9999';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  }
  
  // Show custom instance error message
  function showCustomInstanceError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'custom-instance-message error';
    errorDiv.textContent = message;
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.backgroundColor = '#e74c3c';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 15px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    errorDiv.style.zIndex = '9999';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 4000);
  }
  
  // Set up event listeners
  setupEventListeners();
});
