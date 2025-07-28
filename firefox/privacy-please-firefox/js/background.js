// Updated Background Script for Privacy Please extension
// Integrates the enhanced redirection logic from redirections.js

// Import the enhanced redirection mappings
// Note: In Manifest V3, we need to use import statements differently
// We'll include the redirections.js content directly here for compatibility

// redirections.js doesn't seem to be referenced anywhere, 
// and if I rename the file and then reload the temporary add-on in Firefox
// it still works as expected
// I've renamed redirections.js to redirections.old.js and will just update this and see how it goes

// existing list of redirect lists, will make expanding this a lot easier
// https://github.com/libredirect/instances

// Map of original websites to their privacy-focused alternatives
const redirectMappings = {
  // YouTube Music to Beatbump or Invidious
  // Beatbump instances: https://github.com/snuffyDev/Beatbump
  // couldn't find any working Invidious Music instances
  // and only one working beatbump instance
  // this needs to be before YouTube otherwise it'll use the YouTube redirect
  'music.youtube.com': {
    enabled: true,
    redirectTo: 'https://beatbump.io',
    instances: [
      'https://beatbump.io'
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://beatbump.io'
  },
  
  // YouTube to Invidious
  // Invidious instances API: https://api.invidious.io/
  // JSON: https://api.invidious.io/instances.json?pretty=1&sort_by=type,users
  'youtube.com': {
    enabled: true,
    redirectTo: 'https://yewtu.be',
    instances: [
      'https://yewtu.be',
      'https://inv.nadeko.net',
      'https://invidious.nerdvpn.de',
      'https://id.420129.xyz'
      
      // redirects to https://redirect.invidious.io/ which lists instances
      //'https://invidious.snopyta.org',
      //'https://invidious.io',
      //'https://invidio.us'
      
      // invalid SSL cert
      //'https://invidious.kavin.rocks'
    ],
    customPreferredInstance: false,
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
  
  // Twitter/X to Nitter
  // Nitter instances list: https://github.com/zedeus/nitter/wiki/Instances
  // instance health status and uptime: https://status.d420.de/
  'twitter.com': {
    enabled: true,
    redirectTo: 'https://nitter.net',
    instances: [
      'https://nitter.net',
      'https://xcancel.com',
      'https://nitter.space',
      'https://nitter.privacyredirect.com',
      'https://lightbrd.com',
      'https://nitter.poast.org',
      'https://nitter.tiekoetter.com'
    ],
    customPreferredInstance: false,
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
      'https://xcancel.com',
      'https://nitter.space',
      'https://nitter.privacyredirect.com',
      'https://lightbrd.com',
      'https://nitter.poast.org',
      'https://nitter.tiekoetter.com'
    ],
    customPreferredInstance: false,
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
  
  // Reddit to RedLib/Teddit
  // RedLib instances: https://github.com/redlib-org/redlib-instances/blob/main/instances.json
  'reddit.com': {
    enabled: true,
    redirectTo: 'https://redlib.catsarch.com',
    instances: [
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
      'https://reddit.nerdvpn.de',
      'https://redlib.baczek.me',
      'https://redlib.nadeko.net',
      'https://redlib.private.coffee',
      'https://redlib.4o1x5.dev',
      'https://redlib.privacy.com.de'
      // aren't currently working, not loading properly and the instance is out of date
      //'https://libreddit.projectsegfau.lt',
      //'https://redlib.seasi.dev',
    ],
    customPreferredInstance: false,
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
  // Proxigram instances: https://codeberg.org/proxigram/proxigram/wiki/Instances
  // I think there's only one 'instance' of Imginn and it's not an open source site/project as far as I can tell
  'instagram.com': {
    enabled: true,
    redirectTo: 'https://proxigram.lunar.icu',
    instances: [
      'https://proxigram.lunar.icu',
      'https://imginn.com'
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://proxigram.lunar.icu',
    pathHandlers: {
      '/p/': (url) => {
        const postId = url.pathname.split('/p/')[1].split('/')[0];
        return `/p/${postId}`;
      }
    }
  },
  
  // TikTok to ProxiTok
  // ProxiTok instances: https://github.com/pablouser1/ProxiTok/wiki/Public-instances
  'tiktok.com': {
    enabled: true,
    redirectTo: 'https://tok.artemislena.eu',
    instances: [
      'https://tok.artemislena.eu',
      'https://proxitok.pussthecat.org',
      'https://tok.adminforge.de',
      'https://cringe.whatever.social',
      'https://proxitok.lunar.icu',
      'https://proxitok.belloworld.it'
      // 502 Bad Gateway
      //'https://proxitok.pabloferreiro.es',
      //'https://tok.habedieeh.re',
      //'https://proxitok.privacy.com.de',
      //'https://tiktok.wpme.pl'
      
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://tok.artemislena.eu',
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
  
  // Google Translate to Lingva Translate
  // needs to be before Google so it doesn't get caught by it's redirect
  // Lingva instances: https://github.com/thedaviddelta/lingva-translate
  'translate.google.com': {
    enabled: true,
    redirectTo: 'https://lingva.ml',
    instances: [
      'https://lingva.ml',
      'https://lingva.garudalinux.org',
      'https://translate.plausibility.cloud',
      'https://lingva.lunar.icu',
      'https://translate.projectsegfau.lt'
    ],
    customPreferredInstance: false,
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
  
  // Google Search to SearXNG/LibreY
  // SearXNG instances: https://searx.space - I've only added a few as there were 76 up when adding
  // LibreY instances: https://search.liv.town/instances.php
  //                   https://github.com/Ahwxorg/LibreY/blob/main/instances.json
  'google.com': {
    enabled: true,
    redirectTo: 'https://search.disroot.org',
    instances: [
      // SearXNG
      'https://search.disroot.org',
      'https://searx.be',
      'https://priv.au',
      'https://search.rhscz.eu',
      'https://searx.tuxcloud.net',
      // LibreY
      'https://search.funami.tech',
      'https://librey.sny.sh',
      'https://search.liv.town'
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://search.disroot.org',
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
  
  // Medium to Scribe
  // Scribe instances: https://git.sr.ht/~edwardloveall/scribe/tree/HEAD/docs/instances.md
  'medium.com': {
    enabled: true,
    redirectTo: 'https://scribe.rip',
    instances: [
      'https://scribe.rip',
      'https://scribe.nixnet.services',
      'https://scribe.rawbit.ninja',
      'https://m.opnxng.com',
      'https://scribe.privacyredirect.com'
      // down for maintenance at the time of adding
      //'https://scribe.r4fo.com'
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://scribe.rip',
    pathHandlers: {
      '/': (url) => {
        return url.pathname;
      }
    }
  },
  
  // Imgur to Rimgo
  // Rimgo instances: 
  // https://codeberg.org/rimgo/instances
  // https://rimgo.codeberg.page
  // https://rimgo.codeberg.page/api.json
  'imgur.com': {
    enabled: true,
    redirectTo: 'https://r.opnxng.com',
    instances: [
      'https://r.opnxng.com',
      'https://imgur.artemislena.eu',
      'https://rimgo.totaldarkness.net',
      'https://rimgo.bloat.cat',
      'https://rimgo.pussthecat.org'
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://r.opnxng.com',
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
  // Quetre instances: https://github.com/zyachel/quetre/blob/main/instances.json
  'quora.com': {
    enabled: true,
    redirectTo: 'https://quetre.iket.me',
    instances: [
      'https://quetre.iket.me',
      'https://quetre.blackdrgn.nl',
      'https://q.opnxng.com',
      'https://quetre.canine.tools',
      'https://qt.bloat.cat',
      'https://quetre.pussthecat.org'
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://quetre.iket.me'
  },
  
  // Facebook (limited alternatives available)
  'facebook.com': {
    enabled: true,
    redirectTo: 'https://m.facebook.com', // Mobile version with less tracking
    instances: [
      'https://m.facebook.com'
    ],
    customPreferredInstance: false,
    preferredInstance: 'https://m.facebook.com'
  },
  
  // IMDb to LibreMDb
  // LibreMDb instances: https://github.com/zyachel/libremdb
  // didn't test/add all of them
  'imdb.com': {
    enabled: true,
    redirectTo: 'https://libremdb.iket.me',
    instances: [
      'https://libremdb.iket.me',
      'https://d.opnxng.com',
      'https://lmdb.bloat.cat',
      'https://libremdb.catsarch.com',
      'https://imdb.nerdvpn.de',
      'https://libremdb.canine.tools'
    ],
    customPreferredInstance: false,
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
              redirectMappings[site].customPreferredInstance = settings.customPreferredInstance;
            }
          }
        }
      }
      resolve();
    });
  });
}

// Save settings to storage
function saveSettings(){
  const settingsToSave = {};
  for (const [site, settings] of Object.entries(redirectMappings)) {
    settingsToSave[site] = {
      enabled: settings.enabled,
      customPreferredInstance: settings.customPreferredInstance,
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
    const { site, enabled, preferredInstance, customPreferredInstance } = message.data;
    // console.log(message.data)
    if (redirectMappings[site]) {
      redirectMappings[site].enabled = enabled;
      if (preferredInstance) {
        redirectMappings[site].preferredInstance = preferredInstance;
        redirectMappings[site].customPreferredInstance = customPreferredInstance;
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
