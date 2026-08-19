/**
 * Path-based router.
 *
 * Routes look like real URLs (/tool/qr-generator, /about) rather than hash
 * fragments. This matters for search: Google does not treat anything after a
 * "#" as a separate page, so under the old hash router all 13 tools collapsed
 * into a single indexable URL.
 *
 * GitHub Pages has no server-side rewrite support, so a deep link like
 * /tool/qr-generator would normally 404 on a hard refresh. The standard
 * workaround is a 404.html that captures the attempted path and hands it back
 * to index.html, which is what restoreRedirectedPath() below completes.
 */

const INFO_PAGES = ['about', 'privacy', 'terms', 'disclaimer', 'contact'];

/**
 * GitHub Pages serves 404.html for unknown paths. That page stores the
 * requested path and redirects to "/", so the app has to put the URL back
 * before the first render. Runs once, before anything reads the location.
 */
export function restoreRedirectedPath() {
  try {
    const stored = sessionStorage.getItem('pth_redirect_path');
    if (stored) {
      sessionStorage.removeItem('pth_redirect_path');
      window.history.replaceState(null, '', stored);
    }
  } catch {
    // sessionStorage can be unavailable in private modes; falling through
    // just means the visitor lands on the homepage instead.
  }
}

export function parsePath() {
  let path = window.location.pathname;

  // Normalise: strip a trailing slash so /about/ and /about are the same route.
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  if (path === '' || path === '/' || path === '/index.html') {
    return { page: 'home' };
  }

  const toolMatch = path.match(/^\/tool\/([a-z0-9-]+)$/i);
  if (toolMatch) {
    return { page: 'tool', toolId: toolMatch[1].toLowerCase() };
  }

  const infoMatch = path.match(/^\/([a-z-]+)$/i);
  if (infoMatch && INFO_PAGES.includes(infoMatch[1].toLowerCase())) {
    return { page: infoMatch[1].toLowerCase() };
  }

  return { page: 'home' };
}

/**
 * Navigate without a full page load.
 * Accepts 'home', 'about', or 'tool/qr-generator'.
 */
export function navigateTo(route) {
  const path = routeToPath(route);

  if (window.location.pathname === path) {
    // Same route: pushState would not fire a popstate, so re-render directly
    // rather than leaving the click feeling dead.
    window.dispatchEvent(new PopStateEvent('popstate'));
    return;
  }

  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function routeToPath(route) {
  const clean = String(route || '').replace(/^[#/]+/, '');
  if (!clean || clean === 'home') return '/';
  return `/${clean}`;
}

/** Absolute URL for canonical tags and sharing. */
export function absoluteUrl(route, siteUrl) {
  const path = routeToPath(route);
  return path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;
}
