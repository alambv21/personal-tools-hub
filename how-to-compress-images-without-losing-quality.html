/**
 * PDF annotation surface.
 *
 * This intentionally does NOT try to edit a PDF's existing text. Text in a PDF
 * is positioned glyphs drawn with (often subsetted) embedded fonts, so genuine
 * re-flow editing is not achievable in the browser. Instead this lets the user
 * draw ON TOP of the page: add new text, and cover mistakes with filled boxes.
 */

import { getIconSvg } from '../../icons.js';

// pdf-lib's standard fonts only cover the WinAnsi character set, so anything
// outside it (Bangla, Arabic, CJK, and many symbols) cannot be drawn without
// embedding a full Unicode font.
const WINANSI_SAFE = /^[\x20-\x7E\xA0-\xFF\u2018\u2019\u201C\u201D\u2013\u2014\u2022\u20AC]*$/;

export async function mountAnnotator(host, file, helpers) {
  const { showError, clearError, setStatus } = helpers;

  const [{ loadPdfDocument }, pdfLib] = await Promise.all([
    import('./pdfjsSetup.js'),
    import('pdf-lib')
  ]);
  const { PDFDocument, StandardFonts, rgb } = pdfLib;

  const sourceBytes = await file.arrayBuffer();
  const pdf = await loadPdfDocument(sourceBytes);

  let pageNum = 1;
  let tool = 'text';
  let scale = 1;
  let annotations = [];
  let dragStart = null;
  let rotatedPage = false;

  host.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        <div class="flex items-center gap-1">
          <button data-tool="text" class="an-tool px-3 py-1.5 rounded-lg text-xs font-bold transition bg-blue-600 text-white">Add Text</button>
          <button data-tool="white" class="an-tool px-3 py-1.5 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">Whiteout Box</button>
        </div>

        <div class="h-5 w-px bg-slate-300 dark:bg-slate-700"></div>

        <div id="an-text-opts" class="flex items-center gap-2">
          <input id="an-text" type="text" placeholder="Text to place" maxlength="200"
            class="w-44 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-500" />
          <input id="an-size" type="number" min="6" max="72" value="12" title="Font size"
            class="w-16 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center outline-none" />
          <input id="an-color" type="color" value="#111827" title="Text colour"
            class="w-9 h-8 rounded border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer" />
        </div>

        <div class="flex-1"></div>

        <div class="flex items-center gap-1">
          <button id="an-prev" class="px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold disabled:opacity-40">&larr;</button>
          <span id="an-pageinfo" class="text-xs font-semibold text-slate-600 dark:text-slate-300 px-1"></span>
          <button id="an-next" class="px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold disabled:opacity-40">&rarr;</button>
        </div>
      </div>

      <p id="an-hint" class="text-xs text-slate-500 dark:text-slate-400"></p>

      <div class="flex justify-center overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 p-4">
        <div id="an-stage" class="relative inline-block shadow-lg cursor-crosshair">
          <canvas id="an-canvas" class="block bg-white"></canvas>
          <div id="an-overlay" class="absolute inset-0"></div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button id="an-apply" class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-semibold transition">
          Apply &amp; Download
        </button>
        <button id="an-undo" class="px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition disabled:opacity-40">
          Undo Last
        </button>
        <button id="an-clear" class="px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition disabled:opacity-40">
          Clear All
        </button>
        <span id="an-count" class="text-xs text-slate-500 dark:text-slate-400"></span>
      </div>

      <div class="p-3 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-900/20 flex gap-2.5">
        ${getIconSvg('alertTriangle', 'w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5')}
        <p class="text-xs text-amber-900 dark:text-amber-200">
          This adds new content on top of the page &mdash; it does not rewrite the PDF's existing text.
          To fix a mistake, cover it with a whiteout box and type the replacement over it.
          A whiteout box hides content visually but the original text may still be selectable underneath,
          so do not rely on it to redact confidential information.
          Text placement supports Latin characters only.
        </p>
      </div>
    </div>
  `;

  const canvas = host.querySelector('#an-canvas');
  const stage = host.querySelector('#an-stage');
  const overlay = host.querySelector('#an-overlay');
  const textInput = host.querySelector('#an-text');
  const sizeInput = host.querySelector('#an-size');
  const colorInput = host.querySelector('#an-color');
  const textOpts = host.querySelector('#an-text-opts');
  const pageInfo = host.querySelector('#an-pageinfo');
  const hintEl = host.querySelector('#an-hint');
  const countEl = host.querySelector('#an-count');
  const prevBtn = host.querySelector('#an-prev');
  const nextBtn = host.querySelector('#an-next');
  const applyBtn = host.querySelector('#an-apply');
  const undoBtn = host.querySelector('#an-undo');
  const clearBtn = host.querySelector('#an-clear');

  function updateHint() {
    hintEl.textContent = tool === 'text'
      ? 'Type your text above, then click on the page where it should start.'
      : 'Click and drag on the page to draw a box that covers the content underneath.';
  }

  function updateCount() {
    const n = annotations.length;
    countEl.textContent = n === 0 ? '' : `${n} annotation${n === 1 ? '' : 's'} across the document`;
    undoBtn.disabled = n === 0;
    clearBtn.disabled = n === 0;
    applyBtn.disabled = n === 0;
  }

  async function renderPage() {
    const page = await pdf.getPage(pageNum);

    // Fit the page to the available width, but never upscale beyond 100%.
    const unscaled = page.getViewport({ scale: 1 });
    const available = Math.min(host.clientWidth - 48, 900) || 720;
    scale = Math.min(available / unscaled.width, 1.5);

    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

    pageInfo.textContent = `Page ${pageNum} / ${pdf.numPages}`;
    prevBtn.disabled = pageNum <= 1;
    nextBtn.disabled = pageNum >= pdf.numPages;

    // pdf.js honours the page's /Rotate flag when rendering the preview, but
    // pdf-lib draws into the unrotated page space. On a rotated page the two
    // coordinate systems disagree, so flag it rather than silently misplacing
    // the annotation.
    rotatedPage = ((page.rotate % 360) + 360) % 360 !== 0;
    if (rotatedPage) {
      showError('This page is rotated, so placed items may not land where you clicked. Use the Rotate mode to bake the rotation in first, then annotate the result.');
    } else {
      clearError();
    }

    drawOverlay();
  }

  function drawOverlay() {
    overlay.innerHTML = annotations
      .filter(a => a.page === pageNum)
      .map((a, idx) => {
        if (a.type === 'text') {
          return `<div class="absolute pointer-events-none whitespace-pre" style="
            left:${a.x * scale}px; top:${(a.y - a.size) * scale}px;
            font-size:${a.size * scale}px; color:${a.color};
            font-family:Helvetica,Arial,sans-serif; line-height:1;">${
              a.text.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
            }</div>`;
        }
        return `<div class="absolute pointer-events-none border border-dashed border-blue-500/70" style="
          left:${a.x * scale}px; top:${a.y * scale}px;
          width:${a.w * scale}px; height:${a.h * scale}px; background:${a.color};"></div>`;
      })
      .join('');
  }

  // Convert a mouse event into canvas-space CSS pixels.
  function pointFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width) / scale,
      y: (e.clientY - rect.top) * (canvas.height / rect.height) / scale
    };
  }

  host.querySelectorAll('.an-tool').forEach(btn => {
    btn.addEventListener('click', () => {
      tool = btn.getAttribute('data-tool');
      host.querySelectorAll('.an-tool').forEach(b => {
        const active = b.getAttribute('data-tool') === tool;
        b.className = `an-tool px-3 py-1.5 rounded-lg text-xs font-bold transition ${
          active ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`;
      });
      textOpts.style.opacity = tool === 'text' ? '1' : '0.4';
      textOpts.style.pointerEvents = tool === 'text' ? 'auto' : 'none';
      updateHint();
    });
  });

  stage.addEventListener('mousedown', (e) => {
    if (tool !== 'white') return;
    dragStart = pointFromEvent(e);
  });

  stage.addEventListener('mouseup', (e) => {
    clearError();
    const pt = pointFromEvent(e);

    if (tool === 'text') {
      const text = textInput.value.trim();
      if (!text) {
        showError('Type the text you want to place first, then click on the page.');
        return;
      }
      if (!WINANSI_SAFE.test(text)) {
        showError('This text contains characters the PDF standard fonts cannot draw (for example Bangla, Arabic, or CJK). Latin characters only for now.');
        return;
      }
      const size = Math.min(Math.max(parseInt(sizeInput.value, 10) || 12, 6), 72);
      annotations.push({ page: pageNum, type: 'text', x: pt.x, y: pt.y, text, size, color: colorInput.value });
      textInput.value = '';
    } else if (dragStart) {
      const x = Math.min(dragStart.x, pt.x);
      const yTop = Math.min(dragStart.y, pt.y);
      const w = Math.abs(pt.x - dragStart.x);
      const h = Math.abs(pt.y - dragStart.y);
      dragStart = null;
      if (w < 3 || h < 3) return; // ignore stray clicks
      annotations.push({ page: pageNum, type: 'white', x, y: yTop, w, h, color: '#ffffff' });
    }

    drawOverlay();
    updateCount();
  });

  prevBtn.addEventListener('click', () => { if (pageNum > 1) { pageNum--; renderPage(); } });
  nextBtn.addEventListener('click', () => { if (pageNum < pdf.numPages) { pageNum++; renderPage(); } });

  undoBtn.addEventListener('click', () => {
    annotations.pop();
    drawOverlay();
    updateCount();
  });

  clearBtn.addEventListener('click', () => {
    annotations = [];
    drawOverlay();
    updateCount();
  });

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(m[1], 16) / 255,
      g: parseInt(m[2], 16) / 255,
      b: parseInt(m[3], 16) / 255
    };
  }

  applyBtn.addEventListener('click', async () => {
    clearError();
    applyBtn.disabled = true;
    setStatus('Applying annotations...');

    try {
      const out = await PDFDocument.load(sourceBytes.slice(0));
      const font = await out.embedFont(StandardFonts.Helvetica);

      for (const a of annotations) {
        const page = out.getPage(a.page - 1);
        const { height } = page.getSize();
        const c = hexToRgb(a.color);

        if (a.type === 'text') {
          // pdf.js y grows downward from the top; pdf-lib grows upward from
          // the bottom, so flip the coordinate.
          page.drawText(a.text, {
            x: a.x,
            y: height - a.y,
            size: a.size,
            font,
            color: rgb(c.r, c.g, c.b)
          });
        } else {
          page.drawRectangle({
            x: a.x,
            y: height - a.y - a.h,
            width: a.w,
            height: a.h,
            color: rgb(1, 1, 1)
          });
        }
      }

      const bytes = await out.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${String(file.name).replace(/\.[^.]+$/, '')}-annotated.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setStatus(`Applied ${annotations.length} annotation${annotations.length === 1 ? '' : 's'}.`);
    } catch (err) {
      showError(String(err?.message || err));
      setStatus('');
    } finally {
      applyBtn.disabled = annotations.length === 0;
    }
  });

  updateHint();
  updateCount();
  await renderPage();
}
