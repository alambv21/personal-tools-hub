import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderHashGenerator(container) {
  let mode = 'hash';

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-center p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 max-w-sm mx-auto">
        <button id="hd-mode-hash" class="flex-1 py-2 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow-xs">
          Hash Generator
        </button>
        <button id="hd-mode-diff" class="flex-1 py-2 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          Text Diff Checker
        </button>
      </div>

      <div id="hd-view-hash" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Input String</label>
          <textarea
            id="hd-hash-input"
            rows="4"
            placeholder="Type or paste text to compute hashes..."
            class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
          ></textarea>
        </div>

        <div class="space-y-3 pt-2">
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase">SHA-256 Digest</span>
              <button id="hd-copy-sha256" class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                ${getIconSvg('copy', 'w-3.5 h-3.5')} Copy
              </button>
            </div>
            <div id="hd-sha256" class="font-mono text-xs break-all text-slate-800 dark:text-slate-200 font-semibold min-h-[20px]">-</div>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase">SHA-1 Digest</span>
              <button id="hd-copy-sha1" class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                ${getIconSvg('copy', 'w-3.5 h-3.5')} Copy
              </button>
            </div>
            <div id="hd-sha1" class="font-mono text-xs break-all text-slate-800 dark:text-slate-200 font-semibold min-h-[20px]">-</div>
          </div>
        </div>
      </div>

      <div id="hd-view-diff" class="space-y-4 hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Original Text (A)</label>
            <textarea
              id="hd-diff-a"
              rows="6"
              placeholder="Paste original text here..."
              class="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono outline-none"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Modified Text (B)</label>
            <textarea
              id="hd-diff-b"
              rows="6"
              placeholder="Paste modified text here..."
              class="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono outline-none"
            ></textarea>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Difference Result</label>
          <div id="hd-diff-output" class="w-full min-h-[160px] max-h-[300px] overflow-y-auto p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs leading-relaxed space-y-1"></div>
        </div>
      </div>
    </div>
  `;

  const modeHashBtn = container.querySelector('#hd-mode-hash');
  const modeDiffBtn = container.querySelector('#hd-mode-diff');
  const viewHash = container.querySelector('#hd-view-hash');
  const viewDiff = container.querySelector('#hd-view-diff');

  // Hash Elements
  const hashInput = container.querySelector('#hd-hash-input');
  const sha256El = container.querySelector('#hd-sha256');
  const sha1El = container.querySelector('#hd-sha1');
  const copySha256Btn = container.querySelector('#hd-copy-sha256');
  const copySha1Btn = container.querySelector('#hd-copy-sha1');

  // Diff Elements
  const diffA = container.querySelector('#hd-diff-a');
  const diffB = container.querySelector('#hd-diff-b');
  const diffOutput = container.querySelector('#hd-diff-output');

  async function computeHashes() {
    const text = hashInput.value;
    if (!text) {
      sha256El.textContent = '-';
      sha1El.textContent = '-';
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const buf256 = await crypto.subtle.digest('SHA-256', data);
    const hash256 = Array.from(new Uint8Array(buf256)).map(b => b.toString(16).padStart(2, '0')).join('');
    sha256El.textContent = hash256;

    const buf1 = await crypto.subtle.digest('SHA-1', data);
    const hash1 = Array.from(new Uint8Array(buf1)).map(b => b.toString(16).padStart(2, '0')).join('');
    sha1El.textContent = hash1;
  }

  function computeDiff() {
    const linesA = diffA.value.split('\n');
    const linesB = diffB.value.split('\n');
    const max = Math.max(linesA.length, linesB.length);

    let html = '';
    for (let i = 0; i < max; i++) {
      const a = linesA[i];
      const b = linesB[i];

      if (a === b) {
        if (a !== undefined) {
          html += `<div class="text-slate-600 dark:text-slate-400">  ${escapeHtml(a)}</div>`;
        }
      } else {
        if (a !== undefined) {
          html += `<div class="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">- ${escapeHtml(a)}</div>`;
        }
        if (b !== undefined) {
          html += `<div class="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">+ ${escapeHtml(b)}</div>`;
        }
      }
    }
    diffOutput.innerHTML = html || '<span class="text-slate-400">No content to compare.</span>';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  hashInput.addEventListener('input', computeHashes);
  diffA.addEventListener('input', computeDiff);
  diffB.addEventListener('input', computeDiff);

  copySha256Btn.addEventListener('click', () => copyToClipboard(sha256El.textContent));
  copySha1Btn.addEventListener('click', () => copyToClipboard(sha1El.textContent));

  modeHashBtn.addEventListener('click', () => {
    mode = 'hash';
    modeHashBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow-xs';
    modeDiffBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    viewHash.classList.remove('hidden');
    viewDiff.classList.add('hidden');
  });

  modeDiffBtn.addEventListener('click', () => {
    mode = 'diff';
    modeDiffBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow-xs';
    modeHashBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    viewDiff.classList.remove('hidden');
    viewHash.classList.add('hidden');
    computeDiff();
  });
}
