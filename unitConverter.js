import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderCaseConverter(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Input text to convert:</span>
          <div class="flex items-center gap-2">
            <button id="cc-clear-btn" class="inline-flex items-center gap-1 hover:text-red-500 transition-colors focus:outline-none">
              ${getIconSvg('trash', 'w-3.5 h-3.5')} Clear
            </button>
            <button id="cc-copy-btn" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors focus:outline-none">
              ${getIconSvg('copy', 'w-3.5 h-3.5')} <span id="cc-copy-text">Copy Text</span>
            </button>
          </div>
        </div>
        <textarea
          id="cc-input"
          rows="8"
          placeholder="Type or paste text here to transform cases..."
          class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <button data-case="upper" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          UPPERCASE
        </button>
        <button data-case="lower" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          lowercase
        </button>
        <button data-case="title" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          Title Case
        </button>
        <button data-case="sentence" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          Sentence case
        </button>
        <button data-case="camel" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          camelCase
        </button>
        <button data-case="kebab" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          kebab-case
        </button>
        <button data-case="snake" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          snake_case
        </button>
        <button data-case="pascal" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          PascalCase
        </button>
        <button data-case="alternating" class="cc-btn px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">
          aLtErNaTiNg
        </button>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#cc-input');
  const clearBtn = container.querySelector('#cc-clear-btn');
  const copyBtn = container.querySelector('#cc-copy-btn');
  const copyText = container.querySelector('#cc-copy-text');

  function convertText(type) {
    const text = inputEl.value;
    if (!text) return;

    let res = text;
    switch (type) {
      case 'upper':
        res = text.toUpperCase();
        break;
      case 'lower':
        res = text.toLowerCase();
        break;
      case 'title':
        res = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentence':
        res = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camel':
        res = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
          .replace(/\s+/g, '')
          .replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 'kebab':
        res = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        break;
      case 'snake':
        res = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        break;
      case 'pascal':
        res = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '')
          .replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 'alternating':
        res = text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
        break;
    }
    inputEl.value = res;
  }

  container.querySelectorAll('.cc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      convertText(btn.getAttribute('data-case'));
    });
  });

  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
  });

  copyBtn.addEventListener('click', async () => {
    if (!inputEl.value) return;
    await copyToClipboard(inputEl.value);
    copyText.textContent = 'Copied!';
    setTimeout(() => {
      copyText.textContent = 'Copy Text';
    }, 2000);
  });
}
