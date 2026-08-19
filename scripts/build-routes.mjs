/**
 * Emits a real static HTML file for every route.
 *
 * Why this exists: GitHub Pages has no server-side rewrites. The common
 * "404.html redirect" trick fixes the visitor experience but NOT indexing,
 * because GitHub still returns HTTP 404 for those paths. Googlebot reads the
 * status code before it runs any JavaScript, sees 404, and refuses to index
 * the page no matter what the script does afterwards.
 *
 * Writing a real file to dist/tool/qr-generator/index.html means the server
 * returns HTTP 200 with fully-formed head tags. The SPA then takes over on
 * load exactly as before.
 *
 * Each file also carries its own title, description, canonical and JSON-LD in
 * the initial HTML, so a crawler gets correct metadata without executing JS.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const DIST = resolve('dist');
const SITE_URL = 'https://dailytoolkits.com';

const { TOOLS_DATA } = await import('../assets/js/toolsData.js');
const { TOOL_CONTENT } = await import('../assets/js/toolContent.js');

const INFO_PAGES = {
  about: {
    title: 'About Us - Personal Tools Hub',
    description: 'Learn about Personal Tools Hub, a free collection of privacy-first browser tools that process your files locally without uploading them.'
  },
  privacy: {
    title: 'Privacy Policy - Personal Tools Hub',
    description: 'How Personal Tools Hub handles data. All tools run in your browser and your files are never uploaded to any server.'
  },
  terms: {
    title: 'Terms of Service - Personal Tools Hub',
    description: 'The terms governing use of Personal Tools Hub and its free browser-based utilities.'
  },
  disclaimer: {
    title: 'Disclaimer - Personal Tools Hub',
    description: 'Important information about the accuracy and intended use of the calculators and tools on Personal Tools Hub.'
  },
  contact: {
    title: 'Contact Us - Personal Tools Hub',
    description: 'Get in touch with Personal Tools Hub for feedback, feature requests, or to report an issue with any tool.'
  }
};

const shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/** Strip HTML down to readable text for the no-JS fallback. */
function toText(html) {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPage({ path, title, description, canonical, jsonLd, noscriptHtml }) {
  let html = shell;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(description)}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${esc(title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${esc(description)}" />`
  );

  if (jsonLd) {
    html = html.replace('</head>',
      `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`);
  }

  // Content inside <main> so a crawler (or a visitor without JS) sees real
  // text immediately. The app replaces this on load.
  if (noscriptHtml) {
    // The opening and closing tags are on separate lines in the shell, so the
    // pattern has to span newlines rather than assume they are adjacent.
    html = html.replace(
      /<main id="main-content"([^>]*)>[\s\S]*?<\/main>/,
      `<main id="main-content"$1>${noscriptHtml}</main>`
    );
  }

  const outPath = resolve(DIST, path, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}

let count = 0;

for (const tool of TOOLS_DATA) {
  const content = TOOL_CONTENT[tool.id];
  const canonical = `${SITE_URL}/tool/${tool.id}`;

  const sections = content?.sections || [];
  const noscript = `
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 space-y-4">
      <h1 class="text-2xl font-bold">${esc(tool.title)}</h1>
      <p>${esc(content?.intro || tool.description)}</p>
      ${sections.map(s => `<h2 class="text-lg font-bold">${esc(s.heading)}</h2><p>${esc(toText(s.body))}</p>`).join('\n      ')}
      ${(content?.tips || []).length ? `<h2 class="text-lg font-bold">Quick tips</h2><ul>${content.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${(tool.faqs || []).map(f => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('\n      ')}
    </div>`;

  const graph = [];
  if (tool.schemaJson) graph.push(tool.schemaJson);
  if (tool.faqs?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer }
      }))
    });
  }

  buildPage({
    path: `tool/${tool.id}`,
    title: tool.seoMeta?.metaTitle || `${tool.title} - Personal Tools Hub`,
    description: tool.seoMeta?.metaDescription || tool.description,
    canonical,
    jsonLd: graph.length ? (graph.length === 1 ? graph[0] : { '@context': 'https://schema.org', '@graph': graph }) : null,
    noscriptHtml: noscript
  });
  count++;
}

for (const [slug, meta] of Object.entries(INFO_PAGES)) {
  buildPage({
    path: slug,
    title: meta.title,
    description: meta.description,
    canonical: `${SITE_URL}/${slug}`,
    jsonLd: null,
    noscriptHtml: `<div class="max-w-[1100px] mx-auto px-4 sm:px-6 py-8"><h1 class="text-2xl font-bold">${esc(meta.title)}</h1><p>${esc(meta.description)}</p></div>`
  });
  count++;
}

console.log(`Emitted ${count} static route pages (HTTP 200, no JS required for metadata).`);
