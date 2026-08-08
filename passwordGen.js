import { getIconSvg } from '../icons.js';

export function renderBmiCalculator(container) {
  let units = 'metric';

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Unit toggle -->
      <div class="flex items-center justify-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 gap-1">
        <button data-units="metric" class="bmi-unit-btn flex-1 py-2 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow-xs">
          Metric (cm / kg)
        </button>
        <button data-units="imperial" class="bmi-unit-btn flex-1 py-2 rounded-lg text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          Imperial (ft-in / lb)
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Inputs -->
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Your Measurements</h3>

          <!-- Height: metric -->
          <div id="bmi-height-metric">
            <label for="bmi-cm" class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Height (cm)</label>
            <input id="bmi-cm" type="number" min="50" max="260" step="0.1" placeholder="170"
              class="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
          </div>

          <!-- Height: imperial -->
          <div id="bmi-height-imperial" class="hidden">
            <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Height</label>
            <div class="flex gap-2">
              <div class="flex-1">
                <input id="bmi-ft" type="number" min="1" max="8" placeholder="5"
                  class="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
                <span class="block text-center text-xs text-slate-400 mt-1">feet</span>
              </div>
              <div class="flex-1">
                <input id="bmi-in" type="number" min="0" max="11.9" step="0.1" placeholder="9"
                  class="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
                <span class="block text-center text-xs text-slate-400 mt-1">inches</span>
              </div>
            </div>
          </div>

          <!-- Weight -->
          <div>
            <label for="bmi-weight" class="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              Weight (<span id="bmi-weight-unit">kg</span>)
            </label>
            <input id="bmi-weight" type="number" min="1" max="700" step="0.1" placeholder="65"
              class="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
          </div>

          <!-- Sex (only affects ideal-weight formulas, not BMI) -->
          <div>
            <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Sex</label>
            <div class="flex gap-2">
              <label class="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer text-xs font-semibold has-checked:border-blue-500">
                <input type="radio" name="bmi-sex" value="male" checked class="accent-blue-600" /> Male
              </label>
              <label class="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer text-xs font-semibold has-checked:border-blue-500">
                <input type="radio" name="bmi-sex" value="female" class="accent-blue-600" /> Female
              </label>
            </div>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              Used only for the ideal-weight formulas below. BMI itself does not use sex.
            </p>
          </div>
        </div>

        <!-- Results -->
        <div class="space-y-4">
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">Your BMI</h3>
            <p id="bmi-value" class="text-5xl font-black text-slate-300 dark:text-slate-700 tabular-nums">&mdash;</p>
            <p id="bmi-category" class="mt-2 text-sm font-bold text-slate-400 dark:text-slate-500">Enter your measurements</p>

            <!-- Scale bar -->
            <div class="mt-4">
              <div class="relative h-2.5 rounded-full overflow-hidden flex">
                <div class="bg-sky-400" style="width:18.5%"></div>
                <div class="bg-emerald-500" style="width:31.5%"></div>
                <div class="bg-amber-500" style="width:25%"></div>
                <div class="bg-red-500" style="width:25%"></div>
              </div>
              <div id="bmi-marker-wrap" class="relative h-4 hidden">
                <div id="bmi-marker" class="absolute top-0 -translate-x-1/2 transition-all duration-300">
                  <div class="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-800 dark:border-b-slate-100 mx-auto"></div>
                </div>
              </div>
              <div class="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
                <span>Under</span><span>Healthy</span><span>Over</span><span>Obese</span>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">Reference Ranges</h3>
            <dl class="space-y-2 text-xs">
              <div class="flex justify-between gap-2">
                <dt class="text-slate-500 dark:text-slate-400">Healthy BMI range</dt>
                <dd class="font-semibold text-slate-700 dark:text-slate-200">18.5 &ndash; 24.9</dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-slate-500 dark:text-slate-400">Weight for that BMI range</dt>
                <dd id="bmi-healthy-weight" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-slate-500 dark:text-slate-400">Devine formula</dt>
                <dd id="bmi-devine" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-slate-500 dark:text-slate-400">Robinson formula</dt>
                <dd id="bmi-robinson" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-slate-500 dark:text-slate-400">Hamwi formula</dt>
                <dd id="bmi-hamwi" class="font-semibold text-slate-700 dark:text-slate-200">&mdash;</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Category table -->
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">WHO BMI Categories (adults)</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="block font-bold text-sky-600 dark:text-sky-400">Underweight</span>
            <span class="text-slate-500 dark:text-slate-400">Below 18.5</span>
          </div>
          <div class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="block font-bold text-emerald-600 dark:text-emerald-400">Healthy</span>
            <span class="text-slate-500 dark:text-slate-400">18.5 &ndash; 24.9</span>
          </div>
          <div class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="block font-bold text-amber-600 dark:text-amber-400">Overweight</span>
            <span class="text-slate-500 dark:text-slate-400">25.0 &ndash; 29.9</span>
          </div>
          <div class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="block font-bold text-red-600 dark:text-red-400">Obese</span>
            <span class="text-slate-500 dark:text-slate-400">30.0 and above</span>
          </div>
        </div>
      </div>

      <!-- Context / limitations -->
      <div class="p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-900/20 flex gap-3">
        ${getIconSvg('alertTriangle', 'w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5')}
        <div class="text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
          <p class="font-bold">What BMI can and cannot tell you</p>
          <p>
            BMI is a rough population-level screening measure, not a diagnosis and not a measure of health.
            It uses only height and weight, so it cannot distinguish muscle from fat, and it does not account
            for bone density, body composition, or fat distribution.
          </p>
          <p>
            It is often misleading for athletes and very muscular people, older adults, pregnant people, and
            children and teenagers (who need age- and sex-specific growth charts instead). BMI thresholds were
            derived largely from European populations, and some health bodies recommend lower cut-offs for
            people of South Asian, South-East Asian, and East Asian descent.
          </p>
          <p>
            The ideal-weight formulas shown are decades-old clinical estimates originally created for medication
            dosing. They disagree with each other by design and should be read as rough reference points, not targets.
          </p>
          <p class="font-semibold">
            For anything about your own health, a doctor who can consider your full history is a far better
            guide than any calculator.
          </p>
        </div>
      </div>
    </div>
  `;

  const unitBtns = container.querySelectorAll('.bmi-unit-btn');
  const heightMetric = container.querySelector('#bmi-height-metric');
  const heightImperial = container.querySelector('#bmi-height-imperial');
  const cmEl = container.querySelector('#bmi-cm');
  const ftEl = container.querySelector('#bmi-ft');
  const inEl = container.querySelector('#bmi-in');
  const weightEl = container.querySelector('#bmi-weight');
  const weightUnitEl = container.querySelector('#bmi-weight-unit');
  const valueEl = container.querySelector('#bmi-value');
  const categoryEl = container.querySelector('#bmi-category');
  const markerWrap = container.querySelector('#bmi-marker-wrap');
  const marker = container.querySelector('#bmi-marker');
  const healthyWeightEl = container.querySelector('#bmi-healthy-weight');
  const devineEl = container.querySelector('#bmi-devine');
  const robinsonEl = container.querySelector('#bmi-robinson');
  const hamwiEl = container.querySelector('#bmi-hamwi');

  function getSex() {
    const checked = container.querySelector('input[name="bmi-sex"]:checked');
    return checked ? checked.value : 'male';
  }

  // Returns height in metres, or 0 if not enough valid input.
  function getHeightMeters() {
    if (units === 'metric') {
      const cm = parseFloat(cmEl.value);
      return Number.isFinite(cm) && cm > 0 ? cm / 100 : 0;
    }
    const ft = parseFloat(ftEl.value) || 0;
    const inch = parseFloat(inEl.value) || 0;
    const totalInches = ft * 12 + inch;
    return totalInches > 0 ? totalInches * 0.0254 : 0;
  }

  // Returns weight in kilograms, or 0 if not valid.
  function getWeightKg() {
    const w = parseFloat(weightEl.value);
    if (!Number.isFinite(w) || w <= 0) return 0;
    return units === 'metric' ? w : w * 0.45359237;
  }

  function fmtWeight(kg) {
    if (units === 'metric') return `${kg.toFixed(1)} kg`;
    return `${(kg / 0.45359237).toFixed(1)} lb`;
  }

  function categorize(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-sky-600 dark:text-sky-400' };
    if (bmi < 25) return { label: 'Healthy weight', color: 'text-emerald-600 dark:text-emerald-400' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-600 dark:text-amber-400' };
    return { label: 'Obese', color: 'text-red-600 dark:text-red-400' };
  }

  function reset() {
    valueEl.textContent = '\u2014';
    valueEl.className = 'text-5xl font-black text-slate-300 dark:text-slate-700 tabular-nums';
    categoryEl.textContent = 'Enter your measurements';
    categoryEl.className = 'mt-2 text-sm font-bold text-slate-400 dark:text-slate-500';
    markerWrap.classList.add('hidden');
    healthyWeightEl.textContent = '\u2014';
    devineEl.textContent = '\u2014';
    robinsonEl.textContent = '\u2014';
    hamwiEl.textContent = '\u2014';
  }

  function calculate() {
    const hM = getHeightMeters();
    const wKg = getWeightKg();

    if (hM <= 0) { reset(); return; }

    // Ideal-weight formulas are height-only, so show them as soon as height is known.
    const totalInches = hM / 0.0254;
    const inchesOver5ft = Math.max(0, totalInches - 60);
    const sex = getSex();

    const devine = sex === 'male' ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
    const robinson = sex === 'male' ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
    const hamwi = sex === 'male' ? 48 + 2.7 * inchesOver5ft : 45.5 + 2.2 * inchesOver5ft;

    devineEl.textContent = fmtWeight(devine);
    robinsonEl.textContent = fmtWeight(robinson);
    hamwiEl.textContent = fmtWeight(hamwi);

    const lowKg = 18.5 * hM * hM;
    const highKg = 24.9 * hM * hM;
    healthyWeightEl.textContent = `${fmtWeight(lowKg)} \u2013 ${fmtWeight(highKg)}`;

    if (wKg <= 0) {
      valueEl.textContent = '\u2014';
      valueEl.className = 'text-5xl font-black text-slate-300 dark:text-slate-700 tabular-nums';
      categoryEl.textContent = 'Enter your weight';
      categoryEl.className = 'mt-2 text-sm font-bold text-slate-400 dark:text-slate-500';
      markerWrap.classList.add('hidden');
      return;
    }

    const bmi = wKg / (hM * hM);
    if (!Number.isFinite(bmi) || bmi <= 0) { reset(); return; }

    const cat = categorize(bmi);
    valueEl.textContent = bmi.toFixed(1);
    valueEl.className = `text-5xl font-black tabular-nums ${cat.color}`;
    categoryEl.textContent = cat.label;
    categoryEl.className = `mt-2 text-sm font-bold ${cat.color}`;

    // Position marker on a 0-40 scale to match the coloured bar segments.
    const pct = Math.max(0, Math.min((bmi / 40) * 100, 100));
    markerWrap.classList.remove('hidden');
    marker.style.left = `${pct}%`;
  }

  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      units = btn.getAttribute('data-units');
      unitBtns.forEach(b => {
        const active = b.getAttribute('data-units') === units;
        b.className = `bmi-unit-btn flex-1 py-2 rounded-lg text-xs font-bold transition ${
          active ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`;
      });

      heightMetric.classList.toggle('hidden', units !== 'metric');
      heightImperial.classList.toggle('hidden', units === 'metric');
      weightUnitEl.textContent = units === 'metric' ? 'kg' : 'lb';

      // Clear inputs on unit switch so a value isn't silently reinterpreted
      // in the wrong unit (e.g. 170 cm becoming 170 lb).
      cmEl.value = '';
      ftEl.value = '';
      inEl.value = '';
      weightEl.value = '';
      reset();
    });
  });

  [cmEl, ftEl, inEl, weightEl].forEach(el => el.addEventListener('input', calculate));
  container.querySelectorAll('input[name="bmi-sex"]').forEach(el => el.addEventListener('change', calculate));
}
