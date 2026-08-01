import { getIconSvg } from '../icons.js';

export function renderImageCompressor(container) {
  let originalFile = null;
  let originalBitmapW = 0;
  let originalBitmapH = 0;
  let originalDataUrl = '';
  let resultBlob = null;
  let lockAspect = true;

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Drop zone -->
      <div id="ic-drop" class="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center transition hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
        <input id="ic-file" type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div class="flex flex-col items-center gap-2 pointer-events-none">
          ${getIconSvg('upload', 'w-8 h-8 text-blue-600 dark:text-blue-400')}
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Drop an image here or click to browse</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WebP, GIF, BMP &middot; processed entirely in your browser</p>
        </div>
      </div>

      <div id="ic-workspace" class="hidden space-y-6">
        <!-- Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Resize</h3>

            <div class="flex items-end gap-2">
              <div class="flex-1">
                <label for="ic-width" class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Width (px)</label>
                <input id="ic-width" type="number" min="1" max="10000" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
              <div class="flex-1">
                <label for="ic-height" class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Height (px)</label>
                <input id="ic-height" type="number" min="1" max="10000" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>

            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              <input id="ic-lock" type="checkbox" checked class="rounded accent-blue-600" />
              Maintain aspect ratio
            </label>

            <div class="flex flex-wrap gap-1.5">
              <button data-scale="1" class="ic-preset px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition">100%</button>
              <button data-scale="0.75" class="ic-preset px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition">75%</button>
              <button data-scale="0.5" class="ic-preset px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition">50%</button>
              <button data-scale="0.25" class="ic-preset px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition">25%</button>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Compress</h3>

            <div>
              <label for="ic-format" class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Output format</label>
              <select id="ic-format" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500">
                <option value="image/jpeg">JPEG (smallest, no transparency)</option>
                <option value="image/webp" selected>WebP (best balance)</option>
                <option value="image/png">PNG (lossless, keeps transparency)</option>
              </select>
            </div>

            <div id="ic-quality-wrap">
              <div class="flex items-center justify-between mb-1">
                <label for="ic-quality" class="text-xs text-slate-500 dark:text-slate-400">Quality</label>
                <span id="ic-quality-val" class="text-xs font-bold text-blue-600 dark:text-blue-400">80%</span>
              </div>
              <input id="ic-quality" type="range" min="10" max="100" value="80" class="w-full accent-blue-600" />
            </div>

            <p id="ic-png-note" class="hidden text-xs text-amber-600 dark:text-amber-400">
              PNG is lossless — the quality slider does not apply. Resizing still reduces file size.
            </p>
          </div>
        </div>

        <!-- Preview + stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">Original</h3>
            <div class="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden mb-3">
              <img id="ic-preview-orig" alt="Original preview" class="max-w-full max-h-full object-contain" />
            </div>
            <dl class="space-y-1 text-xs">
              <div class="flex justify-between"><dt class="text-slate-500 dark:text-slate-400">Dimensions</dt><dd id="ic-orig-dim" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd></div>
              <div class="flex justify-between"><dt class="text-slate-500 dark:text-slate-400">File size</dt><dd id="ic-orig-size" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd></div>
            </dl>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">Result</h3>
            <div class="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden mb-3">
              <img id="ic-preview-new" alt="Compressed preview" class="max-w-full max-h-full object-contain" />
            </div>
            <dl class="space-y-1 text-xs">
              <div class="flex justify-between"><dt class="text-slate-500 dark:text-slate-400">Dimensions</dt><dd id="ic-new-dim" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd></div>
              <div class="flex justify-between"><dt class="text-slate-500 dark:text-slate-400">File size</dt><dd id="ic-new-size" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd></div>
              <div class="flex justify-between"><dt class="text-slate-500 dark:text-slate-400">Saved</dt><dd id="ic-saved" class="font-bold text-emerald-600 dark:text-emerald-400">&mdash;</dd></div>
            </dl>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button id="ic-download" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center gap-1.5">
            ${getIconSvg('download', 'w-3.5 h-3.5')} Download Image
          </button>
          <button id="ic-reset" class="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition">
            Choose Another Image
          </button>
        </div>
      </div>

      <p id="ic-error" class="hidden text-xs text-red-600 dark:text-red-400 font-medium"></p>
    </div>
  `;

  const dropZone = container.querySelector('#ic-drop');
  const fileInput = container.querySelector('#ic-file');
  const workspace = container.querySelector('#ic-workspace');
  const widthEl = container.querySelector('#ic-width');
  const heightEl = container.querySelector('#ic-height');
  const lockEl = container.querySelector('#ic-lock');
  const formatEl = container.querySelector('#ic-format');
  const qualityEl = container.querySelector('#ic-quality');
  const qualityVal = container.querySelector('#ic-quality-val');
  const qualityWrap = container.querySelector('#ic-quality-wrap');
  const pngNote = container.querySelector('#ic-png-note');
  const previewOrig = container.querySelector('#ic-preview-orig');
  const previewNew = container.querySelector('#ic-preview-new');
  const origDim = container.querySelector('#ic-orig-dim');
  const origSize = container.querySelector('#ic-orig-size');
  const newDim = container.querySelector('#ic-new-dim');
  const newSize = container.querySelector('#ic-new-size');
  const savedEl = container.querySelector('#ic-saved');
  const downloadBtn = container.querySelector('#ic-download');
  const resetBtn = container.querySelector('#ic-reset');
  const errorEl = container.querySelector('#ic-error');

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }
  function clearError() {
    errorEl.classList.add('hidden');
  }

  function loadFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError('That file is not an image. Please choose a JPG, PNG, WebP, GIF, or BMP file.');
      return;
    }
    clearError();
    originalFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      originalDataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        originalBitmapW = img.naturalWidth;
        originalBitmapH = img.naturalHeight;

        previewOrig.src = originalDataUrl;
        origDim.textContent = `${originalBitmapW} \u00d7 ${originalBitmapH} px`;
        origSize.textContent = formatBytes(file.size);

        widthEl.value = originalBitmapW;
        heightEl.value = originalBitmapH;

        workspace.classList.remove('hidden');
        process();
      };
      img.onerror = () => showError('This image could not be read. It may be corrupted or in an unsupported format.');
      img.src = originalDataUrl;
    };
    reader.onerror = () => showError('Could not read that file. Please try again.');
    reader.readAsDataURL(file);
  }

  // Debounce so dragging the quality slider doesn't re-encode on every pixel.
  let processTimer = null;
  function scheduleProcess() {
    clearTimeout(processTimer);
    processTimer = setTimeout(process, 200);
  }

  function process() {
    if (!originalDataUrl) return;

    const targetW = Math.max(1, Math.min(parseInt(widthEl.value, 10) || 1, 10000));
    const targetH = Math.max(1, Math.min(parseInt(heightEl.value, 10) || 1, 10000));
    const format = formatEl.value;
    const quality = parseInt(qualityEl.value, 10) / 100;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      // JPEG has no alpha channel; without a white base, transparent areas
      // would render as black.
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            showError('Could not encode the image in that format. Try a different output format.');
            return;
          }
          clearError();
          resultBlob = blob;

          if (previewNew.src && previewNew.src.startsWith('blob:')) {
            URL.revokeObjectURL(previewNew.src);
          }
          previewNew.src = URL.createObjectURL(blob);

          newDim.textContent = `${targetW} \u00d7 ${targetH} px`;
          newSize.textContent = formatBytes(blob.size);

          const diff = originalFile.size - blob.size;
          const pct = originalFile.size > 0 ? (diff / originalFile.size) * 100 : 0;
          if (diff > 0) {
            savedEl.textContent = `${formatBytes(diff)} (${pct.toFixed(1)}% smaller)`;
            savedEl.className = 'font-bold text-emerald-600 dark:text-emerald-400';
          } else {
            savedEl.textContent = `${formatBytes(Math.abs(diff))} larger`;
            savedEl.className = 'font-bold text-amber-600 dark:text-amber-400';
          }
        },
        format,
        format === 'image/png' ? undefined : quality
      );
    };
    img.src = originalDataUrl;
  }

  // --- Events ---
  fileInput.addEventListener('change', (e) => loadFile(e.target.files[0]));

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-blue-500');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-blue-500'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-500');
    loadFile(e.dataTransfer.files[0]);
  });

  lockEl.addEventListener('change', () => { lockAspect = lockEl.checked; });

  widthEl.addEventListener('input', () => {
    if (lockAspect && originalBitmapW) {
      const w = parseInt(widthEl.value, 10);
      if (w > 0) heightEl.value = Math.round((w / originalBitmapW) * originalBitmapH);
    }
    scheduleProcess();
  });

  heightEl.addEventListener('input', () => {
    if (lockAspect && originalBitmapH) {
      const h = parseInt(heightEl.value, 10);
      if (h > 0) widthEl.value = Math.round((h / originalBitmapH) * originalBitmapW);
    }
    scheduleProcess();
  });

  container.querySelectorAll('.ic-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!originalBitmapW) return;
      const scale = parseFloat(btn.getAttribute('data-scale'));
      widthEl.value = Math.max(1, Math.round(originalBitmapW * scale));
      heightEl.value = Math.max(1, Math.round(originalBitmapH * scale));
      process();
    });
  });

  formatEl.addEventListener('change', () => {
    const isPng = formatEl.value === 'image/png';
    qualityWrap.classList.toggle('hidden', isPng);
    pngNote.classList.toggle('hidden', !isPng);
    process();
  });

  qualityEl.addEventListener('input', () => {
    qualityVal.textContent = `${qualityEl.value}%`;
    scheduleProcess();
  });

  downloadBtn.addEventListener('click', () => {
    if (!resultBlob) return;
    const ext = formatEl.value.split('/')[1].replace('jpeg', 'jpg');
    const baseName = (originalFile?.name || 'image').replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-optimized.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    originalFile = null;
    originalDataUrl = '';
    resultBlob = null;
    workspace.classList.add('hidden');
    clearError();
  });
}
