/**
 * Google Analytics 4 loader.
 *
 * Loads nothing at all when GA_MEASUREMENT_ID is empty, so the site sets no
 * analytics cookies and makes no third-party request until you opt in.
 *
 * This app uses hash-based routing, so navigation never triggers a page load.
 * Without the listener below GA would only ever record the first page of a
 * visit, making every session look like a single pageview.
 */
import { GA_MEASUREMENT_ID } from './siteConfig.js';

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  // Send page views manually so hash routes are captured correctly.
  gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const track = () => {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.hash
    });
  };

  track();
  window.addEventListener('hashchange', track);
}
