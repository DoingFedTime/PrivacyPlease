// Enhanced redirection logic for Privacy Please extension

// Map of original websites to their privacy-focused alternatives
// This is an expanded and refined version of the redirectMappings in background.js
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
    redirectTo: 'https://libredd.it',
    instances: [
      'https://libredd.it',
      'https://libreddit.spike.codes',
      'https://libreddit.kavin.rocks',
      'https://teddit.net',
      'https://teddit.ggc-project.de',
      'https://reddit.lol'
    ],
    preferredInstance: 'https://libredd.it',
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

// Export the enhanced redirection mappings
export { redirectMappings };
