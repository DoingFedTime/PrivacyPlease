// Popup script for Privacy Please extension
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const masterToggle = document.getElementById('master-toggle');
  const statusIndicator = document.querySelector('.status-indicator');
  const statusText = document.getElementById('status-text');
  const sitesList = document.getElementById('sites-list');
  const optionsBtn = document.getElementById('options-btn');
  
  // Load settings from background script
  chrome.runtime.sendMessage({ action: 'getSettings' }, function(response) {
    const settings = response.settings;
    
    // Check if all sites are enabled
    const allEnabled = Object.values(settings).every(site => site.enabled);
    masterToggle.checked = allEnabled;
    updateStatusIndicator(allEnabled);
    
    // Populate sites list
    populateSitesList(settings);
    
    // Set up event listeners
    setupEventListeners(settings);
  });
  
  // Update status indicator based on enabled state
  function updateStatusIndicator(enabled) {
    if (enabled) {
      statusIndicator.classList.remove('disabled');
      statusText.textContent = 'Enabled';
    } else {
      statusIndicator.classList.add('disabled');
      statusText.textContent = 'Disabled';
    }
  }
  
  // Populate the sites list with toggle switches
  function populateSitesList(settings) {
    // Clear existing list
    sitesList.innerHTML = '';
    
    // Add top sites to the list
    const topSites = ['youtube.com', 'twitter.com', 'reddit.com', 'instagram.com', 'tiktok.com'];
    
    topSites.forEach(site => {
      if (settings[site]) {
        const li = document.createElement('li');
        
        // Create toggle switch
        const label = document.createElement('label');
        label.className = 'switch';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = settings[site].enabled;
        input.dataset.site = site;
        
        const slider = document.createElement('span');
        slider.className = 'slider round';
        
        label.appendChild(input);
        label.appendChild(slider);
        
        // Create site name
        const span = document.createElement('span');
        span.textContent = formatSiteName(site);
        
        // Add elements to list item
        li.appendChild(label);
        li.appendChild(span);
        
        // Add list item to sites list
        sitesList.appendChild(li);
      }
    });
  }
  
  // Format site name for display
  function formatSiteName(site) {
    return site
      .replace(/\.com$/, '')
      .replace(/^./, match => match.toUpperCase());
  }
  
  // Set up event listeners
  function setupEventListeners(settings) {
    // Master toggle
    masterToggle.addEventListener('change', function() {
      const enabled = this.checked;
      
      // Update all site toggles
      const siteToggles = document.querySelectorAll('#sites-list input[type="checkbox"]');
      siteToggles.forEach(toggle => {
        toggle.checked = enabled;
      });
      
      // Update status indicator
      updateStatusIndicator(enabled);
      
      // Send message to background script to update all settings
      Object.keys(settings).forEach(site => {
        chrome.runtime.sendMessage({
          action: 'updateSettings',
          data: {
            site: site,
            enabled: enabled
          }
        });
      });
    });
    
    // Individual site toggles
    sitesList.addEventListener('change', function(e) {
      if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
        const site = e.target.dataset.site;
        const enabled = e.target.checked;
        
        // Send message to background script to update setting
        chrome.runtime.sendMessage({
          action: 'updateSettings',
          data: {
            site: site,
            enabled: enabled
          }
        });
        
        // Check if all sites are enabled/disabled and update master toggle
        const allEnabled = Array.from(
          document.querySelectorAll('#sites-list input[type="checkbox"]')
        ).every(input => input.checked);
        
        masterToggle.checked = allEnabled;
        updateStatusIndicator(allEnabled);
      }
    });
    
    // Options button
    optionsBtn.addEventListener('click', function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('html/options.html'));
      }
    });
  }
});
