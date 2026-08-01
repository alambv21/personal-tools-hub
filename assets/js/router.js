/**
 * Hash-based router for GitHub Pages compatibility
 */

export function parseHash() {
  const hash = window.location.hash.slice(1); // remove '#'
  if (!hash || hash === 'home') {
    return { page: 'home' };
  }
  if (hash.startsWith('tool/')) {
    const toolId = hash.replace('tool/', '');
    return { page: 'tool', toolId };
  }
  if (['about', 'privacy', 'terms', 'disclaimer', 'contact'].includes(hash)) {
    return { page: hash };
  }
  return { page: 'home' };
}

export function navigateTo(hashPath) {
  const current = window.location.hash.slice(1);
  if (current === hashPath) {
    // Setting the hash to its current value does not fire 'hashchange',
    // so re-render manually to avoid a "dead" click.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  window.location.hash = hashPath;
}
