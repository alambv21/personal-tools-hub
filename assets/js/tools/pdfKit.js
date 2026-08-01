import { PDFDocument, degrees } from 'pdf-lib';
import { getIconSvg } from '../icons.js';

export function renderPdfKit(container) {
  let mode = 'merge';
  let files = [];

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  const MODES = {
    merge:    { label: 'Merge',        icon: 'layers',   group: 'Organise', accept: 'application/pdf', multiple: true,  hint: 'Add two or more PDFs. They are combined in the order listed below \u2014 use the arrows to reorder.' },
    split:    { label: 'Split',        icon: 'scissors', group: 'Organise', accept: 'application/pdf', multiple: false, hint: 'Add one PDF, then choose which pages to pull out into a new file.' },
    rotate:   { label: 'Rotate',       icon: 'rotate',   group: 'Organise', accept: 'application/pdf', multiple: false, hint: 'Add one PDF and rotate every page, or just a chosen range.' },
    images:   { label: 'Images \u2192 PDF', icon: 'image', group: 'Convert', accept: 'image/jpeg,image/png', multiple: true, hint: 'Add JPG or PNG images. Each becomes one page, in the order listed below.' },
    pdf2word: { label: 'PDF \u2192 Word',   icon: 'fileText', group: 'Convert', accept: 'application/pdf', multiple: false, hint: 'Extracts the text layer into an editable .docx file. Works on digitally created PDFs; scanned pages contain no text layer and need OCR instead.' },
    word2pdf: { label: 'Word \u2192 PDF',   icon: 'fileText', group: 'Convert', accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document', multiple: false, hint: 'Converts a .docx file to PDF. Headings, paragraphs, lists and simple tables carry over; complex layouts and images are simplified.' },
    excel2pdf:{ label: 'Excel \u2192 PDF',  icon: 'scale',    group: 'Convert', accept: '.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv', multiple: false, hint: 'Renders each worksheet as a clean table in a PDF. Accepts .xlsx and .csv files.' },
    annotate: { label: 'Add Text / Whiteout', icon: 'type', group: 'Edit', accept: 'application/pdf', multiple: false, hint: 'Place new text anywhere on the page, or cover mistakes with a whiteout box.' }
  };

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Mode selector, grouped by purpose -->
      <div class="space-y-3">
        ${['Organise', 'Convert', 'Edit'].map(group => `
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">${group}</p>
            <div class="flex flex-wrap gap-1.5">
              ${Object.keys(MODES).filter(m => MODES[m].group === group).map(m => `
                <button data-mode="${m}" class="pk-mode-btn flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  m === mode
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600'
                }">
                  ${getIconSvg(MODES[m].icon, 'w-3.5 h-3.5')} ${MODES[m].label}
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <p id="pk-hint" class="text-xs text-slate-500 dark:text-slate-400">${MODES[mode].hint}</p>

      <!-- Drop zone -->
      <div id="pk-drop" class="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center transition hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
        <input id="pk-file" type="file" accept="application/pdf" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div class="flex flex-col items-center gap-2 pointer-events-none">
          ${getIconSvg('upload', 'w-8 h-8 text-blue-600 dark:text-blue-400')}
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Drop files here or click to browse</p>
          <p id="pk-accept-note" class="text-xs text-slate-500 dark:text-slate-400">PDF files &middot; processed entirely in your browser</p>
        </div>
      </div>

      <!-- File list -->
      <div id="pk-list-wrap" class="hidden space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Selected Files</h3>
          <button id="pk-clear" class="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline">Clear all</button>
        </div>
        <ul id="pk-list" class="space-y-2"></ul>
      </div>

      <!-- Options -->
      <div id="pk-options" class="hidden p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Options</h3>

        <div id="pk-pages-wrap">
          <label for="pk-pages" class="block text-xs text-slate-500 dark:text-slate-400 mb-1">
            Pages <span class="text-slate-400">(e.g. 1-3, 5, 8-10 &mdash; leave empty for all pages)</span>
          </label>
          <input id="pk-pages" type="text" placeholder="1-3, 5"
            class="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
          <p id="pk-page-count" class="text-xs text-slate-400 dark:text-slate-500 mt-1"></p>
        </div>

        <div id="pk-angle-wrap" class="hidden">
          <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Rotation</label>
          <div class="flex gap-2">
            <button data-angle="90" class="pk-angle-btn flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold bg-blue-600 text-white">90&deg; right</button>
            <button data-angle="180" class="pk-angle-btn flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">180&deg;</button>
            <button data-angle="270" class="pk-angle-btn flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">90&deg; left</button>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div id="pk-action" class="flex flex-wrap items-center gap-2">
        <button id="pk-run" disabled class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-semibold transition flex items-center gap-1.5">
          <span id="pk-run-text">Merge PDFs</span>
        </button>
        <span id="pk-status" class="text-xs text-slate-500 dark:text-slate-400"></span>
      </div>

      <!-- Annotator mounts here -->
      <div id="pk-annotate-host"></div>

      <p id="pk-error" class="hidden text-xs text-red-600 dark:text-red-400 font-medium"></p>

      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex gap-3">
        ${getIconSvg('shield', 'w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5')}
        <p class="text-xs text-slate-600 dark:text-slate-300">
          Your files never leave your device. All PDF processing runs locally in your browser, so nothing is
          uploaded to any server. Password-protected PDFs cannot be processed &mdash; remove the password first.
        </p>
      </div>
    </div>
  `;

  const modeBtns = container.querySelectorAll('.pk-mode-btn');
  const hintEl = container.querySelector('#pk-hint');
  const dropZone = container.querySelector('#pk-drop');
  const fileInput = container.querySelector('#pk-file');
  const acceptNote = container.querySelector('#pk-accept-note');
  const listWrap = container.querySelector('#pk-list-wrap');
  const listEl = container.querySelector('#pk-list');
  const clearBtn = container.querySelector('#pk-clear');
  const optionsEl = container.querySelector('#pk-options');
  const pagesWrap = container.querySelector('#pk-pages-wrap');
  const pagesEl = container.querySelector('#pk-pages');
  const pageCountEl = container.querySelector('#pk-page-count');
  const angleWrap = container.querySelector('#pk-angle-wrap');
  const actionRow = container.querySelector('#pk-action');
  const annotateHost = container.querySelector('#pk-annotate-host');
  const runBtn = container.querySelector('#pk-run');
  const runText = container.querySelector('#pk-run-text');
  const statusEl = container.querySelector('#pk-status');
  const errorEl = container.querySelector('#pk-error');

  let rotateAngle = 90;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }
  function clearError() {
    errorEl.classList.add('hidden');
  }
  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  function renderList() {
    if (files.length === 0) {
      listWrap.classList.add('hidden');
      optionsEl.classList.add('hidden');
      runBtn.disabled = true;
      pageCountEl.textContent = '';
      return;
    }

    listWrap.classList.remove('hidden');
    optionsEl.classList.toggle('hidden', !['split', 'rotate'].includes(mode));
    runBtn.disabled = mode === 'merge' ? files.length < 2 : files.length < 1;

    listEl.innerHTML = files.map((f, i) => `
      <li class="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <span class="w-6 h-6 shrink-0 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">${i + 1}</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">${f.name}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500">${formatBytes(f.size)}</p>
        </div>
        ${(mode === 'merge' || mode === 'images') ? `
          <button data-up="${i}" ${i === 0 ? 'disabled' : ''} class="pk-move p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move up">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <button data-down="${i}" ${i === files.length - 1 ? 'disabled' : ''} class="pk-move p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move down">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        ` : ''}
        <button data-remove="${i}" class="pk-remove p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" aria-label="Remove">
          ${getIconSvg('x', 'w-3.5 h-3.5')}
        </button>
      </li>
    `).join('');

    listEl.querySelectorAll('.pk-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        files.splice(parseInt(btn.getAttribute('data-remove'), 10), 1);
        renderList();
        updatePageCount();
      });
    });
    listEl.querySelectorAll('.pk-move').forEach(btn => {
      btn.addEventListener('click', () => {
        const up = btn.getAttribute('data-up');
        const down = btn.getAttribute('data-down');
        if (up !== null) {
          const i = parseInt(up, 10);
          [files[i - 1], files[i]] = [files[i], files[i - 1]];
        } else if (down !== null) {
          const i = parseInt(down, 10);
          [files[i + 1], files[i]] = [files[i], files[i + 1]];
        }
        renderList();
      });
    });
  }

  async function updatePageCount() {
    pageCountEl.textContent = '';
    if (!['split', 'rotate'].includes(mode)) return;
    if (files.length !== 1) return;
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
      pageCountEl.textContent = `This PDF has ${doc.getPageCount()} page${doc.getPageCount() === 1 ? '' : 's'}.`;
    } catch {
      pageCountEl.textContent = '';
    }
  }

  // Parse "1-3, 5, 8-10" into a zero-based, de-duplicated, sorted index array.
  function parsePageRange(input, totalPages) {
    const raw = (input || '').trim();
    if (!raw) return Array.from({ length: totalPages }, (_, i) => i);

    const indices = new Set();
    for (const part of raw.split(',')) {
      const chunk = part.trim();
      if (!chunk) continue;
      const rangeMatch = chunk.match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        let start = parseInt(rangeMatch[1], 10);
        let end = parseInt(rangeMatch[2], 10);
        if (start > end) [start, end] = [end, start];
        for (let p = start; p <= end; p++) {
          if (p >= 1 && p <= totalPages) indices.add(p - 1);
        }
      } else if (/^\d+$/.test(chunk)) {
        const p = parseInt(chunk, 10);
        if (p >= 1 && p <= totalPages) indices.add(p - 1);
      } else {
        throw new Error(`"${chunk}" is not a valid page or range.`);
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  }

  function download(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function run() {
    clearError();
    setStatus('Working...');
    runBtn.disabled = true;

    try {
      if (mode === 'merge') {
        const out = await PDFDocument.create();
        for (const f of files) {
          const src = await PDFDocument.load(await f.arrayBuffer());
          const pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach(p => out.addPage(p));
        }
        download(await out.save(), 'merged.pdf');
        setStatus(`Merged ${files.length} files into one PDF.`);

      } else if (mode === 'split') {
        const src = await PDFDocument.load(await files[0].arrayBuffer());
        const indices = parsePageRange(pagesEl.value, src.getPageCount());
        if (indices.length === 0) throw new Error('No valid pages selected for this document.');
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, indices);
        pages.forEach(p => out.addPage(p));
        download(await out.save(), 'extracted.pdf');
        setStatus(`Extracted ${indices.length} page${indices.length === 1 ? '' : 's'}.`);

      } else if (mode === 'rotate') {
        const doc = await PDFDocument.load(await files[0].arrayBuffer());
        const indices = parsePageRange(pagesEl.value, doc.getPageCount());
        if (indices.length === 0) throw new Error('No valid pages selected for this document.');
        indices.forEach(i => {
          const page = doc.getPage(i);
          const current = page.getRotation().angle;
          page.setRotation(degrees((current + rotateAngle) % 360));
        });
        download(await doc.save(), 'rotated.pdf');
        setStatus(`Rotated ${indices.length} page${indices.length === 1 ? '' : 's'} by ${rotateAngle}\u00b0.`);

      } else if (mode === 'images') {
        const out = await PDFDocument.create();
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          let img;
          if (f.type === 'image/png') {
            img = await out.embedPng(bytes);
          } else if (f.type === 'image/jpeg') {
            img = await out.embedJpg(bytes);
          } else {
            throw new Error(`${f.name} is not a JPG or PNG. Convert it first, or use the Image Compressor tool.`);
          }
          const page = out.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        download(await out.save(), 'images.pdf');
        setStatus(`Created a ${files.length}-page PDF.`);

      } else if (mode === 'pdf2word') {
        const { pdfToWord } = await import('./pdf/convert.js');
        const res = await pdfToWord(files[0], setStatus);
        setStatus(`Extracted ${res.characters.toLocaleString()} characters from ${res.pages} page${res.pages === 1 ? '' : 's'} into a .docx file.`);

      } else if (mode === 'word2pdf') {
        const { wordToPdf } = await import('./pdf/convert.js');
        const res = await wordToPdf(files[0], setStatus);
        setStatus(`Created a ${res.pages}-page PDF.`);

      } else if (mode === 'excel2pdf') {
        const { spreadsheetToPdf } = await import('./pdf/convert.js');
        const res = await spreadsheetToPdf(files[0], { landscape: true }, setStatus);
        setStatus(`Rendered ${res.rows.toLocaleString()} rows from ${res.sheets} sheet${res.sheets === 1 ? '' : 's'} into a ${res.pages}-page PDF.`);
      }
    } catch (err) {
      const msg = String(err?.message || err);
      if (/encrypt/i.test(msg)) {
        showError('This PDF is password-protected. Remove the password first, then try again.');
      } else {
        showError(msg || 'Something went wrong processing these files.');
      }
      setStatus('');
    } finally {
      runBtn.disabled = false;
    }
  }

  // What counts as an acceptable file for the current mode. Browsers report
  // Office MIME types inconsistently, so fall back to the file extension.
  function isAcceptable(f) {
    const name = (f.name || '').toLowerCase();
    switch (mode) {
      case 'images':
        return f.type === 'image/png' || f.type === 'image/jpeg' || /\.(png|jpe?g)$/.test(name);
      case 'word2pdf':
        return /\.docx$/.test(name);
      case 'excel2pdf':
        return /\.(xlsx|csv)$/.test(name);
      default:
        return f.type === 'application/pdf' || /\.pdf$/.test(name);
    }
  }

  function wrongTypeMessage() {
    switch (mode) {
      case 'images': return 'Please choose JPG or PNG images.';
      case 'word2pdf': return 'Please choose a .docx file. Older .doc files are not supported \u2014 open it in Word and save as .docx first.';
      case 'excel2pdf': return 'Please choose an .xlsx or .csv file. Older .xls files are not supported \u2014 open it in Excel and save as .xlsx first.';
      default: return 'Please choose PDF files.';
    }
  }

  function addFiles(fileList) {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;
    clearError();

    const valid = incoming.filter(isAcceptable);

    if (valid.length === 0) {
      showError(wrongTypeMessage());
      return;
    }
    if (valid.length < incoming.length) {
      showError(`${incoming.length - valid.length} file(s) were skipped because they are the wrong type.`);
    }

    if (MODES[mode].multiple) {
      files = files.concat(valid);
    } else {
      files = [valid[0]];
    }

    renderList();
    updatePageCount();

    if (mode === 'annotate') startAnnotator();
  }

  async function startAnnotator() {
    if (files.length === 0) return;
    annotateHost.innerHTML = `
      <div class="flex items-center justify-center gap-3 py-10 text-slate-500 dark:text-slate-400">
        <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span class="text-xs font-semibold">Loading editor...</span>
      </div>`;
    try {
      const { mountAnnotator } = await import('./pdf/annotate.js');
      await mountAnnotator(annotateHost, files[0], { showError, clearError, setStatus });
    } catch (err) {
      annotateHost.innerHTML = '';
      const msg = String(err?.message || err);
      showError(/encrypt/i.test(msg)
        ? 'This PDF is password-protected. Remove the password first, then try again.'
        : msg);
    }
  }

  function applyMode(newMode) {
    mode = newMode;
    files = [];
    clearError();
    setStatus('');

    annotateHost.innerHTML = '';

    modeBtns.forEach(b => {
      const active = b.getAttribute('data-mode') === mode;
      b.className = `pk-mode-btn flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
        active
          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600'
      }`;
    });

    hintEl.textContent = MODES[mode].hint;
    fileInput.accept = MODES[mode].accept;
    fileInput.multiple = MODES[mode].multiple;
    fileInput.value = '';

    acceptNote.textContent = {
      images: 'JPG and PNG files \u00b7 processed entirely in your browser',
      word2pdf: '.docx files \u00b7 processed entirely in your browser',
      excel2pdf: '.xlsx and .csv files \u00b7 processed entirely in your browser'
    }[mode] || 'PDF files \u00b7 processed entirely in your browser';

    // Page-range and rotation options only apply to the organise modes.
    pagesWrap.classList.toggle('hidden', !['split', 'rotate'].includes(mode));
    angleWrap.classList.toggle('hidden', mode !== 'rotate');

    // The annotator has its own Apply button, so hide the generic action row.
    actionRow.classList.toggle('hidden', mode === 'annotate');

    runText.textContent = {
      merge: 'Merge PDFs',
      split: 'Extract Pages',
      rotate: 'Rotate & Download',
      images: 'Create PDF',
      pdf2word: 'Convert to Word',
      word2pdf: 'Convert to PDF',
      excel2pdf: 'Convert to PDF'
    }[mode] || 'Run';

    renderList();
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => applyMode(btn.getAttribute('data-mode')));
  });

  container.querySelectorAll('.pk-angle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      rotateAngle = parseInt(btn.getAttribute('data-angle'), 10);
      container.querySelectorAll('.pk-angle-btn').forEach(b => {
        const active = b === btn;
        b.className = `pk-angle-btn flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold ${
          active ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
        }`;
      });
    });
  });

  fileInput.addEventListener('change', (e) => addFiles(e.target.files));

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-blue-500');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-blue-500'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-500');
    addFiles(e.dataTransfer.files);
  });

  clearBtn.addEventListener('click', () => {
    files = [];
    fileInput.value = '';
    clearError();
    setStatus('');
    annotateHost.innerHTML = '';
    renderList();
  });

  pagesEl.addEventListener('input', clearError);
  runBtn.addEventListener('click', run);

  applyMode('merge');
}
