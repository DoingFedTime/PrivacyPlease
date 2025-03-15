// Updated Background Script for Privacy Please extension
// Using declarativeNetRequest API for Manifest V3 compatibility

// Store settings for the extension
let extensionEnabled = true;
let siteSettings = {};

// Initialize extension
async function initialize() {
  await loadSettings();
  
  // Set up listeners for rule updates
  updateRuleStates();
  
  // Listen for changes to storage
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && (changes.extensionEnabled || changes.siteSettings)) {
      if (changes.extensionEnabled) {
        extensionEnabled = changes.extensionEnabled.newValue;
      }
      if (changes.siteSettings) {
        siteSettings = changes.siteSettings.newValue;
      }
      updateRuleStates();
    }
  });
}

// Load settings from storage
function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['extensionEnabled', 'siteSettings'], (result) => {
      if (result.extensionEnabled !== undefined) {
        extensionEnabled = result.extensionEnabled;
      }
      
      if (result.siteSettings) {
        siteSettings = result.siteSettings;
      } else {
        // Initialize default site settings if not present
        initializeDefaultSettings();
      }
      
      resolve();
    });
  });
}

// Initialize default settings for all sites
function initializeDefaultSettings() {
  siteSettings = {
    'youtube.com': { enabled: true, preferredInstance: 'https://yewtu.be' },
    'music.youtube.com': { enabled: true, preferredInstance: 'https://beatbump.ml' },
    'twitter.com': { enabled: true, preferredInstance: 'https://nitter.net' },
    'x.com': { enabled: true, preferredInstance: 'https://nitter.net' },
    'reddit.com': { enabled: true, preferredInstance: 'https://libredd.it' },
    'instagram.com': { enabled: true, preferredInstance: 'https://proxigram.herokuapp.com' },
    'tiktok.com': { enabled: true, preferredInstance: 'https://proxitok.herokuapp.com' },
    'google.com': { enabled: true, preferredInstance: 'https://searx.space' },
    'medium.com': { enabled: true, preferredInstance: 'https://scribe.rip' },
    'imgur.com': { enabled: true, preferredInstance: 'https://rimgo.bus-hit.me' },
    'quora.com': { enabled: true, preferredInstance: 'https://quetre.iket.me' },
    'imdb.com': { enabled: true, preferredInstance: 'https://libremdb.iket.me' }
  };
  
  // Save default settings
  saveSettings();
}

// Save settings to storage
function saveSettings() {
  chrome.storage.sync.set({ 
    extensionEnabled: extensionEnabled,
    siteSettings: siteSettings
  });
}

// Update the state of declarativeNetRequest rules based on settings
function updateRuleStates() {
  // Get all rule IDs
  const ruleIds = Array.from({ length: 12 }, (_, i) => i + 1);
  
  if (!extensionEnabled) {
    // If extension is disabled, disable all rules
    chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ["ruleset_1"]
    });
  } else {
    // If extension is enabled, enable the ruleset
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["ruleset_1"]
    });
    
    // Enable/disable individual rules based on site settings
    // Note: In the current implementation with static rules.json, we can't dynamically
    // update individual rules. In a more advanced implementation, we would generate
    // dynamic rules here based on site settings.
  }
}

// Listen for messages from popup or options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSettings') {
    sendResponse({ 
      extensionEnabled: extensionEnabled,
      siteSettings: siteSettings
    });
  } else if (message.action === 'updateGlobalState') {
    extensionEnabled = message.enabled;
    saveSettings();
    updateRuleStates();
    sendResponse({ success: true });
  } else if (message.action === 'updateSiteSettings') {
    const { site, enabled, preferredInstance } = message.data;
    if (siteSettings[site]) {
      siteSettings[site].enabled = enabled;
      if (preferredInstance) {
        siteSettings[site].preferredInstance = preferredInstance;
      }
      saveSettings();
      updateRuleStates();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Site not found in settings' });
    }
  } else if (message.action === 'resetSettings') {
    initializeDefaultSettings();
    updateRuleStates();
    sendResponse({ success: true });
  }
  return true;
});

// Initialize the extension when loaded
initialize();
