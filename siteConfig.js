import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderPasswordGenerator(container) {
  let length = 16;
  let useUpper = true;
  let useLower = true;
  let useNumbers = true;
  let useSymbols = true;

  function generatePassword() {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) return '';

    let pwd = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      pwd += chars[array[i] % chars.length];
    }
    return pwd;
  }

  function calculateStrength(pwd) {
    if (!pwd) return { label: 'Empty', score: 0, color: 'bg-slate-300', textColor: 'text-slate-400' };
    let score = 0;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: 'Weak', score: 25, color: 'bg-red-500', textColor: 'text-red-400' };
    if (score <= 4) return { label: 'Medium', score: 50, color: 'bg-amber-500', textColor: 'text-amber-400' };
    if (score <= 5) return { label: 'Strong', score: 75, color: 'bg-blue-500', textColor: 'text-blue-400' };
    return { label: 'Very Strong', score: 100, color: 'bg-emerald-500', textColor: 'text-emerald-400' };
  }

  container.innerHTML = `
    <div class="space-y-6 max-w-2xl mx-auto">
      <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
        <div class="flex items-center justify-between gap-2">
          <div id="pg-output" class="font-mono text-lg sm:text-2xl font-bold tracking-wider break-all select-all text-emerald-400 min-h-[36px]"></div>
          <div class="flex items-center gap-2 shrink-0">
            <button id="pg-regen-btn" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition focus:outline-none" title="Regenerate">
              ${getIconSvg('refresh', 'w-4 h-4')}
            </button>
            <button id="pg-copy-btn" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition focus:outline-none">
              ${getIconSvg('copy', 'w-4 h-4')} <span id="pg-copy-text">Copy</span>
            </button>
          </div>
        </div>

        <div class="space-y-1 pt-1">
          <div class="flex justify-between text-xs font-semibold text-slate-400">
            <span>Password Strength</span>
            <span id="pg-strength-label" class="text-emerald-400">Strong</span>
          </div>
          <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div id="pg-strength-bar" class="h-full bg-emerald-500 transition-all duration-300" style="width: 75%"></div>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>Password Length</span>
            <span id="pg-len-val" class="font-bold text-blue-600 dark:text-blue-400 text-sm">16</span>
          </div>
          <input
            id="pg-len-slider"
            type="range"
            min="6"
            max="64"
            value="16"
            class="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <input id="pg-chk-upper" type="checkbox" checked class="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer" />
            <span>Uppercase Letters (A-Z)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <input id="pg-chk-lower" type="checkbox" checked class="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer" />
            <span>Lowercase Letters (a-z)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <input id="pg-chk-num" type="checkbox" checked class="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer" />
            <span>Include Numbers (0-9)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <input id="pg-chk-sym" type="checkbox" checked class="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer" />
            <span>Include Symbols (!@#$)</span>
          </label>
        </div>
      </div>
    </div>
  `;

  const outputEl = container.querySelector('#pg-output');
  const lenValEl = container.querySelector('#pg-len-val');
  const lenSlider = container.querySelector('#pg-len-slider');
  const chkUpper = container.querySelector('#pg-chk-upper');
  const chkLower = container.querySelector('#pg-chk-lower');
  const chkNum = container.querySelector('#pg-chk-num');
  const chkSym = container.querySelector('#pg-chk-sym');
  const regenBtn = container.querySelector('#pg-regen-btn');
  const copyBtn = container.querySelector('#pg-copy-btn');
  const copyText = container.querySelector('#pg-copy-text');
  const strengthLabel = container.querySelector('#pg-strength-label');
  const strengthBar = container.querySelector('#pg-strength-bar');

  function update() {
    length = parseInt(lenSlider.value, 10);
    lenValEl.textContent = length;
    useUpper = chkUpper.checked;
    useLower = chkLower.checked;
    useNumbers = chkNum.checked;
    useSymbols = chkSym.checked;

    const pwd = generatePassword();
    outputEl.textContent = pwd || 'Select at least 1 option';

    const st = calculateStrength(pwd);
    strengthLabel.textContent = st.label;
    strengthLabel.className = `font-semibold ${st.textColor}`;
    strengthBar.style.width = `${st.score}%`;
    strengthBar.className = `h-full transition-all duration-300 ${st.color}`;
  }

  lenSlider.addEventListener('input', update);
  chkUpper.addEventListener('change', update);
  chkLower.addEventListener('change', update);
  chkNum.addEventListener('change', update);
  chkSym.addEventListener('change', update);
  regenBtn.addEventListener('click', update);

  copyBtn.addEventListener('click', async () => {
    const pwd = outputEl.textContent;
    if (!pwd || pwd.startsWith('Select')) return;
    await copyToClipboard(pwd);
    copyText.textContent = 'Copied!';
    setTimeout(() => {
      copyText.textContent = 'Copy';
    }, 2000);
  });

  update();
}
