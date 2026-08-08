/**
 * Resume / CV Builder.
 *
 * Fill in a form, pick a template, see a live preview, and export to PDF or
 * Word. Everything runs locally: nothing is uploaded, and the draft is kept in
 * this browser's localStorage so a refresh does not lose work.
 */

import { getIconSvg } from '../icons.js';

const STORAGE_KEY = 'pth_resume_draft_v1';

// jsPDF's built-in fonts only cover Latin characters. Bangla, Arabic, CJK and
// similar scripts will not render in the PDF export, but Word handles them
// fine, so we detect and steer the user rather than producing broken output.
const NON_LATIN = /[^\u0000-\u024F\u2000-\u206F\u20A0-\u20CF]/;

const TEMPLATES = {
  classic: { label: 'Classic', accent: [31, 41, 55], rule: true, uppercaseHeads: true },
  modern: { label: 'Modern', accent: [37, 99, 235], rule: true, uppercaseHeads: false },
  compact: { label: 'Compact', accent: [15, 23, 42], rule: false, uppercaseHeads: true }
};

function blankState() {
  return {
    template: 'classic',
    personal: { name: '', title: '', email: '', phone: '', location: '', website: '' },
    summary: '',
    experience: [{ role: '', company: '', start: '', end: '', bullets: '' }],
    education: [{ degree: '', school: '', start: '', end: '', note: '' }],
    skills: '',
    certifications: []
  };
}

export function renderResumeBuilder(container) {
  let state = loadDraft() || blankState();

  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Merge onto a blank state so drafts saved by an older version still load.
      return { ...blankState(), ...parsed, personal: { ...blankState().personal, ...(parsed.personal || {}) } };
    } catch {
      return null;
    }
  }

  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      draftNote.textContent = 'Draft saved in this browser';
    } catch {
      draftNote.textContent = 'Could not save draft (storage unavailable)';
    }
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function bulletList(text) {
    return String(text || '')
      .split('\n')
      .map(l => l.replace(/^\s*[-*\u2022]\s*/, '').trim())
      .filter(Boolean);
  }

  function dateRange(start, end) {
    const a = (start || '').trim();
    const b = (end || '').trim();
    if (a && b) return `${a} \u2013 ${b}`;
    return a || b || '';
  }

  function hasNonLatin() {
    const blob = JSON.stringify(state);
    return NON_LATIN.test(blob);
  }

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        <div class="flex items-center gap-1">
          ${Object.keys(TEMPLATES).map(t => `
            <button data-template="${t}" class="rb-tpl px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              t === state.template ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }">${TEMPLATES[t].label}</button>
          `).join('')}
        </div>
        <div class="flex-1"></div>
        <button id="rb-pdf" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center gap-1.5">
          ${getIconSvg('download', 'w-3.5 h-3.5')} Download PDF
        </button>
        <button id="rb-docx" class="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5">
          ${getIconSvg('fileText', 'w-3.5 h-3.5')} Download Word
        </button>
        <button id="rb-clear" class="px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-xs font-semibold transition">
          Clear
        </button>
      </div>

      <p id="rb-status" class="text-xs text-slate-500 dark:text-slate-400"></p>
      <p id="rb-warn" class="hidden text-xs text-amber-700 dark:text-amber-300 p-3 rounded-lg border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-900/20"></p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- FORM -->
        <div class="space-y-4">
          <section class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Your Details</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input data-p="name" placeholder="Full name" class="rb-in" />
              <input data-p="title" placeholder="Professional title" class="rb-in" />
              <input data-p="email" type="email" placeholder="Email" class="rb-in" />
              <input data-p="phone" placeholder="Phone" class="rb-in" />
              <input data-p="location" placeholder="City, Country" class="rb-in" />
              <input data-p="website" placeholder="Website or LinkedIn" class="rb-in" />
            </div>
          </section>

          <section class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Professional Summary</h3>
            <textarea id="rb-summary" rows="4" placeholder="Two or three sentences on who you are and what you do best." class="rb-in"></textarea>
          </section>

          <section class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Work Experience</h3>
              <button id="rb-add-exp" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">+ Add role</button>
            </div>
            <div id="rb-exp-list" class="space-y-3"></div>
          </section>

          <section class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Education</h3>
              <button id="rb-add-edu" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">+ Add entry</button>
            </div>
            <div id="rb-edu-list" class="space-y-3"></div>
          </section>

          <section class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Skills</h3>
            <textarea id="rb-skills" rows="2" placeholder="Separate with commas: Project management, AutoCAD, ISO 9001 auditing" class="rb-in"></textarea>
          </section>

          <section class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Certifications <span class="font-normal normal-case text-slate-400">(optional)</span></h3>
              <button id="rb-add-cert" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">+ Add</button>
            </div>
            <div id="rb-cert-list" class="space-y-3"></div>
          </section>

          <p id="rb-draft-note" class="text-xs text-slate-400 dark:text-slate-500"></p>
        </div>

        <!-- PREVIEW -->
        <div class="lg:sticky lg:top-4 self-start w-full">
          <p class="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">Live Preview</p>
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 p-3 overflow-auto" style="max-height:78vh">
            <div id="rb-preview" class="bg-white text-slate-900 mx-auto shadow-lg" style="width:100%;max-width:620px;padding:38px 42px;font-family:Georgia,'Times New Roman',serif;font-size:12px;line-height:1.5"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Shared input styling (avoids repeating a long class list on every field).
  container.querySelectorAll('.rb-in').forEach(el => {
    el.className = 'rb-in w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-blue-500 transition';
  });

  const previewEl = container.querySelector('#rb-preview');
  const expList = container.querySelector('#rb-exp-list');
  const eduList = container.querySelector('#rb-edu-list');
  const certList = container.querySelector('#rb-cert-list');
  const summaryEl = container.querySelector('#rb-summary');
  const skillsEl = container.querySelector('#rb-skills');
  const statusEl = container.querySelector('#rb-status');
  const warnEl = container.querySelector('#rb-warn');
  const draftNote = container.querySelector('#rb-draft-note');

  function inputClass() {
    return 'w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-blue-500 transition';
  }

  // ---- repeatable section rendering -------------------------------------

  function renderExperience() {
    expList.innerHTML = state.experience.map((e, i) => `
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2" data-exp="${i}">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400">Role ${i + 1}</span>
          ${state.experience.length > 1 ? `<button data-del-exp="${i}" class="text-xs text-red-500 hover:underline">Remove</button>` : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input data-e="${i}" data-f="role" value="${esc(e.role)}" placeholder="Job title" class="${inputClass()}" />
          <input data-e="${i}" data-f="company" value="${esc(e.company)}" placeholder="Company" class="${inputClass()}" />
          <input data-e="${i}" data-f="start" value="${esc(e.start)}" placeholder="Start (e.g. Jan 2022)" class="${inputClass()}" />
          <input data-e="${i}" data-f="end" value="${esc(e.end)}" placeholder="End (or Present)" class="${inputClass()}" />
        </div>
        <textarea data-e="${i}" data-f="bullets" rows="3" placeholder="One achievement per line" class="${inputClass()}">${esc(e.bullets)}</textarea>
      </div>
    `).join('');
    bindRepeat(expList, 'e', state.experience, 'del-exp');
  }

  function renderEducation() {
    eduList.innerHTML = state.education.map((e, i) => `
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400">Entry ${i + 1}</span>
          ${state.education.length > 1 ? `<button data-del-edu="${i}" class="text-xs text-red-500 hover:underline">Remove</button>` : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input data-d="${i}" data-f="degree" value="${esc(e.degree)}" placeholder="Degree or qualification" class="${inputClass()}" />
          <input data-d="${i}" data-f="school" value="${esc(e.school)}" placeholder="Institution" class="${inputClass()}" />
          <input data-d="${i}" data-f="start" value="${esc(e.start)}" placeholder="Start year" class="${inputClass()}" />
          <input data-d="${i}" data-f="end" value="${esc(e.end)}" placeholder="End year" class="${inputClass()}" />
        </div>
        <input data-d="${i}" data-f="note" value="${esc(e.note)}" placeholder="Result or note (optional)" class="${inputClass()}" />
      </div>
    `).join('');
    bindRepeat(eduList, 'd', state.education, 'del-edu');
  }

  function renderCerts() {
    if (state.certifications.length === 0) {
      certList.innerHTML = `<p class="text-xs text-slate-400">None added.</p>`;
      return;
    }
    certList.innerHTML = state.certifications.map((c, i) => `
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400">Certification ${i + 1}</span>
          <button data-del-cert="${i}" class="text-xs text-red-500 hover:underline">Remove</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input data-c="${i}" data-f="name" value="${esc(c.name)}" placeholder="Name" class="${inputClass()}" />
          <input data-c="${i}" data-f="issuer" value="${esc(c.issuer)}" placeholder="Issuer" class="${inputClass()}" />
          <input data-c="${i}" data-f="year" value="${esc(c.year)}" placeholder="Year" class="${inputClass()}" />
        </div>
      </div>
    `).join('');
    bindRepeat(certList, 'c', state.certifications, 'del-cert');
  }

  function bindRepeat(listEl, key, arr, delAttr) {
    listEl.querySelectorAll(`[data-${key}]`).forEach(el => {
      el.addEventListener('input', () => {
        const i = parseInt(el.getAttribute(`data-${key}`), 10);
        arr[i][el.getAttribute('data-f')] = el.value;
        update();
      });
    });
    listEl.querySelectorAll(`[data-${delAttr}]`).forEach(btn => {
      btn.addEventListener('click', () => {
        arr.splice(parseInt(btn.getAttribute(`data-${delAttr}`), 10), 1);
        renderExperience(); renderEducation(); renderCerts();
        update();
      });
    });
  }

  // ---- preview -----------------------------------------------------------

  function buildPreview() {
    const t = TEMPLATES[state.template];
    const accent = `rgb(${t.accent.join(',')})`;
    const p = state.personal;

    const contact = [p.email, p.phone, p.location, p.website].filter(Boolean).map(esc).join('  \u00b7  ');

    const head = (label) => `
      <h2 style="font-size:12px;font-weight:bold;color:${accent};margin:16px 0 6px;
        ${t.uppercaseHeads ? 'text-transform:uppercase;letter-spacing:.08em;' : ''}
        ${t.rule ? `border-bottom:1px solid ${accent};padding-bottom:3px;` : ''}">${label}</h2>`;

    const expHtml = state.experience.filter(e => e.role || e.company).map(e => {
      const bl = bulletList(e.bullets);
      return `
        <div style="margin-bottom:11px">
          <div style="display:flex;justify-content:space-between;gap:10px">
            <strong style="font-size:12.5px">${esc(e.role)}</strong>
            <span style="font-size:11px;color:#555;white-space:nowrap">${esc(dateRange(e.start, e.end))}</span>
          </div>
          <div style="font-size:11.5px;font-style:italic;color:#444">${esc(e.company)}</div>
          ${bl.length ? `<ul style="margin:5px 0 0;padding-left:17px">${bl.map(b => `<li style="margin-bottom:2px">${esc(b)}</li>`).join('')}</ul>` : ''}
        </div>`;
    }).join('');

    const eduHtml = state.education.filter(e => e.degree || e.school).map(e => `
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;gap:10px">
          <strong style="font-size:12.5px">${esc(e.degree)}</strong>
          <span style="font-size:11px;color:#555;white-space:nowrap">${esc(dateRange(e.start, e.end))}</span>
        </div>
        <div style="font-size:11.5px;font-style:italic;color:#444">${esc(e.school)}</div>
        ${e.note ? `<div style="font-size:11px;color:#555">${esc(e.note)}</div>` : ''}
      </div>`).join('');

    const skills = String(state.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    const certs = state.certifications.filter(c => c.name);

    previewEl.innerHTML = `
      <div style="text-align:center;margin-bottom:14px">
        <div style="font-size:23px;font-weight:bold;color:${accent};letter-spacing:-.01em">${esc(p.name) || 'Your Name'}</div>
        ${p.title ? `<div style="font-size:13px;color:#444;margin-top:2px">${esc(p.title)}</div>` : ''}
        ${contact ? `<div style="font-size:10.5px;color:#555;margin-top:6px">${contact}</div>` : ''}
      </div>
      ${state.summary ? head('Summary') + `<p style="margin:0">${esc(state.summary)}</p>` : ''}
      ${expHtml ? head('Experience') + expHtml : ''}
      ${eduHtml ? head('Education') + eduHtml : ''}
      ${skills.length ? head('Skills') + `<p style="margin:0">${skills.map(esc).join('  \u00b7  ')}</p>` : ''}
      ${certs.length ? head('Certifications') + certs.map(c =>
        `<div style="margin-bottom:4px"><strong style="font-size:12px">${esc(c.name)}</strong>${
          c.issuer ? ` <span style="font-size:11px;color:#444">\u2014 ${esc(c.issuer)}</span>` : ''
        }${c.year ? ` <span style="font-size:11px;color:#666">(${esc(c.year)})</span>` : ''}</div>`).join('') : ''}
    `;
  }

  function update() {
    buildPreview();
    saveDraft();

    if (hasNonLatin()) {
      warnEl.classList.remove('hidden');
      warnEl.textContent = 'Your resume contains non-Latin characters (for example Bangla). The PDF export uses built-in fonts that cannot draw these and they will come out blank or garbled. Use Download Word instead \u2014 it handles all scripts correctly, and you can export a PDF from Word.';
    } else {
      warnEl.classList.add('hidden');
    }
  }

  // ---- exports -----------------------------------------------------------

  function fileBase() {
    const n = (state.personal.name || 'resume').trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return n || 'resume';
  }

  async function exportPdf() {
    statusEl.textContent = 'Building PDF...';
    try {
      const { jsPDF } = await import('jspdf');
      const t = TEMPLATES[state.template];
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const M = 52;
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const maxW = W - M * 2;
      let y = M;

      const need = (h) => { if (y + h > H - M) { doc.addPage(); y = M; } };

      const p = state.personal;
      doc.setFont('times', 'bold');
      doc.setFontSize(21);
      doc.setTextColor(...t.accent);
      doc.text(p.name || 'Your Name', W / 2, y + 16, { align: 'center' });
      y += 26;

      doc.setTextColor(60);
      if (p.title) {
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        doc.text(p.title, W / 2, y + 6, { align: 'center' });
        y += 15;
      }
      const contact = [p.email, p.phone, p.location, p.website].filter(Boolean).join('  \u00b7  ');
      if (contact) {
        doc.setFontSize(9.5);
        doc.setTextColor(90);
        doc.text(contact, W / 2, y + 5, { align: 'center' });
        y += 16;
      }
      y += 6;

      function section(label) {
        need(30);
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...t.accent);
        doc.text(t.uppercaseHeads ? label.toUpperCase() : label, M, y + 8);
        y += 12;
        if (t.rule) {
          doc.setDrawColor(...t.accent);
          doc.setLineWidth(0.7);
          doc.line(M, y, W - M, y);
          y += 8;
        } else {
          y += 4;
        }
        doc.setTextColor(20);
      }

      function body(text, { size = 10.5, style = 'normal', indent = 0, gap = 4 } = {}) {
        doc.setFont('times', style);
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(String(text), maxW - indent);
        for (const ln of lines) {
          need(size * 1.4);
          doc.text(ln, M + indent, y + size);
          y += size * 1.4;
        }
        y += gap;
      }

      function headingRow(left, right) {
        need(16);
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(20);
        doc.text(String(left || ''), M, y + 10);
        if (right) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(90);
          doc.text(String(right), W - M, y + 10, { align: 'right' });
        }
        doc.setTextColor(20);
        y += 14;
      }

      if (state.summary) { section('Summary'); body(state.summary, { gap: 6 }); }

      const exps = state.experience.filter(e => e.role || e.company);
      if (exps.length) {
        section('Experience');
        for (const e of exps) {
          headingRow(e.role, dateRange(e.start, e.end));
          if (e.company) body(e.company, { size: 10, style: 'italic', gap: 2 });
          for (const b of bulletList(e.bullets)) body(`\u2022  ${b}`, { size: 10.5, indent: 10, gap: 1 });
          y += 6;
        }
      }

      const edus = state.education.filter(e => e.degree || e.school);
      if (edus.length) {
        section('Education');
        for (const e of edus) {
          headingRow(e.degree, dateRange(e.start, e.end));
          if (e.school) body(e.school, { size: 10, style: 'italic', gap: 1 });
          if (e.note) body(e.note, { size: 10, gap: 2 });
          y += 4;
        }
      }

      const skills = String(state.skills || '').split(',').map(s => s.trim()).filter(Boolean);
      if (skills.length) { section('Skills'); body(skills.join('  \u00b7  '), { gap: 6 }); }

      const certs = state.certifications.filter(c => c.name);
      if (certs.length) {
        section('Certifications');
        for (const c of certs) {
          const tail = [c.issuer, c.year].filter(Boolean).join(', ');
          body(tail ? `${c.name} \u2014 ${tail}` : c.name, { gap: 2 });
        }
      }

      doc.save(`${fileBase()}.pdf`);
      statusEl.textContent = `PDF downloaded (${doc.getNumberOfPages()} page${doc.getNumberOfPages() === 1 ? '' : 's'}).`;
    } catch (err) {
      statusEl.textContent = `Could not build the PDF: ${err?.message || err}`;
    }
  }

  async function exportDocx() {
    statusEl.textContent = 'Building Word document...';
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
      const t = TEMPLATES[state.template];
      const hex = t.accent.map(n => n.toString(16).padStart(2, '0')).join('');
      const kids = [];
      const p = state.personal;

      kids.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: p.name || 'Your Name', bold: true, size: 40, color: hex })]
      }));
      if (p.title) {
        kids.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: p.title, size: 24 })] }));
      }
      const contact = [p.email, p.phone, p.location, p.website].filter(Boolean).join('  \u00b7  ');
      if (contact) {
        kids.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: contact, size: 19, color: '555555' })] }));
      }
      kids.push(new Paragraph({ text: '' }));

      const section = (label) => kids.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: t.uppercaseHeads ? label.toUpperCase() : label, bold: true, color: hex, size: 24 })]
      }));

      if (state.summary) {
        section('Summary');
        kids.push(new Paragraph({ children: [new TextRun({ text: state.summary, size: 21 })] }));
      }

      const exps = state.experience.filter(e => e.role || e.company);
      if (exps.length) {
        section('Experience');
        for (const e of exps) {
          kids.push(new Paragraph({ children: [
            new TextRun({ text: e.role || '', bold: true, size: 22 }),
            ...(dateRange(e.start, e.end) ? [new TextRun({ text: `    ${dateRange(e.start, e.end)}`, size: 19, color: '666666' })] : [])
          ]}));
          if (e.company) kids.push(new Paragraph({ children: [new TextRun({ text: e.company, italics: true, size: 20 })] }));
          for (const b of bulletList(e.bullets)) {
            kids.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: b, size: 21 })] }));
          }
          kids.push(new Paragraph({ text: '' }));
        }
      }

      const edus = state.education.filter(e => e.degree || e.school);
      if (edus.length) {
        section('Education');
        for (const e of edus) {
          kids.push(new Paragraph({ children: [
            new TextRun({ text: e.degree || '', bold: true, size: 22 }),
            ...(dateRange(e.start, e.end) ? [new TextRun({ text: `    ${dateRange(e.start, e.end)}`, size: 19, color: '666666' })] : [])
          ]}));
          if (e.school) kids.push(new Paragraph({ children: [new TextRun({ text: e.school, italics: true, size: 20 })] }));
          if (e.note) kids.push(new Paragraph({ children: [new TextRun({ text: e.note, size: 20 })] }));
          kids.push(new Paragraph({ text: '' }));
        }
      }

      const skills = String(state.skills || '').split(',').map(s => s.trim()).filter(Boolean);
      if (skills.length) {
        section('Skills');
        kids.push(new Paragraph({ children: [new TextRun({ text: skills.join('  \u00b7  '), size: 21 })] }));
      }

      const certs = state.certifications.filter(c => c.name);
      if (certs.length) {
        section('Certifications');
        for (const c of certs) {
          const tail = [c.issuer, c.year].filter(Boolean).join(', ');
          kids.push(new Paragraph({ children: [new TextRun({ text: tail ? `${c.name} \u2014 ${tail}` : c.name, size: 21 })] }));
        }
      }

      const doc = new Document({ sections: [{ properties: {}, children: kids }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileBase()}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      statusEl.textContent = 'Word document downloaded.';
    } catch (err) {
      statusEl.textContent = `Could not build the Word file: ${err?.message || err}`;
    }
  }

  // ---- wiring ------------------------------------------------------------

  container.querySelectorAll('[data-p]').forEach(el => {
    el.value = state.personal[el.getAttribute('data-p')] || '';
    el.addEventListener('input', () => {
      state.personal[el.getAttribute('data-p')] = el.value;
      update();
    });
  });

  summaryEl.value = state.summary || '';
  summaryEl.addEventListener('input', () => { state.summary = summaryEl.value; update(); });

  skillsEl.value = state.skills || '';
  skillsEl.addEventListener('input', () => { state.skills = skillsEl.value; update(); });

  container.querySelectorAll('.rb-tpl').forEach(btn => {
    btn.addEventListener('click', () => {
      state.template = btn.getAttribute('data-template');
      container.querySelectorAll('.rb-tpl').forEach(b => {
        const active = b.getAttribute('data-template') === state.template;
        b.className = `rb-tpl px-3 py-1.5 rounded-lg text-xs font-bold transition ${
          active ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`;
      });
      update();
    });
  });

  container.querySelector('#rb-add-exp').addEventListener('click', () => {
    state.experience.push({ role: '', company: '', start: '', end: '', bullets: '' });
    renderExperience(); update();
  });
  container.querySelector('#rb-add-edu').addEventListener('click', () => {
    state.education.push({ degree: '', school: '', start: '', end: '', note: '' });
    renderEducation(); update();
  });
  container.querySelector('#rb-add-cert').addEventListener('click', () => {
    state.certifications.push({ name: '', issuer: '', year: '' });
    renderCerts(); update();
  });

  container.querySelector('#rb-pdf').addEventListener('click', exportPdf);
  container.querySelector('#rb-docx').addEventListener('click', exportDocx);

  container.querySelector('#rb-clear').addEventListener('click', () => {
    if (!confirm('Clear the whole form and delete the saved draft? This cannot be undone.')) return;
    state = blankState();
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage may be unavailable */ }
    container.querySelectorAll('[data-p]').forEach(el => { el.value = ''; });
    summaryEl.value = '';
    skillsEl.value = '';
    renderExperience(); renderEducation(); renderCerts();
    update();
    statusEl.textContent = 'Form cleared.';
  });

  renderExperience();
  renderEducation();
  renderCerts();
  update();
}
