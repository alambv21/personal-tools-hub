import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderJsonFormatter(container) {
  let indent = 2;

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        <div class="flex items-center gap-2">
          <button id="jf-fmt-2" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs">Prettify (2 spaces)</button>
          <button id="jf-fmt-4" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition">Prettify (4 spaces)</button>
          <button id="jf-minify" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition">Minify</button>
        </div>
        <div class="flex items-center gap-2">
          <button id="jf-clear" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-500 transition flex items-center gap-1">
            ${getIconSvg('trash', 'w-3.5 h-3.5')} Clear
          </button>
          <button id="jf-copy" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
            ${getIconSvg('copy', 'w-3.5 h-3.5')} <span id="jf-copy-text">Copy Output</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Raw JSON Input</label>
          <textarea
            id="jf-input"
            rows="14"
            placeholder='{"name": "Personal Tools Hub", "active": true, "items": [1, 2, 3]}'
            class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
          ></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Formatted Result</label>
            <span id="jf-status" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Waiting for input</span>
          </div>
          <pre id="jf-output" class="w-full h-[320px] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs overflow-auto text-slate-800 dark:text-slate-200 leading-relaxed"></pre>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#jf-input');
  const outputEl = container.querySelector('#jf-output');
  const statusEl = container.querySelector('#jf-status');
  const fmt2Btn = container.querySelector('#jf-fmt-2');
  const fmt4Btn = container.querySelector('#jf-fmt-4');
  const minifyBtn = container.querySelector('#jf-minify');
  const clearBtn = container.querySelector('#jf-clear');
  const copyBtn = container.querySelector('#jf-copy');
  const copyText = container.querySelector('#jf-copy-text');

  function processJson(type = 'format', spaces = 2) {
    const val = inputEl.value.trim();
    if (!val) {
      outputEl.textContent = '';
      statusEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      statusEl.textContent = 'Waiting for input';
      return;
    }

    try {
      const parsed = JSON.parse(val);
      if (type === 'format') {
        outputEl.textContent = JSON.stringify(parsed, null, spaces);
      } else {
        outputEl.textContent = JSON.stringify(parsed);
      }
      statusEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300';
      statusEl.textContent = 'Valid JSON';
    } catch (err) {
      outputEl.textContent = err.message;
      statusEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300';
      statusEl.textContent = 'Invalid JSON';
    }
  }

  inputEl.addEventListener('input', () => processJson('format', indent));

  fmt2Btn.addEventListener('click', () => {
    indent = 2;
    fmt2Btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs';
    fmt4Btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition';
    processJson('format', 2);
  });

  fmt4Btn.addEventListener('click', () => {
    indent = 4;
    fmt4Btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs';
    fmt2Btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition';
    processJson('format', 4);
  });

  minifyBtn.addEventListener('click', () => {
    processJson('minify');
  });

  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    outputEl.textContent = '';
    processJson('format', 2);
  });

  copyBtn.addEventListener('click', async () => {
    if (!outputEl.textContent) return;
    await copyToClipboard(outputEl.textContent);
    copyText.textContent = 'Copied!';
    setTimeout(() => {
      copyText.textContent = 'Copy Output';
    }, 2000);
  });
}
