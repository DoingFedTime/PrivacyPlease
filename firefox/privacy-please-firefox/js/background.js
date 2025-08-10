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
    redirectTo: 'https://safereddit.com',
    instances: [
      'https://safereddit.com',
      'https://eu.safereddit.com',
      'https://l.opnxng.com',
      'https://redlib.perennialte.ch',
      'https://redlib.tux.pizza',
      'https://libreddit.privacydev.net',
      'https://rl.bloat.cat',
      'https://redlib.privacyredirect.com',
      'https://reddit.nerdvpn.de',
      'https://redlib.4o1x5.dev',
      'https://reddit.adminforge.de',
      'https://rl.blitzw.in',
      'https://reddit.rtrace.io',
      'https://lr.ptr.moe',
      'https://redlib.orangenet.cc',
      'https://redlib.privadency.com',
      'https://redlib.minihoot.site'
    ],
    preferredInstance: 'https://safereddit.com',
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
  },
  
  // StackOverflow to AnonymousOverflow
  'stackoverflow.com': {
    enabled: true,
    redirectTo: 'https://code.whatever.social',
    instances: [
      'https://code.whatever.social'
    ],
    preferredInstance: 'https://code.whatever.social',
    pathHandlers: {
      '/questions/': (url) => {
        return url.pathname + url.search;
      }
    }
  },
  
  // Tumblr to Priviblur
  'tumblr.com': {
    enabled: true,
    redirectTo: 'https://pb.bloat.cat',
    instances: [
      'https://pb.bloat.cat',
      'https://tb.opnxng.com',
      'https://priviblur.pussthecat.org',
      'https://priviblur.thebunny.zone',
      'https://priviblur.canine.tools',
      'https://pb.cleberg.net',
      'https://tumblr.nerdvpn.de'
    ],
    preferredInstance: 'https://pb.bloat.cat',
    pathHandlers: {
      '': (url) => {
        // Handle blog.tumblr.com patterns
        const hostname = url.hostname;
        if (hostname !== 'tumblr.com' && hostname !== 'www.tumblr.com') {
          const blog = hostname.replace('.tumblr.com', '');
          return `/${blog}` + url.pathname + url.search;
        }
        return url.pathname + url.search;
      }
    }
  },
  
  // Twitch to SafeTwitch
  'twitch.tv': {
    enabled: true,
    redirectTo: 'https://safetwitch.drgns.space',
    instances: [
      'https://safetwitch.drgns.space'
    ],
    preferredInstance: 'https://safetwitch.drgns.space',
    pathHandlers: {
      '/': (url) => {
        return url.pathname + url.search;
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
    if (settings.enabled && (hostname === site || hostname === `www.${site}`)) {
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
