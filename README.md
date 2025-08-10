**Privacy Please** is a browser extension that automatically redirects users from major websites to privacy-respecting frontend alternatives. Instead of feeding surveillance capitalism, you get clean access to content without tracking, ads, or engagement profiling.

## Enabling/disabling specific sites and changing instances (Youtube video👇🏻)

[![Watch How to Enable/Disable Sites](https://img.youtube.com/vi/fk00ZuawomI/hqdefault.jpg)](https://youtu.be/fk00ZuawomI)

---
## Comparison Before and After

![Privacy Redirect](https://github.com/DoingFedTime/PrivacyRedirect/raw/main/example.gif)

## 🔒 What It Does

When you navigate to sites like YouTube, Reddit, Twitter/X, or Google, the extension intercepts the request and redirects you to an open-source frontend. Same content, zero tracking.

Examples:
- YouTube → Invidious
- Twitter/X → Nitter
- Reddit → RedLib
- Google Search → SearXNG
- TikTok → ProxiTok

The extension supports multiple frontends for each service. You can pick your preferred instance or disable redirection for specific platforms entirely.

---

## ✅ Features

- Seamless redirection from centralized platforms to FOSS frontends
- User-configurable instance selection per service
- Enable/disable individual redirect rules from the UI
- Lightweight and fast — no telemetry, no bloat
- Open-source under AGPL-3.0

---

## 🔧 Supported Frontends

| Original Site  | Privacy Frontend | Example Instance |
|----------------|------------------|------------------|
| YouTube        | Invidious        | `https://yewtu.be` |
| Twitter/X      | Nitter           | `https://nitter.net` |
| Reddit         | RedLib           | `https://safereddit.com` |
| TikTok         | ProxiTok         | `https://tok.artemislena.eu` |
| Instagram      | Proxigram        | `https://proxigram.lunar.icu` |
| Google Search  | SearXNG          | `https://search.disroot.org` |
| Medium         | Scribe           | `https://scribe.rip` |
| Facebook       | Mobile site      | `https://m.facebook.com` |
| StackOverflow  | AnonymousOverflow| `https://code.whatever.social` |
| Tumblr         | Priviblur        | `https://pb.bloat.cat` |
| Twitch         | SafeTwitch       | `https://safetwitch.drgns.space` |
| IMDb           | LibreMDB         | `https://libremdb.iket.me` |
| Quora          | Quetre           | `https://quetre.iket.me` |
| Google Translate| Lingva Translate| `https://lingva.ml` |
| and more...

---

## 🚀 Installation

### 🦊 Firefox

Firefox Addons: https://addons.mozilla.org/en-US/firefox/addon/privacy-please/

1. Download the `.xpi` file from the [Releases](https://github.com/DoingFedTime/PrivacyRedirect/firefox/privacy-redirect.xpi) section.
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on…" and select the `manifest.json` inside the extracted folder

> Permanent installation will be available via [addons.mozilla.org](https://addons.mozilla.org/) once approved.

---

### 🧩 Chrome / Chromium
Chrome Store: https://chromewebstore.google.com/detail/privacy-please/pelceacokglomngpmedefbnlmmmpnlea

1. Download the ZIP from the [Releases](https://github.com/DoingFedTime/PrivacyRedirect/chrome/privacy-redirect-chrome-fixed.zip)
2. Extract it somewhere on your disk
3. Open `chrome://extensions` and enable **Developer Mode**
4. Click **Load Unpacked** and select the extracted folder

> Web Store submission is pending approval. Once live, users will be able to install it directly.

---

## 🛡️ Why This Matters

Most modern websites aren't just content platforms — they’re surveillance machines. Even without logging in, you’re being profiled. This extension bypasses the platform’s frontend entirely, reducing your exposure to:

- Tracking cookies
- Behavioral analytics
- Fingerprinting
- Ad targeting
- UI dark patterns

Instead of patching the surveillance model, this extension replaces it at the source.

---

## 🔊 Announcement Video

[![Watch the Announcement Video](https://img.youtube.com/vi/V5ad6y5sixU/hqdefault.jpg)](https://youtu.be/V5ad6y5sixU)



---

## 🧪 Development

Want to modify the rules or extend support to new services? All the redirection logic is stored in `rules.json`. You can edit it directly and rebuild the extension locally.




