import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderLoremGenerator(container) {
  const DEFAULT_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
    'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit'
  ];

  let unit = 'paragraphs';
  let count = 3;

  // Parse the user's custom word list. Accepts words separated by commas,
  // spaces, tabs, or new lines. Falls back to the classic Lorem Ipsum
  // vocabulary when the box is empty.
  function getWordPool() {
    const raw = (wordsInput?.value || '').trim();
    if (!raw) return { words: DEFAULT_WORDS, isCustom: false };

    const parsed = raw
      .split(/[\s,]+/)
      .map(w => w.trim())
      .filter(Boolean);

    if (parsed.length === 0) return { words: DEFAULT_WORDS, isCustom: false };
    return { words: parsed, isCustom: true };
  }

  function pick(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function buildSentence(pool) {
    const wordCount = 6 + Math.floor(Math.random() * 8);
    const sentWords = [];
    for (let w = 0; w < wordCount; w++) sentWords.push(pick(pool));
    const sentStr = sentWords.join(' ');
    return sentStr.charAt(0).toUpperCase() + sentStr.slice(1) + '.';
  }

  function generate() {
    const { words: pool, isCustom } = getWordPool();
    const result = [];

    if (unit === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        const para = [];
        const sentenceCount = 4 + Math.floor(Math.random() * 3);
        for (let s = 0; s < sentenceCount; s++) para.push(buildSentence(pool));
        // Only use the classic opener when generating standard Lorem Ipsum;
        // injecting it into a custom word list would be confusing.
        if (i === 0 && !isCustom) {
          para[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' + para[0].toLowerCase();
        }
        result.push(para.join(' '));
      }
      return result.join('\n\n');
    }

    if (unit === 'sentences') {
      for (let s = 0; s < count; s++) result.push(buildSentence(pool));
      return result.join(' ');
    }

    const words = [];
    for (let w = 0; w < count; w++) words.push(pick(pool));
    return words.join(' ');
  }

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        <div class="flex items-center gap-3">
          <select id="lg-unit" class="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none">
            <option value="paragraphs" selected>Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
          <input
            id="lg-count"
            type="number"
            min="1"
            max="50"
            value="3"
            class="w-20 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-center outline-none"
          />
        </div>

        <div class="flex items-center gap-2">
          <button id="lg-gen-btn" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
            Generate Text
          </button>
          <button id="lg-copy-btn" class="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1">
            ${getIconSvg('copy', 'w-3.5 h-3.5')} <span id="lg-copy-text">Copy Text</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <label for="lg-words" class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Your Word List
            </label>
            <button id="lg-clear-btn" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Use classic Lorem
            </button>
          </div>
          <textarea
            id="lg-words"
            rows="10"
            placeholder="Type your own words here, separated by commas, spaces, or new lines.&#10;&#10;Example: coffee, morning, sunrise, quiet, warm&#10;&#10;Leave this empty to use classic Lorem Ipsum."
            class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm leading-relaxed outline-none focus:border-blue-500 dark:focus:border-blue-500 transition"
          ></textarea>
          <p id="lg-word-status" class="text-xs text-slate-500 dark:text-slate-400"></p>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <label for="lg-output" class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Generated Output
            </label>
            <span class="text-xs text-slate-400 dark:text-slate-500">Read-only</span>
          </div>
          <textarea
            id="lg-output"
            rows="10"
            readonly
            class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm leading-relaxed outline-none"
          ></textarea>
          <p id="lg-out-status" class="text-xs text-slate-500 dark:text-slate-400"></p>
        </div>
      </div>
    </div>
  `;

  const unitSelect = container.querySelector('#lg-unit');
  const countInput = container.querySelector('#lg-count');
  const genBtn = container.querySelector('#lg-gen-btn');
  const copyBtn = container.querySelector('#lg-copy-btn');
  const copyText = container.querySelector('#lg-copy-text');
  const clearBtn = container.querySelector('#lg-clear-btn');
  const wordsInput = container.querySelector('#lg-words');
  const outputEl = container.querySelector('#lg-output');
  const wordStatus = container.querySelector('#lg-word-status');
  const outStatus = container.querySelector('#lg-out-status');

  function updateText() {
    unit = unitSelect.value;
    const parsedCount = parseInt(countInput.value, 10);
    count = Number.isFinite(parsedCount) && parsedCount > 0 ? Math.min(parsedCount, 50) : 1;

    const { words: pool, isCustom } = getWordPool();
    wordStatus.textContent = isCustom
      ? `Using your ${pool.length} custom word${pool.length === 1 ? '' : 's'}.`
      : 'Empty — using classic Lorem Ipsum vocabulary.';

    outputEl.value = generate();

    const charCount = outputEl.value.length;
    const genWordCount = outputEl.value.trim() ? outputEl.value.trim().split(/\s+/).length : 0;
    outStatus.textContent = `${genWordCount.toLocaleString()} words · ${charCount.toLocaleString()} characters`;
  }

  // Debounce so the output doesn't re-randomise on every single keystroke
  // while the user is still typing their word list.
  let debounceTimer = null;
  function debouncedUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateText, 400);
  }

  unitSelect.addEventListener('change', updateText);
  countInput.addEventListener('input', updateText);
  genBtn.addEventListener('click', updateText);
  wordsInput.addEventListener('input', debouncedUpdate);

  clearBtn.addEventListener('click', () => {
    wordsInput.value = '';
    updateText();
    wordsInput.focus();
  });

  copyBtn.addEventListener('click', async () => {
    if (!outputEl.value) return;
    await copyToClipboard(outputEl.value);
    copyText.textContent = 'Copied!';
    setTimeout(() => {
      copyText.textContent = 'Copy Text';
    }, 2000);
  });

  updateText();
}
