/**
 * Main Vanilla JS Application for Personal Tools Hub
 */

import { TOOLS_DATA } from './toolsData.js';
import { TOOL_CONTENT } from './toolContent.js';
import { initTheme, toggleTheme } from './theme.js';
import { copyToClipboard } from './utils.js';
import { getIconSvg } from './icons.js';
import { renderToolById } from './tools/index.js';
import { SITE_URL, CONTACT_EMAIL, CONTACT_EMAIL_IS_PLACEHOLDER } from './siteConfig.js';
import { adSlotHtml, activateAdSlots } from './ads.js';
import { initAnalytics } from './analytics.js';
import { parsePath, navigateTo, restoreRedirectedPath, absoluteUrl } from './router.js';

// Application State
let isDarkMode = initTheme();
let selectedCategory = 'all';

// Mirrors scripts/guides-content.mjs. Kept as a small static list so the
// homepage can link to the generated guide pages without importing the
// full article bodies into the main bundle.
const HOME_GUIDES = [
  { slug: 'how-to-write-a-resume-that-gets-read', title: 'How to Write a Resume That Actually Gets Read', blurb: 'What recruiters and screening systems look for, and the formatting that quietly gets resumes rejected.' },
  { slug: 'how-to-merge-and-split-pdf-files', title: 'How to Merge and Split PDF Files', blurb: 'Page range syntax, why order matters, and the privacy question most people never ask.' },
  { slug: 'webp-vs-jpeg-vs-png', title: 'WebP vs JPEG vs PNG: Which Should You Use?', blurb: 'How the three formats differ, and a simple rule for choosing between them.' },
  { slug: 'qr-codes-explained', title: 'QR Codes Explained', blurb: 'How they work, why some fail to scan, and the sizing and contrast rules that matter.' },
  { slug: 'why-your-pdf-is-so-large', title: 'Why Your PDF Is So Large', blurb: 'What actually takes up space inside a PDF, and which fixes give the biggest reduction.' },
  { slug: 'how-to-create-strong-passwords', title: 'How to Create Strong, Practical Passwords', blurb: 'What really makes a password hard to crack, and why old advice misleads.' }
];
let searchQuery = '';
let openFaqIndex = 0;

// Initialize App on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  // A deep link such as /tool/qr-generator is served by 404.html on GitHub
  // Pages, which stashes the path and redirects to "/". Restore it before the
  // first render, otherwise the visitor silently lands on the homepage.
  restoreRedirectedPath();

  setupGlobalListeners();
  handleRouteChange();

  window.addEventListener('popstate', handleRouteChange);
});

function setupGlobalListeners() {
  // Theme Toggle Button
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    updateThemeIcon(themeBtn);
    themeBtn.addEventListener('click', () => {
      isDarkMode = !isDarkMode;
      toggleTheme(isDarkMode);
      updateThemeIcon(themeBtn);
    });
  }

  // Header Search Input
  const searchInput = document.getElementById('header-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      const route = parsePath();
      if (route.page !== 'home') {
        navigateTo('home');
      } else {
        renderHomeView();
      }
    });
  }

  // Header Mobile Search Toggle
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const mobileSearchBox = document.getElementById('mobile-search-box');
  if (mobileSearchBtn && mobileSearchBox) {
    mobileSearchBtn.addEventListener('click', () => {
      mobileSearchBox.classList.toggle('hidden');
    });
  }

  // Category Pills
  const categoryPills = document.querySelectorAll('.cat-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      selectedCategory = pill.getAttribute('data-cat');
      categoryPills.forEach(p => {
        const isSelected = p.getAttribute('data-cat') === selectedCategory;
        p.className = `cat-pill px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
          isSelected
            ? 'bg-blue-600 text-white shadow-xs'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`;
      });
      const route = parsePath();
      if (route.page !== 'home') {
        navigateTo('home');
      } else {
        renderHomeView();
      }
    });
  });

  // Footer / Nav Links
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      navigateTo(target);
    });
  });
}

function updateThemeIcon(btn) {
  btn.innerHTML = isDarkMode
    ? `${getIconSvg('sun', 'w-4 h-4 text-amber-400')}<span class="sr-only">Light Mode</span>`
    : `${getIconSvg('moon', 'w-4 h-4 text-slate-600')}<span class="sr-only">Dark Mode</span>`;
}

// Helper to update Document Title, Meta Description & JSON-LD Schema dynamically
function updatePageSeo(title, description, faqs = [], schemaApp = null, route = 'home') {
  document.title = title || 'Personal Tools Hub - All Your Everyday Tools in One Place';

  // Each route is now a real URL, so the canonical and og:url must follow it.
  // Leaving them pointing at the homepage would tell Google every tool page is
  // a duplicate of "/", which would undo the point of path-based routing.
  const canonicalHref = absoluteUrl(route, SITE_URL);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalHref;

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalHref);

  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title || 'Personal Tools Hub');

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && description) ogDesc.setAttribute('content', description);

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description || 'Fast, clean, and privacy-friendly utility platform for students, professionals, developers, and businesses.';

  let jsonScript = document.getElementById('seo-json-ld');
  if (!jsonScript) {
    jsonScript = document.createElement('script');
    jsonScript.id = 'seo-json-ld';
    jsonScript.type = 'application/ld+json';
    document.head.appendChild(jsonScript);
  }

  const schemaItems = [];

  if (schemaApp) {
    schemaItems.push(schemaApp);
  }

  if (faqs && faqs.length > 0) {
    schemaItems.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
  }

  if (schemaItems.length > 0) {
    jsonScript.textContent = JSON.stringify(
      schemaItems.length === 1 ? schemaItems[0] : { '@context': 'https://schema.org', '@graph': schemaItems }
    );
  } else {
    jsonScript.textContent = '';
  }
}

function handleRouteChange() {
  const route = parsePath();
  const mainEl = document.getElementById('main-content');
  if (!mainEl) return;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (route.page === 'home') {
    renderHomeView();
  } else if (route.page === 'tool') {
    renderToolDetailView(route.toolId);
  } else {
    renderInfoPage(route.page);
  }
}

// ----------------------------------------------------------------------------
// VIEW: Home Page
// ----------------------------------------------------------------------------
function renderHomeView() {
  updatePageSeo(
    'Personal Tools Hub - Fast, Free & Private Browser Utilities',
    'A fast, clean, and privacy-friendly utility platform featuring QR code generator, word counter, password generator, JSON validator, and multi-unit converters.',
    [],
    null,
    'home'
  );

  const mainEl = document.getElementById('main-content');

  const filteredTools = TOOLS_DATA.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      tool.title.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery) ||
      tool.seoMeta.keywords.some(kw => kw.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  mainEl.innerHTML = `
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      <div class="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 text-white p-8 sm:p-12 shadow-md">
        <div class="relative z-10 max-w-[1100px] mx-auto space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-blue-100 border border-white/20">
            ${getIconSvg('sparkles', 'w-3.5 h-3.5 text-amber-300')}
            <span>Fast, Free & Browser-First Privacy</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            All Your Everyday Tools in One Place.
          </h1>
          <p class="text-sm sm:text-base text-blue-100 font-normal leading-relaxed max-w-2xl">
            A fast, clean, and privacy-friendly utility platform for students, professionals, developers, and businesses.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-6 text-xs text-blue-100 font-medium">
            <div class="flex items-center gap-2">
              ${getIconSvg('zap', 'w-4 h-4 text-emerald-400')}
              <span>Instant Browser Execution</span>
            </div>
            <div class="flex items-center gap-2">
              ${getIconSvg('shield', 'w-4 h-4 text-amber-300')}
              <span>100% Client-Side Security</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-[1100px] mx-auto space-y-6">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Available Tools (${filteredTools.length})
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select any utility below to launch instantly without signup.
            </p>
          </div>
        </div>

        ${filteredTools.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filteredTools.map(tool => `
              <a
                href="/tool/${tool.id}"
                data-tool-id="${tool.id}"
                class="tool-card group relative p-6 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="w-10 h-10 rounded-[14px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105">
                      ${getIconSvg(tool.iconName, 'w-5 h-5')}
                    </div>
                    ${tool.popular ? `
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                        ${getIconSvg('flame', 'w-3 h-3 text-amber-500 fill-amber-500')} Popular
                      </span>
                    ` : ''}
                  </div>

                  <div>
                    <h3 class="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      ${tool.title}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      ${tool.tagline}
                    </p>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span class="capitalize text-slate-400 dark:text-slate-500 font-normal">${tool.category}</span>
                  <span class="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open Tool ${getIconSvg('arrowRight', 'w-3.5 h-3.5')}
                  </span>
                </div>
              </a>
            `).join('')}
          </div>
        ` : `
          <div class="p-12 text-center rounded-[20px] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
            ${getIconSvg('search', 'w-10 h-10 mx-auto text-slate-400 opacity-60')}
            <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm">No Tools Found</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any tool matching "${searchQuery}". Try searching for another keyword like "word", "password", or "json".
            </p>
          </div>
        `}

        ${adSlotHtml('homeBelowTools')}

        <!-- Guides: real static pages, crawlable and indexable unlike hash routes -->
        <section class="mt-16">
          <div class="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Guides &amp; Articles</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Practical explanations of the things these tools help with.
              </p>
            </div>
            <a href="guides/" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
              View all
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${HOME_GUIDES.map(g => `
              <a href="guides/${g.slug}.html"
                 class="group p-5 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all">
                <h3 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  ${g.title}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">${g.blurb}</p>
                <span class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Read guide ${getIconSvg('arrowRight', 'w-3.5 h-3.5')}
                </span>
              </a>
            `).join('')}
          </div>
        </section>
      </div>
    </div>
  `;

  activateAdSlots(mainEl);

  // Bind click handlers to tool cards
  // These are real <a href> elements so crawlers can follow them and users can
  // open them in a new tab. preventDefault keeps normal clicks as fast in-app
  // navigation instead of a full page reload.
  mainEl.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let new-tab work
      e.preventDefault();
      const toolId = card.getAttribute('data-tool-id');
      navigateTo(`tool/${toolId}`);
    });
  });
}

// ----------------------------------------------------------------------------
// VIEW: Tool Detail Page
// ----------------------------------------------------------------------------
function renderToolDetailView(toolId) {
  const tool = TOOLS_DATA.find(t => t.id === toolId);
  const mainEl = document.getElementById('main-content');

  if (!tool) {
    navigateTo('home');
    return;
  }

  // Update Page Title, Meta Description & JSON-LD Schema
  updatePageSeo(
    tool.seoMeta?.metaTitle || `${tool.title} - Personal Tools Hub`,
    tool.seoMeta?.metaDescription || tool.description,
    tool.faqs || [],
    tool.schemaJson || null,
    `tool/${tool.id}`
  );

  const content = TOOL_CONTENT[tool.id];

  // Related tools
  const relatedTools = TOOLS_DATA
    .filter(t => t.id !== tool.id && (t.category === tool.category || t.popular))
    .slice(0, 3);

  mainEl.innerHTML = `
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      <div class="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <a href="/" data-nav="home" class="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none focus:underline">
            ${getIconSvg('home', 'w-3.5 h-3.5')}
            <span>Home</span>
          </a>
          <span>/</span>
          <span class="capitalize">${tool.category}</span>
          <span>/</span>
          <span class="font-medium text-slate-800 dark:text-slate-200">${tool.title}</span>
        </nav>

        <div class="flex items-center gap-2">
          <button
            data-nav="home"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ${getIconSvg('arrowLeft', 'w-3.5 h-3.5')} Back to Directory
          </button>
          <button
            id="share-tool-btn"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ${getIconSvg('share', 'w-3.5 h-3.5')}
            <span id="share-tool-text">Share Tool</span>
          </button>
        </div>
      </div>

      <div class="max-w-[1100px] mx-auto space-y-8">
        
        <div class="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-[14px] bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-xs">
              ${getIconSvg(tool.iconName, 'w-5 h-5')}
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                ${tool.title}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                ${tool.tagline}
              </p>
            </div>
          </div>
        </div>

        <div id="tool-component-container" class="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        </div>

        <article class="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ${getIconSvg('sparkles', 'w-4 h-4 text-blue-500')} About ${tool.title}
          </h2>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ${content?.intro || tool.description}
          </p>

          ${content?.sections ? content.sections.map(sec => `
            <section class="space-y-2">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white pt-1">${sec.heading}</h3>
              <div class="tool-prose text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
                ${sec.body}
              </div>
            </section>
          `).join('') : ''}

          ${content?.tips ? `
            <section class="space-y-2 pt-1">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Quick tips</h3>
              <ul class="space-y-1.5">
                ${content.tips.map(tip => `
                  <li class="flex gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span class="text-blue-500 shrink-0 mt-0.5">${getIconSvg('check', 'w-3.5 h-3.5')}</span>
                    <span>${tip}</span>
                  </li>
                `).join('')}
              </ul>
            </section>
          ` : ''}

          ${content?.disclaimer ? `
            <p class="text-xs text-amber-800 dark:text-amber-300 p-3 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-900/20 leading-relaxed">
              ${content.disclaimer}
            </p>
          ` : ''}
        </article>

        ${adSlotHtml('toolBelowContent')}

        ${tool.faqs && tool.faqs.length > 0 ? `
          <div class="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <div class="space-y-3">
              ${tool.faqs.map((faq, idx) => `
                <div class="faq-item rounded-[14px] border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    data-faq-idx="${idx}"
                    class="faq-toggle w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
                  >
                    <span>${faq.question}</span>
                    <span class="faq-arrow transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180' : ''}">
                      ${getIconSvg('chevronDown', 'w-4 h-4 text-slate-400')}
                    </span>
                  </button>
                  <div class="faq-body ${openFaqIndex === idx ? '' : 'hidden'} p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed bg-slate-50/50 dark:bg-slate-800/20">
                    ${faq.answer}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${relatedTools.length > 0 ? `
          <div class="space-y-4 pt-2">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Related Tools You May Like</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              ${relatedTools.map(rel => `
                <a
                  href="/tool/${rel.id}"
                  data-rel-id="${rel.id}"
                  class="rel-tool-card block p-5 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-all duration-200 group shadow-xs hover:shadow-md space-y-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div class="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    ${rel.title}
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    ${rel.tagline}
                  </p>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  activateAdSlots(mainEl);

  // Render the interactive tool inside `#tool-component-container`
  const toolContainer = mainEl.querySelector('#tool-component-container');
  if (toolContainer) {
    renderToolById(tool.id, toolContainer);
  }

  // Bind Share button
  const shareBtn = mainEl.querySelector('#share-tool-btn');
  const shareText = mainEl.querySelector('#share-tool-text');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: tool.title,
            text: tool.description,
            url: window.location.href,
          });
        } catch {}
      } else {
        await copyToClipboard(window.location.href);
        shareText.textContent = 'Link Copied!';
        setTimeout(() => {
          shareText.textContent = 'Share Tool';
        }, 2000);
      }
    });
  }

  // Bind Nav buttons
  mainEl.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigateTo(link.getAttribute('data-nav'));
    });
  });

  // Bind FAQ toggles
  mainEl.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-faq-idx'), 10);
      openFaqIndex = openFaqIndex === idx ? null : idx;
      
      mainEl.querySelectorAll('.faq-item').forEach((item, itemIdx) => {
        const body = item.querySelector('.faq-body');
        const arrow = item.querySelector('.faq-arrow');
        if (itemIdx === openFaqIndex) {
          body.classList.remove('hidden');
          arrow.classList.add('rotate-180');
        } else {
          body.classList.add('hidden');
          arrow.classList.remove('rotate-180');
        }
      });
    });
  });

  // Bind Related tools
  mainEl.querySelectorAll('.rel-tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      const relId = card.getAttribute('data-rel-id');
      navigateTo(`tool/${relId}`);
    });
  });
}

// ----------------------------------------------------------------------------
// VIEW: Static Info Pages (About, Privacy, Terms, Disclaimer, Contact)
// ----------------------------------------------------------------------------
function renderInfoPage(pageKey) {
  const mainEl = document.getElementById('main-content');

  let title = '';
  let contentHtml = '';

  switch (pageKey) {
    case 'about':
      title = 'About Personal Tools Hub';
      contentHtml = `
        <div class="space-y-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">About Personal Tools Hub</h1>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Personal Tools Hub was created with a clear mission: to provide the fastest, cleanest, and most reliable web utilities on the internet. Whether you are a student writing an essay, a software developer formatting JSON, a creator designing QR codes, or an executive calculating date differences, our suite of utilities delivers instant results.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              ${getIconSvg('checkCircle', 'w-5 h-5 text-blue-600 dark:text-blue-400 mb-2')}
              <h3 class="font-semibold text-xs text-slate-800 dark:text-slate-200">Zero Registration</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">No signups, subscriptions, or logins required.</p>
            </div>
            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              ${getIconSvg('shield', 'w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2')}
              <h3 class="font-semibold text-xs text-slate-800 dark:text-slate-200">Local Browser Processing</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Your data never leaves your device or browser memory.</p>
            </div>
            <div class="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
              ${getIconSvg('fileText', 'w-5 h-5 text-purple-600 dark:text-purple-400 mb-2')}
              <h3 class="font-semibold text-xs text-slate-800 dark:text-slate-200">100% Scalable</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Designed from day one to support 500+ utilities.</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'privacy':
      title = 'Privacy Policy';
      contentHtml = `
        <div class="space-y-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
          <p class="text-xs text-slate-500">Effective Date: July 28, 2026</p>
          <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>At Personal Tools Hub, accessible from ${SITE_URL.replace(/^https?:\/\//, '')}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Personal Tools Hub and how we use it.</p>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-base">Client-Side Data Guarantee</h3>
            <p>All tools on this website process inputs directly within your web browser using Vanilla JavaScript. No user text, password generation seeds, encoded strings, or uploaded contents are transmitted to or stored on our servers.</p>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-base">Cookies and Advertising Partners</h3>
            <p>Personal Tools Hub may use standard cookies or third-party ad networks (such as Google AdSense or Adsterra) to deliver non-intrusive advertisements. These partners may use cookies or web beacons to collect non-personally identifiable browser information to show tailored ads.</p>
          </div>
        </div>
      `;
      break;

    case 'terms':
      title = 'Terms of Service';
      contentHtml = `
        <div class="space-y-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
          <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>By accessing this website, you agree to be bound by these Terms and Conditions of Use and agree that you are responsible for agreement with any applicable local laws.</p>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-base">Use License</h3>
            <p>Permission is granted to use all utilities provided on Personal Tools Hub for personal, educational, professional, and commercial purposes completely free of charge.</p>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-base">Limitations</h3>
            <p>In no event shall Personal Tools Hub or its suppliers be liable for any damages arising out of the use or inability to use the tools provided on this website.</p>
          </div>
        </div>
      `;
      break;

    case 'disclaimer':
      title = 'Disclaimer';
      contentHtml = `
        <div class="space-y-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Disclaimer</h1>
          <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>All the information and tools on this website are published in good faith and for general information purpose only. Personal Tools Hub does not make any warranties about the completeness, reliability, and accuracy of these tools.</p>
            <p>Any action you take upon the information you find on this website (Personal Tools Hub), is strictly at your own risk. Personal Tools Hub will not be liable for any losses and/or damages in connection with the use of our website.</p>
          </div>
        </div>
      `;
      break;

    case 'contact':
      title = 'Contact Support';
      contentHtml = `
        <div class="space-y-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Contact & Support</h1>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Have suggestions for a new tool or need to report a bug? We love hearing from our users!
          </p>
          <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 space-y-4">
            <div class="flex items-center gap-3 text-slate-800 dark:text-slate-200">
              ${getIconSvg('mail', 'w-5 h-5 text-blue-600')}
              <div>
                <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">Official Email</div>
                <div class="font-bold text-sm">${CONTACT_EMAIL}</div>
              </div>
            </div>
            <p class="text-xs text-slate-500">We respond to all feature requests within 24-48 business hours.</p>
            ${CONTACT_EMAIL_IS_PLACEHOLDER ? `
              <p class="text-xs font-semibold text-red-600 dark:text-red-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                Site owner: this contact address is still a placeholder. Set CONTACT_EMAIL in
                assets/js/siteConfig.js before applying to any ad network.
              </p>` : ''}
          </div>
        </div>
      `;
      break;

    default:
      navigateTo('home');
      return;
  }

    // Info pages are real routes now, so they need their own title, description
  // and canonical. Without this they would inherit whatever the previous view
  // set, and every one would claim to be a duplicate of the last page viewed.
  const INFO_SEO = {
    about: {
      title: 'About Us - Personal Tools Hub',
      description: 'Learn about Personal Tools Hub, a free collection of privacy-first browser tools that process your files locally without uploading them.'
    },
    privacy: {
      title: 'Privacy Policy - Personal Tools Hub',
      description: 'How Personal Tools Hub handles data. All tools run in your browser, and your files are never uploaded to any server.'
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
  const seo = INFO_SEO[pageKey] || INFO_SEO.about;
  updatePageSeo(seo.title, seo.description, [], null, pageKey);

  mainEl.innerHTML = `
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <button
        data-nav="home"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 mb-6 transition"
      >
        ${getIconSvg('arrowLeft', 'w-4 h-4')} Back to Home
      </button>

      <div class="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-4xl">
        ${contentHtml}
      </div>
    </div>
  `;

  mainEl.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigateTo(link.getAttribute('data-nav'));
    });
  });
}

initAnalytics();
