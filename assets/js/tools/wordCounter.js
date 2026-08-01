import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderWordCounter(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <span class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Words</span>
          <span id="wc-words" class="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">0</span>
        </div>
        <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <span class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Characters</span>
          <span id="wc-chars" class="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 block">0</span>
        </div>
        <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <span class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">No Spaces</span>
          <span id="wc-nospaces" class="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 block">0</span>
        </div>
        <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <span class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sentences</span>
          <span id="wc-sentences" class="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 block">0</span>
        </div>
        <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <span class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Paragraphs</span>
          <span id="wc-paragraphs" class="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 block">0</span>
        </div>
        <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <span class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reading Time</span>
          <span id="wc-readtime" class="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">0m</span>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Type or paste your text below:</span>
          <div class="flex items-center gap-2">
            <button id="wc-clear-btn" class="inline-flex items-center gap-1 hover:text-red-500 transition-colors focus:outline-none">
              ${getIconSvg('trash', 'w-3.5 h-3.5')} Clear
            </button>
            <button id="wc-copy-btn" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors focus:outline-none">
              ${getIconSvg('copy', 'w-3.5 h-3.5')} <span id="wc-copy-text">Copy Text</span>
            </button>
          </div>
        </div>
        <textarea
          id="wc-input"
          rows="10"
          placeholder="Start typing or paste content here..."
          class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed transition-all"
        ></textarea>
      </div>

      <div id="wc-keywords-container" class="space-y-2 hidden pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Top Keyword Density</h4>
        <div id="wc-keywords-list" class="flex flex-wrap gap-2 text-xs"></div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#wc-input');
  const wordsEl = container.querySelector('#wc-words');
  const charsEl = container.querySelector('#wc-chars');
  const nospacesEl = container.querySelector('#wc-nospaces');
  const sentencesEl = container.querySelector('#wc-sentences');
  const paragraphsEl = container.querySelector('#wc-paragraphs');
  const readtimeEl = container.querySelector('#wc-readtime');
  const clearBtn = container.querySelector('#wc-clear-btn');
  const copyBtn = container.querySelector('#wc-copy-btn');
  const copyText = container.querySelector('#wc-copy-text');
  const keywordsContainer = container.querySelector('#wc-keywords-container');
  const keywordsList = container.querySelector('#wc-keywords-list');

  function updateStats() {
    const text = inputEl.value;
    const wordsArr = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
    const wordCount = wordsArr.length;
    const charCount = text.length;
    const noSpacesCount = text.replace(/\s+/g, '').length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphCount = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    wordsEl.textContent = wordCount.toLocaleString();
    charsEl.textContent = charCount.toLocaleString();
    nospacesEl.textContent = noSpacesCount.toLocaleString();
    sentencesEl.textContent = sentenceCount.toLocaleString();
    paragraphsEl.textContent = paragraphCount.toLocaleString();
    readtimeEl.textContent = `${readingTimeMinutes}m`;

    // Keyword density analysis
    if (wordCount >= 5) {
      keywordsContainer.classList.remove('hidden');
      const freq = {};
      const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'with', 'was', 'as', 'at', 'by', 'an', 'be', 'are']);
      wordsArr.forEach(w => {
        const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (clean.length >= 3 && !stopWords.has(clean)) {
          freq[clean] = (freq[clean] || 0) + 1;
        }
      });
      const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6);
      if (topWords.length > 0) {
        keywordsList.innerHTML = topWords.map(([w, count]) => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <span>${w}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold">${count}</span>
          </span>
        `).join('');
      } else {
        keywordsContainer.classList.add('hidden');
      }
    } else {
      keywordsContainer.classList.add('hidden');
    }
  }

  inputEl.addEventListener('input', updateStats);

  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    updateStats();
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
