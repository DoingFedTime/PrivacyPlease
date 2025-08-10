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
    'music.youtube.com': {
      enabled: true,
      preferredInstance: 'https://beatbump.io',
      instances: ['https://beatbump.io', 'https://music.youtube.com']
    },
    'youtube.com': {
      enabled: true,
      preferredInstance: 'https://yewtu.be',
      instances: ['https://yewtu.be', 'https://inv.nadeko.net', 'https://invidious.nerdvpn.de', 'https://id.420129.xyz']
    },
    'twitter.com': {
      enabled: true,
      preferredInstance: 'https://nitter.net',
      instances: ['https://nitter.net', 'https://xcancel.com', 'https://nitter.space', 'https://nitter.privacyredirect.com', 'https://lightbrd.com', 'https://nitter.poast.org', 'https://nitter.tiekoetter.com']
    },
    'x.com': {
      enabled: true,
      preferredInstance: 'https://nitter.net',
      instances: ['https://nitter.net', 'https://xcancel.com', 'https://nitter.space', 'https://nitter.privacyredirect.com', 'https://lightbrd.com', 'https://nitter.poast.org', 'https://nitter.tiekoetter.com']
    },
    'reddit.com': {
      enabled: true,
      preferredInstance: 'https://safereddit.com',
      instances: ['https://safereddit.com', 'https://eu.safereddit.com', 'https://l.opnxng.com', 'https://redlib.perennialte.ch', 'https://redlib.tux.pizza', 'https://libreddit.privacydev.net', 'https://rl.bloat.cat', 'https://redlib.privacyredirect.com', 'https://reddit.nerdvpn.de', 'https://redlib.4o1x5.dev', 'https://reddit.adminforge.de', 'https://rl.blitzw.in', 'https://reddit.rtrace.io', 'https://lr.ptr.moe', 'https://redlib.orangenet.cc', 'https://redlib.privadency.com', 'https://redlib.minihoot.site']
    },
    'instagram.com': {
      enabled: true,
      preferredInstance: 'https://proxigram.lunar.icu',
      instances: ['https://proxigram.lunar.icu', 'https://imginn.com']
    },
    'tiktok.com': {
      enabled: true,
      preferredInstance: 'https://tok.artemislena.eu',
      instances: ['https://tok.artemislena.eu', 'https://proxitok.pussthecat.org', 'https://tok.adminforge.de', 'https://cringe.whatever.social', 'https://proxitok.lunar.icu', 'https://proxitok.belloworld.it']
    },
    'translate.google.com': {
      enabled: true,
      preferredInstance: 'https://lingva.ml',
      instances: ['https://lingva.ml', 'https://lingva.garudalinux.org', 'https://translate.plausibility.cloud', 'https://lingva.lunar.icu', 'https://translate.projectsegfau.lt']
    },
    'google.com': {
      enabled: true,
      preferredInstance: 'https://search.disroot.org',
      instances: ['https://search.disroot.org', 'https://searx.be', 'https://priv.au', 'https://search.rhscz.eu', 'https://searx.tuxcloud.net', 'https://search.funami.tech', 'https://librey.sny.sh', 'https://search.liv.town']
    },
    'medium.com': {
      enabled: true,
      preferredInstance: 'https://scribe.rip',
      instances: ['https://scribe.rip', 'https://scribe.nixnet.services', 'https://scribe.rawbit.ninja', 'https://m.opnxng.com', 'https://scribe.privacyredirect.com']
    },
    'imgur.com': {
      enabled: true,
      preferredInstance: 'https://r.opnxng.com',
      instances: ['https://r.opnxng.com', 'https://imgur.artemislena.eu', 'https://rimgo.totaldarkness.net', 'https://rimgo.bloat.cat', 'https://rimgo.pussthecat.org']
    },
    'quora.com': {
      enabled: true,
      preferredInstance: 'https://quetre.iket.me',
      instances: ['https://quetre.iket.me', 'https://quetre.blackdrgn.nl', 'https://q.opnxng.com', 'https://quetre.canine.tools', 'https://qt.bloat.cat', 'https://quetre.pussthecat.org']
    },
    'imdb.com': {
      enabled: true,
      preferredInstance: 'https://libremdb.iket.me',
      instances: ['https://libremdb.iket.me', 'https://d.opnxng.com', 'https://lmdb.bloat.cat', 'https://libremdb.catsarch.com', 'https://imdb.nerdvpn.de', 'https://libremdb.canine.tools']
    },
    'stackoverflow.com': {
      enabled: true,
      preferredInstance: 'https://code.whatever.social',
      instances: ['https://code.whatever.social']
    },
    'tumblr.com': {
      enabled: true,
      preferredInstance: 'https://pb.bloat.cat',
      instances: ['https://pb.bloat.cat', 'https://tb.opnxng.com', 'https://priviblur.pussthecat.org', 'https://priviblur.thebunny.zone', 'https://priviblur.canine.tools', 'https://pb.cleberg.net', 'https://tumblr.nerdvpn.de']
    },
    'twitch.tv': {
      enabled: true,
      preferredInstance: 'https://safetwitch.drgns.space',
      instances: ['https://safetwitch.drgns.space']
    }
  };
  
  // Initialize customInstances array for all sites
  Object.keys(siteSettings).forEach(site => {
    if (!siteSettings[site].customInstances) {
      siteSettings[site].customInstances = [];
    }
  });
  
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
    const { site, enabled, preferredInstance, customInstances } = message.data;
    if (siteSettings[site]) {
      siteSettings[site].enabled = enabled;
      
      // Update custom instances if provided
      if (customInstances !== undefined) {
        siteSettings[site].customInstances = customInstances;
      }
      
      if (preferredInstance) {
        // Validate that preferredInstance is in the instances array or custom instances
        const allInstances = [
          ...(siteSettings[site].instances || []),
          ...(siteSettings[site].customInstances || [])
        ];
        
        if (allInstances.includes(preferredInstance)) {
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
