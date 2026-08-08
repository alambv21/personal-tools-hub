import { getIconSvg } from '../icons.js';

export function renderUnitConverter(container) {
  const UNITS = {
    length: {
      label: 'Length',
      units: {
        m: { label: 'Meter (m)', ratio: 1 },
        km: { label: 'Kilometer (km)', ratio: 1000 },
        cm: { label: 'Centimeter (cm)', ratio: 0.01 },
        mm: { label: 'Millimeter (mm)', ratio: 0.001 },
        mi: { label: 'Mile (mi)', ratio: 1609.344 },
        yd: { label: 'Yard (yd)', ratio: 0.9144 },
        ft: { label: 'Foot (ft)', ratio: 0.3048 },
        in: { label: 'Inch (in)', ratio: 0.0254 },
      }
    },
    weight: {
      label: 'Weight & Mass',
      units: {
        kg: { label: 'Kilogram (kg)', ratio: 1 },
        g: { label: 'Gram (g)', ratio: 0.001 },
        mg: { label: 'Milligram (mg)', ratio: 0.000001 },
        lb: { label: 'Pound (lb)', ratio: 0.45359237 },
        oz: { label: 'Ounce (oz)', ratio: 0.028349523125 },
        ton: { label: 'Metric Ton (t)', ratio: 1000 },
      }
    },
    data: {
      label: 'Data Storage',
      units: {
        b: { label: 'Bytes (B)', ratio: 1 },
        kb: { label: 'Kilobytes (KB)', ratio: 1024 },
        mb: { label: 'Megabytes (MB)', ratio: 1048576 },
        gb: { label: 'Gigabytes (GB)', ratio: 1073741824 },
        tb: { label: 'Terabytes (TB)', ratio: 1099511627776 },
      }
    },
    volume: {
      label: 'Volume',
      units: {
        l: { label: 'Liter (L)', ratio: 1 },
        ml: { label: 'Milliliter (mL)', ratio: 0.001 },
        m3: { label: 'Cubic Meter (m\u00b3)', ratio: 1000 },
        gal: { label: 'US Gallon (gal)', ratio: 3.785411784 },
        qt: { label: 'US Quart (qt)', ratio: 0.946352946 },
        pt: { label: 'US Pint (pt)', ratio: 0.473176473 },
        cup: { label: 'US Cup', ratio: 0.2365882365 },
        floz: { label: 'US Fluid Ounce (fl oz)', ratio: 0.0295735295625 },
      }
    },
    speed: {
      label: 'Speed',
      units: {
        mps: { label: 'Meters/Second (m/s)', ratio: 1 },
        kmh: { label: 'Kilometers/Hour (km/h)', ratio: 0.277777778 },
        mph: { label: 'Miles/Hour (mph)', ratio: 0.44704 },
        knot: { label: 'Knot (kn)', ratio: 0.514444444 },
        fps: { label: 'Feet/Second (ft/s)', ratio: 0.3048 },
      }
    },
    temperature: {
      label: 'Temperature',
      // Temperature is offset-based, not a simple ratio, so it is handled
      // separately in convertTemperature() below rather than via `ratio`.
      units: {
        c: { label: 'Celsius (\u00b0C)' },
        f: { label: 'Fahrenheit (\u00b0F)' },
        k: { label: 'Kelvin (K)' },
      }
    }
  };

  // Temperature requires additive offsets (not pure ratios), so it is
  // converted via Celsius as a common base instead of the ratio table above.
  function toCelsius(value, unit) {
    if (unit === 'c') return value;
    if (unit === 'f') return (value - 32) * (5 / 9);
    if (unit === 'k') return value - 273.15;
    return value;
  }
  function fromCelsius(value, unit) {
    if (unit === 'c') return value;
    if (unit === 'f') return value * (9 / 5) + 32;
    if (unit === 'k') return value + 273.15;
    return value;
  }

  let currentCategory = 'length';
  let fromUnit = 'km';
  let toUnit = 'mi';
  let fromVal = 1;

  container.innerHTML = `
    <div class="space-y-6 max-w-2xl mx-auto">
      <div class="flex flex-wrap items-center justify-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 gap-1">
        ${Object.keys(UNITS).map(cat => `
          <button data-cat="${cat}" class="uc-cat-btn flex-1 min-w-[90px] py-2 px-2 rounded-lg text-xs font-bold transition ${cat === currentCategory ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
            ${UNITS[cat].label}
          </button>
        `).join('')}
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">From</label>
            <input
              id="uc-from-val"
              type="number"
              value="${fromVal}"
              class="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select id="uc-from-select" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium outline-none">
            </select>
          </div>

          <button id="uc-swap-btn" class="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 self-center transition focus:outline-none">
            ${getIconSvg('swap', 'w-5 h-5')}
          </button>

          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">To</label>
            <div id="uc-to-val" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-400 font-bold text-lg overflow-x-auto min-h-[50px] flex items-center">
              0
            </div>
            <select id="uc-to-select" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium outline-none">
            </select>
          </div>

        </div>
      </div>
    </div>
  `;

  const fromValEl = container.querySelector('#uc-from-val');
  const fromSelect = container.querySelector('#uc-from-select');
  const toSelect = container.querySelector('#uc-to-select');
  const toValEl = container.querySelector('#uc-to-val');
  const swapBtn = container.querySelector('#uc-swap-btn');

  function populateSelects() {
    const unitMap = UNITS[currentCategory].units;
    const keys = Object.keys(unitMap);
    
    if (!unitMap[fromUnit]) fromUnit = keys[0];
    if (!unitMap[toUnit]) toUnit = keys[1] || keys[0];

    fromSelect.innerHTML = keys.map(k => `<option value="${k}" ${k === fromUnit ? 'selected' : ''}>${unitMap[k].label}</option>`).join('');
    toSelect.innerHTML = keys.map(k => `<option value="${k}" ${k === toUnit ? 'selected' : ''}>${unitMap[k].label}</option>`).join('');
  }

  function convert() {
    const val = parseFloat(fromValEl.value) || 0;
    let result;

    if (currentCategory === 'temperature') {
      result = fromCelsius(toCelsius(val, fromUnit), toUnit);
    } else {
      const cat = UNITS[currentCategory];
      const fromRatio = cat.units[fromUnit].ratio;
      const toRatio = cat.units[toUnit].ratio;
      const baseVal = val * fromRatio;
      result = baseVal / toRatio;
    }

    toValEl.textContent = Number.isInteger(result) ? result.toLocaleString() : parseFloat(result.toFixed(6)).toString();
  }

  container.querySelectorAll('.uc-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-cat');
      container.querySelectorAll('.uc-cat-btn').forEach(b => {
        b.className = `uc-cat-btn flex-1 min-w-[90px] py-2 px-2 rounded-lg text-xs font-bold transition ${b.getAttribute('data-cat') === currentCategory ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`;
      });
      populateSelects();
      convert();
    });
  });

  fromSelect.addEventListener('change', () => {
    fromUnit = fromSelect.value;
    convert();
  });

  toSelect.addEventListener('change', () => {
    toUnit = toSelect.value;
    convert();
  });

  fromValEl.addEventListener('input', convert);

  swapBtn.addEventListener('click', () => {
    const temp = fromUnit;
    fromUnit = toUnit;
    toUnit = temp;
    fromSelect.value = fromUnit;
    toSelect.value = toUnit;
    convert();
  });

  populateSelects();
  convert();
}
