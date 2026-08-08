import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderBase64Tool(container) {
  let mode = 'encode';

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-center p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 max-w-sm mx-auto">
        <button id="b64-mode-enc" class="flex-1 py-2 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow-xs">
          Encode Text → Base64
        </button>
        <button id="b64-mode-dec" class="flex-1 py-2 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          Decode Base64 → Text
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs text-slate-500">
            <span id="b64-in-label" class="font-semibold uppercase tracking-wider">UTF-8 Input Text</span>
            <button id="b64-clear" class="hover:text-red-500 transition flex items-center gap-1">
              ${getIconSvg('trash', 'w-3.5 h-3.5')} Clear
            </button>
          </div>
          <textarea
            id="b64-input"
            rows="8"
            placeholder="Type content to encode or Base64 string to decode..."
            class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
          ></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs text-slate-500">
            <span id="b64-out-label" class="font-semibold uppercase tracking-wider">Base64 Output</span>
            <button id="b64-copy" class="text-blue-600 hover:text-blue-700 font-semibold transition flex items-center gap-1">
              ${getIconSvg('copy', 'w-3.5 h-3.5')} <span id="b64-copy-text">Copy Result</span>
            </button>
          </div>
          <textarea
            id="b64-output"
            readonly
            rows="8"
            placeholder="Result will appear here automatically..."
            class="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 text-sm font-mono outline-none leading-relaxed"
          ></textarea>
        </div>
      </div>
    </div>
  `;

  const encBtn = container.querySelector('#b64-mode-enc');
  const decBtn = container.querySelector('#b64-mode-dec');
  const inLabel = container.querySelector('#b64-in-label');
  const outLabel = container.querySelector('#b64-out-label');
  const inputEl = container.querySelector('#b64-input');
  const outputEl = container.querySelector('#b64-output');
  const clearBtn = container.querySelector('#b64-clear');
  const copyBtn = container.querySelector('#b64-copy');
  const copyText = container.querySelector('#b64-copy-text');

  function convert() {
    const val = inputEl.value;
    if (!val) {
      outputEl.value = '';
      return;
    }

    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(val);
        let binary = '';
        bytes.forEach(b => { binary += String.fromCharCode(b); });
        outputEl.value = btoa(binary);
      } else {
        const binary = atob(val.trim().replace(/\s+/g, ''));
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        outputEl.value = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      }
    } catch {
      outputEl.value = mode === 'encode'
        ? 'Unable to encode this input.'
        : 'Invalid Base64 input string.';
    }
  }

  inputEl.addEventListener('input', convert);

  encBtn.addEventListener('click', () => {
    mode = 'encode';
    encBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow-xs';
    decBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    inLabel.textContent = 'UTF-8 Input Text';
    outLabel.textContent = 'Base64 Output';
    convert();
  });

  decBtn.addEventListener('click', () => {
    mode = 'decode';
    decBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow-xs';
    encBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    inLabel.textContent = 'Base64 Input String';
    outLabel.textContent = 'Decoded UTF-8 Text';
    convert();
  });

  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    outputEl.value = '';
  });

  copyBtn.addEventListener('click', async () => {
    if (!outputEl.value) return;
    await copyToClipboard(outputEl.value);
    copyText.textContent = 'Copied!';
    setTimeout(() => {
      copyText.textContent = 'Copy Result';
    }, 2000);
  });
}
