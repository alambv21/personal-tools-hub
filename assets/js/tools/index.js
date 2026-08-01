/**
 * Tool loader.
 *
 * Each tool is loaded on demand with a dynamic import() so that heavy
 * dependencies (pdf-lib in the PDF toolkit, qrcode in the QR generator)
 * are split into separate chunks instead of being bundled into the main
 * entry file. A visitor who only opens the word counter never downloads
 * the PDF engine.
 */

const TOOL_LOADERS = {
  'word-counter': () => import('./wordCounter.js').then(m => m.renderWordCounter),
  'password-generator': () => import('./passwordGen.js').then(m => m.renderPasswordGenerator),
  'case-converter': () => import('./caseConverter.js').then(m => m.renderCaseConverter),
  'qr-generator': () => import('./qrGen.js').then(m => m.renderQrGenerator),
  'json-formatter': () => import('./jsonFormatter.js').then(m => m.renderJsonFormatter),
  'base64-tool': () => import('./base64Tool.js').then(m => m.renderBase64Tool),
  'unit-converter': () => import('./unitConverter.js').then(m => m.renderUnitConverter),
  'age-calculator': () => import('./ageCalc.js').then(m => m.renderAgeCalculator),
  'hash-generator': () => import('./hashDiff.js').then(m => m.renderHashGenerator),
  'image-compressor': () => import('./imageCompressor.js').then(m => m.renderImageCompressor),
  'pdf-kit': () => import('./pdfKit.js').then(m => m.renderPdfKit),
  'bmi-calculator': () => import('./bmiCalc.js').then(m => m.renderBmiCalculator)
};

function renderLoading(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span class="text-xs font-semibold">Loading tool...</span>
    </div>
  `;
}

function renderError(container, toolId) {
  container.innerHTML = `
    <div class="p-6 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-900/20 text-center">
      <p class="text-sm font-bold text-red-700 dark:text-red-300">This tool could not be loaded.</p>
      <p class="mt-1 text-xs text-red-600 dark:text-red-400">
        Check your connection and refresh the page. If it keeps happening, the
        <span class="font-mono">${toolId}</span> module may have failed to download.
      </p>
    </div>
  `;
}

export async function renderToolById(toolId, container) {
  const loader = TOOL_LOADERS[toolId];

  if (!loader) {
    container.innerHTML = `<div class="p-4 text-xs text-slate-500">Tool coming soon...</div>`;
    return;
  }

  renderLoading(container);

  try {
    const render = await loader();
    // Guard against a fast tool switch: if the router replaced the view while
    // this chunk was still downloading, don't clobber the newer content.
    if (!container.isConnected) return;
    render(container);
  } catch (err) {
    console.error(`Failed to load tool "${toolId}":`, err);
    if (container.isConnected) renderError(container, toolId);
  }
}
