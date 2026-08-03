/**
 * Generates the static guide pages into public/guides/.
 *
 * These are deliberately plain, self-contained HTML files rather than routes
 * in the single-page app. The app uses hash-based routing (#tool/...), and
 * search engines do not treat hash fragments as separate indexable pages.
 * Real files at real paths are the only way to get these articles indexed.
 *
 * Run with:  node scripts/build-guides.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { GUIDES, SITE_URL } from './guides-content.mjs';

const OUT_DIR = new URL('../public/guides/', import.meta.url);
mkdirSync(OUT_DIR, { recursive: true });

const STYLES = `
:root{--bg:#ffffff;--fg:#0f172a;--muted:#64748b;--line:#e2e8f0;--accent:#2563eb;--card:#f8fafc}
@media(prefers-color-scheme:dark){:root{--bg:#020617;--fg:#e2e8f0;--muted:#94a3b8;--line:#1e293b;--accent:#60a5fa;--card:#0f172a}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
header.site{border-bottom:1px solid var(--line);padding:14px 0;position:sticky;top:0;background:var(--bg);z-index:10}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{font-weight:800;color:var(--fg);text-decoration:none;font-size:15px;letter-spacing:-.01em}
.brand span{color:var(--accent)}
.nav a{color:var(--muted);text-decoration:none;font-size:13px;font-weight:600;margin-left:16px}
.nav a:hover{color:var(--accent)}
main{padding:40px 0 56px}
h1{font-size:clamp(26px,5vw,36px);line-height:1.22;letter-spacing:-.02em;margin:0 0 14px}
h2{font-size:20px;line-height:1.3;letter-spacing:-.01em;margin:36px 0 12px}
p{margin:0 0 16px}
.lead{font-size:18px;color:var(--muted)}
ul{margin:0 0 16px;padding-left:22px}
li{margin-bottom:7px}
.meta{color:var(--muted);font-size:13px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--line)}
.cta{margin:32px 0;padding:18px 20px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
.cta p{margin:0 0 10px;font-size:14px;color:var(--muted)}
.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:9px 16px;border-radius:9px}
.related{margin-top:44px;padding-top:24px;border-top:1px solid var(--line)}
.related h2{margin-top:0;font-size:16px}
.related ul{list-style:none;padding:0}
.related a{color:var(--accent);text-decoration:none;font-weight:600;font-size:14px}
.related a:hover{text-decoration:underline}
footer.site{border-top:1px solid var(--line);padding:22px 0;color:var(--muted);font-size:13px}
footer.site a{color:var(--muted)}
.disclaimer{margin-top:28px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:var(--card);font-size:13px;color:var(--muted)}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em;background:var(--card);border:1px solid var(--line);border-radius:5px;padding:1px 5px}
pre{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow-x:auto;margin:0 0 16px}
pre code{background:none;border:none;padding:0;font-size:13px;line-height:1.5}
ol{margin:0 0 16px;padding-left:22px}
`;

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function shell({ title, description, keywords, canonical, jsonLd, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="keywords" content="${esc(keywords)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${canonical}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/svg+xml" href="${SITE_URL}/assets/logo/icon.svg" />
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${STYLES}</style>
</head>
<body>
<header class="site">
  <div class="wrap">
    <a class="brand" href="${SITE_URL}/">Personal <span>Tools Hub</span></a>
    <nav class="nav">
      <a href="${SITE_URL}/">All Tools</a>
      <a href="${SITE_URL}/guides/">Guides</a>
    </nav>
  </div>
</header>
<main class="wrap">
${bodyHtml}
</main>
<footer class="site">
  <div class="wrap">
    &copy; ${new Date().getFullYear()} Personal Tools Hub &middot;
    <a href="${SITE_URL}/">Tools</a> &middot;
    <a href="${SITE_URL}/#privacy">Privacy</a> &middot;
    <a href="${SITE_URL}/#terms">Terms</a>
  </div>
</footer>
</body>
</html>`;
}

// --- individual guide pages ---
for (const g of GUIDES) {
  const canonical = `${SITE_URL}/guides/${g.slug}.html`;
  const related = GUIDES.filter(o => o.slug !== g.slug).slice(0, 3);

  const isHealth = g.slug.includes('bmi');

  const bodyHtml = `
<article>
  <h1>${esc(g.title)}</h1>
  <p class="meta">Updated ${g.updated} &middot; ${g.readMinutes} min read</p>
  ${g.body.trim()}
  ${isHealth ? `<p class="disclaimer">This article is general information, not medical advice. For guidance about your own health, speak to a qualified healthcare professional who can consider your full history.</p>` : ''}
  <div class="cta">
    <p>Try it yourself &mdash; free, and everything runs in your browser.</p>
    <a class="btn" href="${SITE_URL}/#tool/${g.tool.id}">Open ${esc(g.tool.label)}</a>
  </div>
</article>
<section class="related">
  <h2>More guides</h2>
  <ul>
    ${related.map(r => `<li><a href="${SITE_URL}/guides/${r.slug}.html">${esc(r.title)}</a></li>`).join('\n    ')}
  </ul>
</section>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.description,
    dateModified: g.updated,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    publisher: { '@type': 'Organization', name: 'Personal Tools Hub' }
  };

  writeFileSync(new URL(`${g.slug}.html`, OUT_DIR),
    shell({ title: g.title, description: g.description, keywords: g.keywords, canonical, jsonLd, bodyHtml }));
}

// --- guides index ---
const indexCanonical = `${SITE_URL}/guides/`;
const indexBody = `
<h1>Guides</h1>
<p class="lead">Practical, jargon-free explanations of the things our tools help with &mdash; image formats, PDFs, passwords, and more.</p>
<section class="related" style="border-top:none;padding-top:8px;margin-top:24px">
  <ul>
    ${GUIDES.map(g => `<li style="margin-bottom:18px">
      <a href="${SITE_URL}/guides/${g.slug}.html" style="font-size:16px">${esc(g.title)}</a>
      <p style="margin:4px 0 0;font-size:14px;color:var(--muted)">${esc(g.description)}</p>
    </li>`).join('\n    ')}
  </ul>
</section>`;

writeFileSync(new URL('index.html', OUT_DIR), shell({
  title: 'Guides - Personal Tools Hub',
  description: 'Practical guides on image compression, PDF conversion, password security, and more from Personal Tools Hub.',
  keywords: 'image compression guide, pdf guide, password security guide, online tools guides',
  canonical: indexCanonical,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guides',
    url: indexCanonical
  },
  bodyHtml: indexBody
}));

// --- sitemap, now that we have real indexable URLs ---
const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0', freq: 'weekly' },
  { loc: indexCanonical, priority: '0.8', freq: 'monthly' },
  ...GUIDES.map(g => ({ loc: `${SITE_URL}/guides/${g.slug}.html`, priority: '0.7', freq: 'monthly', lastmod: g.updated }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), sitemap);

console.log(`Generated ${GUIDES.length} guides + index + sitemap (${urls.length} URLs).`);
