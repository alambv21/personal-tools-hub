import { getIconSvg } from '../icons.js';

export function renderAgeCalculator(container) {
  const today = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="space-y-6 max-w-2xl mx-auto">
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Select Birth Date
          </label>
          <input
            id="ac-date-input"
            type="date"
            max="${today}"
            value="1998-05-15"
            class="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-blue-50 dark:bg-blue-950/40 text-center space-y-1">
          <span class="block text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Years Old</span>
          <span id="ac-years" class="text-3xl font-extrabold text-blue-700 dark:text-blue-300">0</span>
        </div>
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-1">
          <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Months</span>
          <span id="ac-months" class="text-3xl font-extrabold text-slate-800 dark:text-slate-200">0</span>
        </div>
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-1">
          <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Days</span>
          <span id="ac-days" class="text-3xl font-extrabold text-slate-800 dark:text-slate-200">0</span>
        </div>
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Lifetime Milestones</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span class="block text-slate-400">Total Days</span>
            <span id="ac-total-days" class="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">0</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span class="block text-slate-400">Total Hours</span>
            <span id="ac-total-hours" class="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">0</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span class="block text-slate-400">Next Birthday</span>
            <span id="ac-next-bday" class="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">0 days</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const dateInput = container.querySelector('#ac-date-input');
  const yearsEl = container.querySelector('#ac-years');
  const monthsEl = container.querySelector('#ac-months');
  const daysEl = container.querySelector('#ac-days');
  const totalDaysEl = container.querySelector('#ac-total-days');
  const totalHoursEl = container.querySelector('#ac-total-hours');
  const nextBdayEl = container.querySelector('#ac-next-bday');

  function calculate() {
    const birthStr = dateInput.value;
    if (!birthStr) return;

    const birth = new Date(birthStr);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) return;

    let yrs = now.getFullYear() - birth.getFullYear();
    let mths = now.getMonth() - birth.getMonth();
    let dys = now.getDate() - birth.getDate();

    if (dys < 0) {
      mths -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      dys += prevMonth.getDate();
    }

    if (mths < 0) {
      yrs -= 1;
      mths += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // Next birthday calculation
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (now > nextBday) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    yearsEl.textContent = yrs;
    monthsEl.textContent = mths;
    daysEl.textContent = dys;
    totalDaysEl.textContent = totalDays.toLocaleString();
    totalHoursEl.textContent = totalHours.toLocaleString();
    nextBdayEl.textContent = `${daysToNext} days`;
  }

  dateInput.addEventListener('change', calculate);
  calculate();
}
