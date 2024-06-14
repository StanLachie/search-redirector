function loadSearchEngines(callback) {
  chrome.storage.local.get("searchEngines", (data) => {
    const searchEngines = data.searchEngines || [];
    callback(searchEngines);
  });
}

chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    const url = new URL(details.url);
    if (
      url.protocol === "https:" &&
      url.hostname === "www.google.com" &&
      url.pathname === "/search"
    ) {
      const params = new URLSearchParams(url.search);
      const query = params.get("q");

      if (query) {
        loadSearchEngines((searchEngines) => {
          let redirectUrl;
          for (const engine of searchEngines) {
            for (const suffix of engine.suffixes) {
              if (query.endsWith(`!${suffix}`)) {
                redirectUrl = `${engine.url}${query
                  .slice(0, -suffix.length - 1)
                  .trim()}`;
                break;
              }
            }
            if (redirectUrl) break;
          }

          if (redirectUrl) {
            chrome.tabs.update(details.tabId, { url: redirectUrl });
          }
        });
      }
    }
  },
  { url: [{ urlMatches: "https://www.google.com/search*" }] }
);
