// Updated Background Script for Privacy Please extension
// Integrates the enhanced redirection logic from redirections.js

// Import the enhanced redirection mappings
// Note: In Manifest V3, we need to use import statements differently
// We'll include the redirections.js content directly here for compatibility

// Map of original websites to their privacy-focused alternatives
const redirectMappings = {
  // YouTube to Invidious
  'youtube.com': {
    enabled: true,
    redirectTo: 'https://invidious.io',
    instances: [
      'https://yewtu.be',
      'https://invidious.snopyta.org',
      'https://invidio.us',
      'https://inv.riverside.rocks',
      'https://invidious.kavin.rocks'
    ],
    preferredInstance: 'https://yewtu.be',
    pathHandlers: {
      '/watch': (url) => {
        const videoId = url.searchParams.get('v');
        if (videoId) {
          return `/watch?v=${videoId}`;
        }
        return url.pathname + url.search;
      },
      '/channel/': (url) => {
        const channelId = url.pathname.split('/channel/')[1].split('/')[0];
        return `/channel/${channelId}`;
      },
      '/user/': (url) => {
        const username = url.pathname.split('/user/')[1].split('/')[0];
        return `/user/${username}`;
      },
      '/playlist': (url) => {
        const listId = url.searchParams.get('list');
        if (listId) {
          return `/playlist?list=${listId}`;
        }
        return url.pathname + url.search;
      },
      '/c/': (url) => {
        const channelName = url.pathname.split('/c/')[1].split('/')[0];
        return `/c/${channelName}`;
      }
    }
  },
  
  // YouTube Music to Beatbump or Invidious
  'music.youtube.com': {
    enabled: true,
    redirectTo: 'https://beatbump.ml',
    instances: [
      'https://beatbump.ml',
      'https://music.invidious.io',
      'https://music.yewtu.be'
    ],
    preferredInstance: 'https://beatbump.ml'
  },
  
  // Twitter/X to Nitter
  'twitter.com': {
    enabled: true,
    redirectTo: 'https://nitter.net',
    instances: [
      'https://nitter.net',
      'https://nitter.42l.fr',
      'https://nitter.pussthecat.org',
      'https://nitter.fdn.fr',
      'https://nitter.1d4.us'
    ],
    preferredInstance: 'https://nitter.net',
    pathHandlers: {
      '/search': (url) => {
        const query = url.searchParams.get('q');
        if (query) {
          return `/search?q=${encodeURIComponent(query)}`;
        }
        return url.pathname + url.search;
      }
    }
  },
  
  // X.com to Nitter (same as Twitter)
  'x.com': {
    enabled: true,
    redirectTo: 'https://nitter.net',
    instances: [
      'https://nitter.net',
      'https://nitter.42l.fr',
      'https://nitter.pussthecat.org',
      'https://nitter.fdn.fr',
      'https://nitter.1d4.us'
    ],
    preferredInstance: 'https://nitter.net',
    pathHandlers: {
      '/search': (url) => {
        const query = url.searchParams.get('q');
        if (query) {
          return `/search?q=${encodeURIComponent(query)}`;
        }
        return url.pathname + url.search;
      }
    }
  },
  
  // Reddit to Libreddit/Teddit/Redlib
'reddit.com': {
    enabled: true,
    redirectTo: 'https://redlib.catsarch.com',
    instances: [
      'https://libreddit.projectsegfau.lt',
      'https://redlib.catsarch.com',
      'https://redlib.perennialte.ch',
      'https://redlib.tux.pizza',
      'https://libreddit.privacydev.net',
      'https://rl.bloat.cat',
      'https://redlib.r4fo.com',
      'https://reddit.owo.si',
      'https://redlib.ducks.party',
      'https://red.ngn.tf',
      'https://red.artemislena.eu',
      'https://r.darrennathanael.com',
      'https://redlib.kittywi.re',
      'https://redlib.privacyredirect.com',
      'https://redlib.seasi.dev',
      'https://reddit.nerdvpn.de',
      'https://redlib.baczek.me',
      'https://redlib.nadeko.net',
      'https://redlib.private.coffee',
      'https://redlib.4o1x5.dev',
      'https://redlib.privacy.com.de',
      'https://teddit.net',
      'https://teddit.ggc-project.de',
      'https://reddit.lol'
    ],
    preferredInstance: 'https://redlib.catsarch.com',
    pathHandlers: {
      '/r/': (url) => {
        return url.pathname + url.search;
      },
      '/user/': (url) => {
        return url.pathname + url.search;
      }
    }
  },
  
  // Instagram to Proxigram/Imginn
  'instagram.com': {
    enabled: true,
    redirectTo: 'https://proxigram.herokuapp.com',
    instances: [
      'https://proxigram.herokuapp.com',
      'https://imginn.com'
    ],
    preferredInstance: 'https://proxigram.herokuapp.com',
    pathHandlers: {
      '/p/': (url) => {
        const postId = url.pathname.split('/p/')[1].split('/')[0];
        return `/p/${postId}`;
      }
    }
  },
  
  // TikTok to ProxiTok
  'tiktok.com': {
    enabled: true,
    redirectTo: 'https://proxitok.herokuapp.com',
    instances: [
      'https://proxitok.herokuapp.com',
      'https://proxitok.pussthecat.org',
      'https://proxitok.privacydev.net'
    ],
    preferredInstance: 'https://proxitok.herokuapp.com',
    pathHandlers: {
      '/@': (url) => {
        const username = url.pathname.split('/')[1];
        return `/${username}`;
      },
      '/video/': (url) => {
        const videoId = url.pathname.split('/video/')[1].split('/')[0];
        return `/video/${videoId}`;
      }
    }
  },
  
  // Google Search to SearXNG/LibreY
  'google.com': {
    enabled: true,
    redirectTo: 'https://searx.space',
    instances: [
      'https://searx.space',
      'https://search.disroot.org',
      'https://search.privacytools.io'
    ],
    preferredInstance: 'https://searx.space',
    pathHandlers: {
      '/search': (url) => {
        const query = url.searchParams.get('q');
        if (query) {
          return `/search?q=${encodeURIComponent(query)}`;
        }
        return '/';
      }
    }
  },
  
  // Google Translate to Lingva Translate
  'translate.google.com': {
    enabled: true,
    redirectTo: 'https://lingva.ml',
    instances: [
      'https://lingva.ml',
      'https://lingva.pussthecat.org'
    ],
    preferredInstance: 'https://lingva.ml',
    pathHandlers: {
      '/': (url) => {
        const source = url.searchParams.get('sl') || 'auto';
        const target = url.searchParams.get('tl') || 'en';
        const text = url.searchParams.get('text');
        if (text) {
          return `/${source}/${target}/${encodeURIComponent(text)}`;
        }
        return `/${source}/${target}`;
      }
    }
  },
  
  // Medium to Scribe
  'medium.com': {
    enabled: true,
    redirectTo: 'https://scribe.rip',
    instances: [
      'https://scribe.rip',
      'https://scribe.nixnet.services'
    ],
    preferredInstance: 'https://scribe.rip',
    pathHandlers: {
      '/': (url) => {
        return url.pathname;
      }
    }
  },
  
  // Imgur to Rimgo
  'imgur.com': {
    enabled: true,
    redirectTo: 'https://rimgo.bus-hit.me',
    instances: [
      'https://rimgo.bus-hit.me',
      'https://rimgo.pussthecat.org',
      'https://rimgo.totaldarkness.net'
    ],
    preferredInstance: 'https://rimgo.bus-hit.me',
    pathHandlers: {
      '/a/': (url) => {
        const albumId = url.pathname.split('/a/')[1].split('/')[0];
        return `/a/${albumId}`;
      },
      '/gallery/': (url) => {
        const galleryId = url.pathname.split('/gallery/')[1].split('/')[0];
        return `/gallery/${galleryId}`;
      }
    }
  },
  
  // Quora to Quetre
  'quora.com': {
    enabled: true,
    redirectTo: 'https://quetre.iket.me',
    instances: [
      'https://quetre.iket.me',
      'https://quetre.pussthecat.org'
    ],
    preferredInstance: 'https://quetre.iket.me'
  },
  
  // Facebook (limited alternatives available)
  'facebook.com': {
    enabled: true,
    redirectTo: 'https://m.facebook.com', // Mobile version with less tracking
    instances: [
      'https://m.facebook.com'
    ],
    preferredInstance: 'https://m.facebook.com'
  },
  
  // IMDb to LibreMDb
  'imdb.com': {
    enabled: true,
    redirectTo: 'https://libremdb.iket.me',
    instances: [
      'https://libremdb.iket.me'
    ],
    preferredInstance: 'https://libremdb.iket.me',
    pathHandlers: {
      '/title/': (url) => {
        const titleId = url.pathname.split('/title/')[1].split('/')[0];
        return `/title/${titleId}`;
      },
      '/name/': (url) => {
        const nameId = url.pathname.split('/name/')[1].split('/')[0];
        return `/name/${nameId}`;
      }
    }
  }
};

// Load user settings from storage
function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('redirectSettings', (result) => {
      if (result.redirectSettings) {
        // Merge saved settings with default settings
        for (const [site, settings] of Object.entries(result.redirectSettings)) {
          if (redirectMappings[site]) {
            redirectMappings[site].enabled = settings.enabled;
            if (settings.preferredInstance) {
              redirectMappings[site].preferredInstance = settings.preferredInstance;
            }
          }
        }
      }
      resolve();
    });
  });
}

// Save settings to storage
function saveSettings() {
  const settingsToSave = {};
  for (const [site, settings] of Object.entries(redirectMappings)) {
    settingsToSave[site] = {
      enabled: settings.enabled,
      preferredInstance: settings.preferredInstance
    };
  }
  chrome.storage.sync.set({ redirectSettings: settingsToSave });
}

// Initialize extension
async function initialize() {
  await loadSettings();
  
  // Set up webRequest listener for redirection
  chrome.webRequest.onBeforeRequest.addListener(
    handleRedirect,
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
}

// Handle redirection logic
function handleRedirect(details) {
  const url = new URL(details.url);
  const hostname = url.hostname;
  
  // Check each mapping to see if we should redirect
  for (const [site, settings] of Object.entries(redirectMappings)) {
    if (settings.enabled && hostname.includes(site)) {
      // Create the redirect URL
      const redirectUrl = createRedirectUrl(site, url);
      if (redirectUrl) {
        return { redirectUrl };
      }
    }
  }
  
  // No redirect needed
  return { cancel: false };
}

// Create the redirect URL based on the original URL
function createRedirectUrl(site, originalUrl) {
  const settings = redirectMappings[site];
  const preferredInstance = settings.preferredInstance;
  
  // If we have path handlers for this site, use them
  if (settings.pathHandlers) {
    for (const [pathPrefix, handler] of Object.entries(settings.pathHandlers)) {
      if (originalUrl.pathname.includes(pathPrefix)) {
        try {
          const newPath = handler(originalUrl);
          if (newPath) {
            // If the handler returns a full URL, use it directly
            if (newPath.startsWith('http')) {
              return newPath;
            }
            // Otherwise, combine with the preferred instance
            return `${preferredInstance}${newPath}`;
          }
        } catch (error) {
          console.error(`Error in path handler for ${site}${pathPrefix}:`, error);
        }
      }
    }
  }
  
  // Default fallback: just append the path and search to the preferred instance
  return `${preferredInstance}${originalUrl.pathname}${originalUrl.search}`;
}

// Listen for messages from popup or options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSettings') {
    sendResponse({ settings: redirectMappings });
  } else if (message.action === 'updateSettings') {
    const { site, enabled, preferredInstance } = message.data;
    if (redirectMappings[site]) {
      redirectMappings[site].enabled = enabled;
      if (preferredInstance) {
        redirectMappings[site].preferredInstance = preferredInstance;
      }
      saveSettings();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Site not found in mappings' });
    }
  } else if (message.action === 'resetSettings') {
    initialize();
    sendResponse({ success: true });
  }
  return true;
});

// Initialize the extension when loaded
initialize();
