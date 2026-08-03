/**
 * Ad slot management.
 *
 * ============================================================================
 * HOW TO TURN ADS ON
 * ============================================================================
 * 1. Get approved by the network (Adsterra or Google AdSense).
 * 2. Paste the snippet they give you into the matching entry in AD_SLOTS below
 *    and set `enabled: true`.
 * 3. For AdSense you must ALSO paste the site-level script into <head> in
 *    index.html, and create public/ads.txt with the line AdSense provides.
 *
 * While a slot is disabled nothing renders at all: no empty boxes, no layout
 * gaps. This matters because shipping visible blank ad placeholders looks
 * broken to visitors and to reviewers.
 * ============================================================================
 *
 * Placement notes worth respecting:
 * - Never place an ad inside a tool's working area. Accidental clicks get
 *   filtered as invalid traffic (so you are not paid for them) and repeated
 *   accidental clicks can get an account suspended.
 * - Keep clear space between an ad and any button or input.
 * - If you run AdSense and Adsterra together, stick to Adsterra's banner and
 *   native formats. Popunder and social-bar formats can breach AdSense's
 *   policies on disruptive advertising.
 */

export const AD_SLOTS = {
  // Sits between the tool grid and the guides section on the homepage.
  // Adsterra Native Banner, unit 30554818.
  //
  // NOTE: this snippet creates a div with a fixed id. Do NOT reuse the same
  // snippet in another slot, or two elements would share one id and only one
  // would ever fill. Each slot needs its own ad unit code from Adsterra.
  //
  // Backticks are used for `html` because the snippet contains double quotes.
  homeBelowTools: {
    enabled: true,
    label: 'Advertisement',
    html: `<script async="async" data-cfasync="false" src="https://pl30655317.effectivecpmnetwork.com/dee1a5890e2f9cb8a1343959fd87a990/invoke.js"></script>
<div id="container-dee1a5890e2f9cb8a1343959fd87a990"></div>`
  },

  // Sits below the tool interface on a tool page, above the FAQ block.
  // Paste a DIFFERENT Adsterra ad unit code here (e.g. one of the Banner
  // units) and set enabled to true. Reusing the homepage snippet will not
  // work because its container id would be duplicated.
  toolBelowContent: {
    enabled: false,
    label: 'Advertisement',
    html: ''
  }
};

/**
 * Returns markup for a slot, or an empty string when it is not configured.
 * Ads are labelled because both networks' policies require that ads are
 * clearly distinguishable from site content.
 */
export function adSlotHtml(slotName) {
  const slot = AD_SLOTS[slotName];
  if (!slot || !slot.enabled || !slot.html.trim()) return '';

  return `
    <div class="my-10" data-ad-slot="${slotName}">
      <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-600 text-center mb-2">
        ${slot.label}
      </p>
      <div class="flex justify-center overflow-hidden">${slot.html}</div>
    </div>
  `;
}

/**
 * Ad networks ship <script> tags, and scripts inserted via innerHTML do not
 * execute. This re-creates them so they run after the view renders.
 * Call once after injecting markup that contains ad slots.
 */
export function activateAdSlots(root = document) {
  root.querySelectorAll('[data-ad-slot]').forEach(container => {
    if (container.dataset.adActivated === 'true') return;
    container.dataset.adActivated = 'true';

    container.querySelectorAll('script').forEach(oldScript => {
      const s = document.createElement('script');
      for (const attr of oldScript.attributes) s.setAttribute(attr.name, attr.value);
      s.textContent = oldScript.textContent;
      oldScript.replaceWith(s);
    });
  });
}
