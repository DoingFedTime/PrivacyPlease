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
    
    // Add instances as options
    settings.instances.forEach(instance => {
      const option = document.createElement('option');
      option.value = instance;
      option.textContent = instance;
      if (instance === settings.preferredInstance) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    const customOption = document.createElement('option');

    customOption.textContent = "Custom";

    select.appendChild(customOption);


    //const customOptionField = document.createElement('input');
    
    //customOptionField.type = "url";
    
   // customOption.appendChild(customOptionField);

    //select.appendChild(customOption)

    instanceSelector.appendChild(instanceLabel);
    instanceSelector.appendChild(select);
    
    body.appendChild(instanceSelector);
    
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
  function saveSettings() {
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
    
    // Send updated settings to background script
    for (const [site, settings] of Object.entries(currentSettings)) {
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        data: {
          site: site,
          enabled: settings.enabled,
          preferredInstance: settings.preferredInstance
        }
      });
    }
    
    // Show save confirmation
    showSaveConfirmation();
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
  }
  
  // Set up event listeners
  setupEventListeners();
});
