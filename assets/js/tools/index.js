import { renderWordCounter } from './wordCounter.js';
import { renderPasswordGenerator } from './passwordGen.js';
import { renderCaseConverter } from './caseConverter.js';
import { renderQrGenerator } from './qrGen.js';
import { renderJsonFormatter } from './jsonFormatter.js';
import { renderBase64Tool } from './base64Tool.js';
import { renderUnitConverter } from './unitConverter.js';
import { renderAgeCalculator } from './ageCalc.js';
import { renderLoremGenerator } from './loremGen.js';
import { renderHashGenerator } from './hashDiff.js';

export function renderToolById(toolId, container) {
  switch (toolId) {
    case 'word-counter':
      renderWordCounter(container);
      break;
    case 'password-generator':
      renderPasswordGenerator(container);
      break;
    case 'case-converter':
      renderCaseConverter(container);
      break;
    case 'qr-generator':
      renderQrGenerator(container);
      break;
    case 'json-formatter':
      renderJsonFormatter(container);
      break;
    case 'base64-tool':
      renderBase64Tool(container);
      break;
    case 'unit-converter':
      renderUnitConverter(container);
      break;
    case 'age-calculator':
      renderAgeCalculator(container);
      break;
    case 'lorem-generator':
      renderLoremGenerator(container);
      break;
    case 'hash-generator':
      renderHashGenerator(container);
      break;
    default:
      container.innerHTML = `<div class="p-4 text-xs text-slate-500">Tool coming soon...</div>`;
  }
}
