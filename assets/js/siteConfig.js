/**
 * Central site configuration.
 *
 * Everything that changes when you move to a custom domain lives here.
 * When you buy a domain later, edit SITE_URL below, update the same URL in
 * public/robots.txt, public/sitemap.xml, and the meta tags in index.html,
 * and you are done.
 */

export const SITE_NAME = 'Personal Tools Hub';

// No trailing slash.
export const SITE_URL = 'https://alambv21.github.io/personal-tools-hub';

// Shown on the Contact page and in the footer. Must be an address you
// actually monitor: ad networks and search engines both check that a site
// has a reachable owner.
//
// >>> REPLACE THIS before applying to AdSense or Adsterra. <<<
// The Contact page shows a visible warning while this is left unset.
export const CONTACT_EMAIL = 'alambv21@gmail.com';

export const CONTACT_EMAIL_IS_PLACEHOLDER = CONTACT_EMAIL.includes('alambv21@gmail.com');

export const SITE_TAGLINE = 'All Your Everyday Tools in One Place';
