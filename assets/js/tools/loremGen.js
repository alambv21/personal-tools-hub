import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderLoremGenerator(container) {
  const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
    'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'faint', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit'
  ];

  let unit = 'paragraphs';
  let count = 3;

  function generate() {
    let result = [];
    if (unit === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        let para = [];
        const sentenceCount = 4 + Math.floor(Math.random() * 3);
        for (let s = 0; s < sentenceCount; s++) {
          let sentWords = [];
          const wordCount = 6 + Math.floor(Math.random() * 8);
          for (let w = 0; w < wordCount; w++) {
            sentWords.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
          }
          let sentStr = sentWords.join(' ');
          sentStr = sentStr.charAt(0).toUpperCase() + sentStr.slice(1) + '.';
          para.push(sentStr);
        }
        if (i === 0) {
          para[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' + para[0].toLowerCase();
        }
        result.push(para.join(' '));
      }
      return result.join('\n\n');
    } else if (unit === 'sentences') {
      for (let s = 0; s < count; s++) {
        let sentWords = [];
        const wordCount = 6 + Math.floor(Math.random() * 8);
        for (let w = 0; w < wordCount; w++) {
          sentWords.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
        let sentStr = sentWords.join(' ');
        sentStr = sentStr.charAt(0).toUpperCase() + sentStr.slice(1) + '.';
        result.push(sentStr);
      }
      return result.join(' ');
    } else {
      let words = [];
      for (let w = 0; w < count; w++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      return words.join(' ');
    }
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

      <textarea
        id="lg-output"
        rows="10"
        readonly
        class="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm leading-relaxed outline-none"
      ></textarea>
    </div>
  `;

  const unitSelect = container.querySelector('#lg-unit');
  const countInput = container.querySelector('#lg-count');
  const genBtn = container.querySelector('#lg-gen-btn');
  const copyBtn = container.querySelector('#lg-copy-btn');
  const copyText = container.querySelector('#lg-copy-text');
  const outputEl = container.querySelector('#lg-output');

  function updateText() {
    unit = unitSelect.value;
    count = parseInt(countInput.value, 10) || 1;
    outputEl.value = generate();
  }

  unitSelect.addEventListener('change', updateText);
  countInput.addEventListener('input', updateText);
  genBtn.addEventListener('click', updateText);

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
