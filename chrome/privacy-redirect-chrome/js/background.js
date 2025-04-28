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
      // Check for errors in chrome.storage.sync.get
      if (chrome.runtime.lastError) {
        console.error("Error loading settings:", chrome.runtime.lastError);
        // Continue with default settings if there's an error
        initializeDefaultSettings();
        resolve();
        return;
      }
      
      if (result.extensionEnabled !== undefined) {
        extensionEnabled = result.extensionEnabled;
      }
      
      if (result.siteSettings) {
        siteSettings = result.siteSettings;
        
        // Ensure all sites have the instances array
        let needsUpdate = false;
        for (const site in siteSettings) {
          if (!siteSettings[site].instances) {
            needsUpdate = true;
            // If instances array is missing, add it with at least the preferred instance
            siteSettings[site].instances = [siteSettings[site].preferredInstance];
          }
        }
        
        // If any site was missing instances, save the updated settings
        if (needsUpdate) {
          saveSettings();
        }
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
    'youtube.com': {
      enabled: true,
      preferredInstance: 'https://yewtu.be',
      instances: ['https://yewtu.be', 'https://vid.puffyan.us', 'https://invidious.projectsegfau.lt']
    },
    'music.youtube.com': {
      enabled: true,
      preferredInstance: 'https://beatbump.ml',
      instances: ['https://beatbump.ml', 'https://music.youtube.com']
    },
    'twitter.com': {
      enabled: true,
      preferredInstance: 'https://nitter.net',
      instances: ['https://nitter.net', 'https://nitter.lacontrevoie.fr', 'https://nitter.1d4.us']
    },
    'x.com': {
      enabled: true,
      preferredInstance: 'https://nitter.net',
      instances: ['https://nitter.net', 'https://nitter.lacontrevoie.fr', 'https://nitter.1d4.us']
    },
    'reddit.com': {
      enabled: true,
      preferredInstance: 'https://libredd.it',
      instances: ['https://libredd.it', 'https://teddit.net', 'https://libreddit.spike.codes']
    },
    'instagram.com': {
      enabled: true,
      preferredInstance: 'https://proxigram.herokuapp.com',
      instances: ['https://proxigram.herokuapp.com', 'https://bibliogram.art']
    },
    'tiktok.com': {
      enabled: true,
      preferredInstance: 'https://proxitok.herokuapp.com',
      instances: ['https://proxitok.herokuapp.com', 'https://proxitok.pabloferreiro.es']
    },
    'google.com': {
      enabled: true,
      preferredInstance: 'https://searx.space',
      instances: ['https://searx.space', 'https://search.brave.com', 'https://duckduckgo.com']
    },
    'medium.com': {
      enabled: true,
      preferredInstance: 'https://scribe.rip',
      instances: ['https://scribe.rip', 'https://libmedium.batsense.net']
    },
    'imgur.com': {
      enabled: true,
      preferredInstance: 'https://rimgo.bus-hit.me',
      instances: ['https://rimgo.bus-hit.me', 'https://rimgo.totaldarkness.net']
    },
    'quora.com': {
      enabled: true,
      preferredInstance: 'https://quetre.iket.me',
      instances: ['https://quetre.iket.me', 'https://quetre.tokhmi.xyz']
    },
    'imdb.com': {
      enabled: true,
      preferredInstance: 'https://libremdb.iket.me',
      instances: ['https://libremdb.iket.me', 'https://libremdb.pussthecat.org']
    }
  };
  
  // Save default settings
  saveSettings();
}

// Save settings to storage
function saveSettings() {
  chrome.storage.sync.set({
    extensionEnabled: extensionEnabled,
    siteSettings: siteSettings
  }, () => {
    // Check for errors when saving settings
    if (chrome.runtime.lastError) {
      console.error("Error saving settings:", chrome.runtime.lastError);
    }
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
      settings: siteSettings  // Changed from siteSettings to settings to match what options.js expects
    });
  } else if (message.action === 'updateGlobalState') {
    extensionEnabled = message.enabled;
    saveSettings();
    updateRuleStates();
    sendResponse({ success: true });
  } else if (message.action === 'updateSettings' || message.action === 'updateSiteSettings') {
    // Handle both updateSettings (from options.js) and updateSiteSettings (if used elsewhere)
    const { site, enabled, preferredInstance } = message.data;
    if (siteSettings[site]) {
      siteSettings[site].enabled = enabled;
      if (preferredInstance) {
        // Validate that preferredInstance is in the instances array
        if (siteSettings[site].instances && siteSettings[site].instances.includes(preferredInstance)) {
          siteSettings[site].preferredInstance = preferredInstance;
        } else {
          console.warn(`Invalid preferredInstance for ${site}: ${preferredInstance}. Setting to default.`);
          // Set to the first instance in the array if available
          if (siteSettings[site].instances && siteSettings[site].instances.length > 0) {
            siteSettings[site].preferredInstance = siteSettings[site].instances[0];
          }
          // If no instances array or empty, keep the current preferredInstance
        }
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
