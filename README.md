# Personal Tools Hub

**All Your Everyday Tools in One Place.** A fast, free, privacy-first collection of 13 browser-based utilities. Everything runs 100% client-side — no signup, no server, no data ever leaves the browser.

**Live site:** https://alambv21.github.io/personal-tools-hub/

## Tools

| Tool | What it does |
|---|---|
| QR Code Generator | URL, text, phone, email, SMS, and WiFi QR codes with colour and error-correction control |
| Image Compressor & Resizer | Resize and compress JPG/PNG/WebP with live before/after size comparison |
| PDF Toolkit | Merge, split, rotate, images→PDF, PDF→Word, Word→PDF, Excel→PDF, and add text/whiteout |
| Resume / CV Builder | Three templates, live preview, export to PDF or editable Word |
| Password Generator | Length and character-set control with strength feedback |
| Word & Character Counter | Words, characters, sentences, paragraphs, reading time |
| Text Case Converter | Upper, lower, title, sentence, camel, snake, kebab |
| JSON Formatter | Prettify, minify, and validate with clear error reporting |
| Base64 Encoder / Decoder | UTF-8 safe encoding and decoding |
| Unit Converter | Length, weight, temperature, volume, speed, data storage |
| Age Calculator | Exact age plus milestones |
| BMI & Ideal Weight | WHO categories with clinical reference formulas |
| Hash Generator & Diff | SHA-256 / SHA-1 digests and line-by-line text comparison |

## Guides

Static, indexable articles live in `public/guides/` and are published at `/guides/`. They are generated from `scripts/guides-content.mjs`:

```bash
node scripts/build-guides.mjs   # regenerates the guide pages and sitemap.xml
```

These are deliberately real HTML files rather than routes in the app. The app uses hash-based routing (`#tool/...`), and search engines do not index hash fragments as separate pages, so real files are the only way to get these articles crawled.

## Tech Stack

- **Vanilla JavaScript** (ES Modules) — no framework
- **Vite 6** — dev server and production bundler
- **Tailwind CSS v4** via `@tailwindcss/vite` (CSS-first config; note the class-based `dark` variant declared in `assets/css/main.css`)
- Hash-based router so the SPA works on GitHub Pages with zero server config
- Per-tool dynamic `import()` so heavy libraries load only when their tool is opened

Libraries, all loaded lazily: `qrcode`, `pdf-lib`, `pdfjs-dist`, `mammoth`, `exceljs`, `jspdf`, `docx`.

## Project Structure

```
index.html                      App shell (header, footer, #main-content mount point)
assets/css/main.css             Tailwind entry, custom utilities, dark-mode variant
assets/js/app.js                Bootstrap, routing glue, view rendering
assets/js/siteConfig.js         SITE_URL and CONTACT_EMAIL — edit here when changing domain
assets/js/ads.js                Ad slot definitions (disabled by default)
assets/js/router.js             Hash parsing and navigation
assets/js/theme.js              Dark/light persistence
assets/js/icons.js              Inline SVG icon registry
assets/js/toolsData.js          Tool metadata: titles, SEO, FAQs, JSON-LD
assets/js/tools/index.js        Lazy loader mapping tool id -> render function
assets/js/tools/*.js            One module per tool
assets/js/tools/pdf/            PDF conversion and annotation modules
public/guides/                  Generated static guide pages
public/robots.txt, sitemap.xml  Served as-is by Vite
scripts/build-guides.mjs        Guide page + sitemap generator
vite.config.js                  IMPORTANT: `base` must match the GitHub repo name
.github/workflows/deploy.yml    Builds and deploys to GitHub Pages on every push
```

## Local Development

Requires Node.js 20+.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # outputs to dist/
npm run preview   # preview the production build
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages. Repository Settings → Pages → Source must be set to **GitHub Actions**.

If you rename the repository or move to a custom domain, update `base` in `vite.config.js`, `SITE_URL` in `assets/js/siteConfig.js` and `scripts/guides-content.mjs`, the URLs in `public/robots.txt`, and the meta tags in `index.html`, then re-run the guide generator.

## Privacy

No analytics, no accounts, no uploads. File-handling tools (images, PDFs, spreadsheets) process data entirely in memory via the Canvas, Web Crypto, and File APIs. The Resume Builder stores a draft in `localStorage` on the user's own device only.

## License

Free to use for personal, educational, professional, and commercial purposes.
