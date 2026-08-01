# Personal Tools Hub

**All Your Everyday Tools in One Place.** A fast, free, privacy-first collection of 10+ browser-based utilities — QR Code Generator, Word/Character Counter, Password Generator, JSON Formatter, Base64 Encoder/Decoder, Text Case Converter, Multi-Unit Converter, Age Calculator, Lorem Ipsum Generator, and Hash Generator & Diff Checker.

Everything runs 100% client-side. No signup, no server, no data ever leaves the browser.

## Tech Stack

- **Vanilla JavaScript** (ES Modules) — no framework, no virtual DOM
- **Vite 6** — dev server & production bundler
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin, CSS-first config)
- **qrcode** npm package for QR generation
- Hash-based client-side router (`#home`, `#tool/:id`, `#about`, etc.) — this makes the site work correctly on GitHub Pages static hosting with zero server configuration.

## Project Structure

```
index.html                   Single HTML shell (header, footer, #main-content mount point)
assets/css/main.css           Tailwind entry + custom utilities + dark-mode variant
assets/js/app.js               App bootstrap, routing glue, view rendering (home/tool/info pages)
assets/js/router.js            Hash parsing & navigation
assets/js/theme.js              Dark/light mode persistence (localStorage)
assets/js/icons.js               Inline SVG icon registry
assets/js/toolsData.js          Tool metadata: titles, descriptions, SEO, FAQs, JSON-LD schema
assets/js/utils.js                Shared helpers (clipboard, number formatting)
assets/js/tools/*.js                One file per tool, each exporting a render<Tool>(container) function
assets/js/tools/index.js         Router that maps a tool id -> its render function
public/robots.txt, sitemap.xml   Static SEO files served as-is by Vite
vite.config.js                    Vite config — IMPORTANT: `base` must match your GitHub repo name
.github/workflows/deploy.yml      GitHub Actions: build & deploy to GitHub Pages on every push
```

## Run Locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev       # http://localhost:3000
```

## Build for Production

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

## Deploying to GitHub Pages

1. In `vite.config.js`, set `base` to `/<your-repo-name>/` (must match exactly, including slashes).
2. Push to `main`/`master`. The included GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys `dist/` to GitHub Pages automatically.
3. In your repo Settings → Pages, set the source to "GitHub Actions" (one-time setup).

See the full step-by-step deployment & AdSense/Adsterra guide provided alongside this project for details.

## Notes on SEO

This is a single-page app using hash-based routing (`#tool/qr-generator`, etc.). Search engines only index the root document (`/`) — content after `#` is never sent to the server and Google does not treat hash fragments as separate indexable pages. The rich per-tool `<title>`, meta description, and JSON-LD/FAQ schema are set dynamically via JavaScript for a good on-page experience and for users who share direct hash links, but for maximum SEO of individual tool pages, a future enhancement would be migrating to path-based routing (`/tool/qr-generator`) with a GitHub Pages 404-redirect fallback.

## License

Free to use for personal, educational, professional, and commercial purposes.
