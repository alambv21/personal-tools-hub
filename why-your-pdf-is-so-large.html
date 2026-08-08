/**
 * Document conversion routines for the PDF Toolkit.
 *
 * Everything here runs in the browser. Each entry point dynamically imports
 * only the library it needs so opening the toolkit does not pull in every
 * conversion engine at once.
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function baseName(name) {
  return String(name || 'document').replace(/\.[^.]+$/, '');
}

// ---------------------------------------------------------------------------
// PDF  ->  Word (.docx)
// ---------------------------------------------------------------------------

/**
 * Splits a line's fragments into cells wherever there is a wide horizontal gap.
 * A gap of roughly a character width or more suggests a column boundary rather
 * than ordinary word spacing.
 */
function splitIntoCells(parts, gap = 12) {
  const sorted = parts.slice().sort((a, b) => a.x - b.x);
  const cells = [];
  let cell = null;

  for (const p of sorted) {
    const width = p.w || p.str.length * (p.h * 0.5);
    if (cell && p.x - cell.endX < gap) {
      cell.text += (p.x - cell.endX > 1 ? ' ' : '') + p.str;
      cell.endX = p.x + width;
    } else {
      cell = { x: p.x, endX: p.x + width, text: p.str };
      cells.push(cell);
    }
  }
  return cells.map(c => ({ ...c, text: c.text.replace(/\s+/g, ' ').trim() }));
}

/**
 * Two rows belong to the same table if every column start in the smaller row
 * lines up with a column start in the other. Column alignment is the strongest
 * signal available, since a PDF stores no table structure at all.
 */
function rowsAlign(a, b, tolerance = 6) {
  if (a.cells.length < 2 || b.cells.length < 2) return false;
  const ax = a.cells.map(c => c.x);
  const bx = b.cells.map(c => c.x);
  const smaller = ax.length <= bx.length ? ax : bx;
  const larger = ax.length <= bx.length ? bx : ax;
  return smaller.every(x => larger.some(v => Math.abs(v - x) <= tolerance));
}

/** Groups rows into runs of aligned, multi-column rows. */
function findTableBlocks(rows) {
  const blocks = [];
  let run = [];

  const flush = () => {
    if (run.length >= 2 && run[0].cells.length >= 2) blocks.push(run);
    run = [];
  };

  for (const row of rows) {
    if (run.length === 0) { run = [row]; continue; }
    if (rowsAlign(run[run.length - 1], row)) run.push(row);
    else { flush(); run = [row]; }
  }
  flush();
  return blocks;
}

/**
 * Reconstructs text from a PDF's text layer and writes a .docx.
 *
 * This reads the embedded text layer, so it produces clean output for
 * digitally created PDFs and nothing at all for scanned images. Layout is
 * approximated line by line rather than reproduced exactly.
 */
export async function pdfToWord(file, onProgress = () => {}, options = {}) {
  const detectTables = options.detectTables !== false;

  const [{ loadPdfDocument }, docxMod] = await Promise.all([
    import('./pdfjsSetup.js'),
    import('docx')
  ]);
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = docxMod;

  const buf = await file.arrayBuffer();
  const pdf = await loadPdfDocument(buf);

  const children = [];
  let totalChars = 0;
  let tablesFound = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress(`Reading page ${pageNum} of ${pdf.numPages}...`);
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Group text items into visual lines by their y position.
    const lines = [];
    let current = null;
    const Y_TOLERANCE = 2.5;

    const items = content.items
      .filter(it => typeof it.str === 'string' && it.str.trim())
      .map(it => ({
        str: it.str,
        x: it.transform[4],
        y: it.transform[5],
        w: it.width || 0,
        h: Math.abs(it.transform[3]) || 10
      }))
      .sort((a, b) => (Math.abs(a.y - b.y) > Y_TOLERANCE ? b.y - a.y : a.x - b.x));

    for (const it of items) {
      if (!current || Math.abs(current.y - it.y) > Y_TOLERANCE) {
        current = { y: it.y, height: it.h, parts: [it] };
        lines.push(current);
      } else {
        current.parts.push(it);
      }
    }

    // Split every line into cells so table columns can be recognised.
    const rendered = lines
      .map(line => {
        const cells = splitIntoCells(line.parts);
        return {
          cells,
          text: cells.map(c => c.text).join(' ').replace(/\s+/g, ' ').trim(),
          y: line.y,
          height: line.height
        };
      })
      .filter(l => l.text.length > 0);

    if (pageNum > 1) {
      children.push(new Paragraph({ text: '', pageBreakBefore: true }));
    }

    // Estimate a body font size so oversized lines can be marked as headings.
    const heights = rendered.map(l => l.height).sort((a, b) => a - b);
    const medianHeight = heights.length ? heights[Math.floor(heights.length / 2)] : 10;

    // Rows that belong to a detected table are emitted as a Word table instead
    // of as loose paragraphs.
    const tableBlocks = detectTables ? findTableBlocks(rendered) : [];
    const rowToBlock = new Map();
    tableBlocks.forEach((block, bi) => block.forEach(r => rowToBlock.set(r, bi)));
    const emittedBlocks = new Set();

    let prevY = null;
    for (const line of rendered) {
      const blockIndex = rowToBlock.get(line);

      if (blockIndex !== undefined) {
        if (emittedBlocks.has(blockIndex)) continue;
        emittedBlocks.add(blockIndex);

        const block = tableBlocks[blockIndex];
        const colCount = Math.max(...block.map(r => r.cells.length));

        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: block.map((r, ri) => new TableRow({
            children: Array.from({ length: colCount }, (_, ci) => {
              const cellText = r.cells[ci] ? r.cells[ci].text : '';
              totalChars += cellText.length;
              return new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: cellText, bold: ri === 0, size: 20 })]
                })]
              });
            })
          }))
        }));
        children.push(new Paragraph({ text: '' }));
        prevY = block[block.length - 1].y;
        tablesFound++;
        continue;
      }

      // A large vertical gap suggests a paragraph break.
      if (prevY !== null && prevY - line.y > medianHeight * 1.8) {
        children.push(new Paragraph({ text: '' }));
      }
      prevY = line.y;
      totalChars += line.text.length;

      const isHeading = line.height > medianHeight * 1.35 && line.text.length < 120;
      children.push(new Paragraph({
        heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
        children: [new TextRun({ text: line.text, size: isHeading ? undefined : 22 })]
      }));
    }
  }

  if (totalChars === 0) {
    throw new Error(
      'No text layer found in this PDF. It is most likely a scan or a photo of a document, ' +
      'which needs OCR (optical character recognition) rather than text extraction.'
    );
  }

  onProgress('Building Word document...');
  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${baseName(file.name)}.docx`);

  return { pages: pdf.numPages, characters: totalChars, tables: tablesFound };
}

// ---------------------------------------------------------------------------
// Word (.docx)  ->  PDF
// ---------------------------------------------------------------------------

const PAGE = { width: 595.28, height: 841.89, margin: 56 }; // A4 in points

export async function wordToPdf(file, onProgress = () => {}) {
  onProgress('Reading document...');
  const [mammothMod, { jsPDF }] = await Promise.all([
    import('mammoth/mammoth.browser.js'),
    import('jspdf')
  ]);
  const mammoth = mammothMod.default || mammothMod;

  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const maxWidth = PAGE.width - PAGE.margin * 2;
  let y = PAGE.margin;

  function ensureSpace(lineHeight) {
    if (y + lineHeight > PAGE.height - PAGE.margin) {
      doc.addPage();
      y = PAGE.margin;
    }
  }

  function writeBlock(text, { size = 11, style = 'normal', spaceAfter = 6, indent = 0 } = {}) {
    const clean = String(text).replace(/\s+/g, ' ').trim();
    if (!clean) { y += spaceAfter; return; }

    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    const lineHeight = size * 1.35;
    const lines = doc.splitTextToSize(clean, maxWidth - indent);

    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, PAGE.margin + indent, y + size);
      y += lineHeight;
    }
    y += spaceAfter;
  }

  const parsed = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');

  function renderTable(table) {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length === 0) return;

    const grid = rows.map(tr =>
      Array.from(tr.querySelectorAll('th,td')).map(cell => cell.textContent.replace(/\s+/g, ' ').trim())
    );
    const colCount = Math.max(...grid.map(r => r.length));
    const colWidth = maxWidth / colCount;
    const size = colCount > 5 ? 8 : 9;
    const lineHeight = size * 1.3;

    doc.setFontSize(size);

    for (let r = 0; r < grid.length; r++) {
      // Word tables converted by mammoth use <td> throughout, so <th> detection
      // never fires. Treat the first row as the header, which matches how
      // almost all real documents are laid out.
      const isHeader = r === 0;
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');

      const wrapped = [];
      for (let c = 0; c < colCount; c++) {
        wrapped.push(doc.splitTextToSize(grid[r][c] || '', colWidth - 8));
      }
      const rowLines = Math.max(...wrapped.map(w => w.length), 1);
      const rowHeight = rowLines * lineHeight + 6;

      ensureSpace(rowHeight);

      for (let c = 0; c < colCount; c++) {
        const x = PAGE.margin + c * colWidth;
        doc.setDrawColor(200);
        doc.rect(x, y, colWidth, rowHeight);
        wrapped[c].forEach((ln, i) => {
          doc.text(ln, x + 4, y + 4 + (i + 1) * lineHeight - 2);
        });
      }
      y += rowHeight;
    }
    y += 10;
  }

  function walk(node) {
    for (const el of Array.from(node.children)) {
      const tag = el.tagName.toLowerCase();
      switch (tag) {
        case 'h1': writeBlock(el.textContent, { size: 20, style: 'bold', spaceAfter: 10 }); break;
        case 'h2': writeBlock(el.textContent, { size: 16, style: 'bold', spaceAfter: 8 }); break;
        case 'h3': writeBlock(el.textContent, { size: 13, style: 'bold', spaceAfter: 7 }); break;
        case 'h4':
        case 'h5':
        case 'h6': writeBlock(el.textContent, { size: 11, style: 'bold', spaceAfter: 6 }); break;
        case 'p': {
          // Only style the whole paragraph when the formatted run covers all of
          // it. A paragraph such as "text with <strong>bold</strong> inside"
          // has one element child but also loose text, so it stays normal.
          const only = el.children.length === 1 ? el.children[0] : null;
          const coversAll = only && only.textContent.trim() === el.textContent.trim();
          const tagOf = coversAll ? only.tagName : '';
          const style = ['STRONG', 'B'].includes(tagOf) ? 'bold'
            : ['EM', 'I'].includes(tagOf) ? 'italic'
            : 'normal';
          writeBlock(el.textContent, { style });
          break;
        }
        case 'ul':
        case 'ol': {
          Array.from(el.querySelectorAll(':scope > li')).forEach((li, i) => {
            const marker = tag === 'ol' ? `${i + 1}. ` : '\u2022 ';
            writeBlock(marker + li.textContent, { indent: 14, spaceAfter: 3 });
          });
          y += 4;
          break;
        }
        case 'table': renderTable(el); break;
        case 'br': y += 10; break;
        default:
          if (el.children.length > 0) walk(el);
          else writeBlock(el.textContent);
      }
    }
  }

  onProgress('Rendering PDF...');
  walk(parsed.body);

  if (y === PAGE.margin && doc.getNumberOfPages() === 1) {
    throw new Error('This document appears to be empty, or its content could not be read.');
  }

  doc.save(`${baseName(file.name)}.pdf`);
  return { pages: doc.getNumberOfPages() };
}

// ---------------------------------------------------------------------------
// Excel / CSV  ->  PDF
// ---------------------------------------------------------------------------

function cellToText(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'object') {
    // ExcelJS wraps formulas, hyperlinks and rich text in objects.
    if (value.result !== undefined) return cellToText(value.result);
    if (value.text !== undefined) return String(value.text);
    if (Array.isArray(value.richText)) return value.richText.map(r => r.text).join('');
    if (value.hyperlink) return String(value.hyperlink);
    if (value.error) return String(value.error);
    return '';
  }
  return String(value);
}

function parseCsv(text) {
  // Handles quoted fields, escaped quotes, and embedded newlines.
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field); field = '';
    } else if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => String(c).trim() !== ''));
}

export async function spreadsheetToPdf(file, options = {}, onProgress = () => {}) {
  const landscape = options.landscape !== false;
  onProgress('Reading spreadsheet...');

  const { jsPDF } = await import('jspdf');
  const isCsv = /\.csv$/i.test(file.name) || file.type === 'text/csv';

  /** @type {{name:string, rows:string[][]}[]} */
  const sheets = [];

  if (isCsv) {
    sheets.push({ name: baseName(file.name), rows: parseCsv(await file.text()) });
  } else {
    const ExcelJSMod = await import('exceljs/dist/exceljs.min.js');
    const ExcelJS = ExcelJSMod.default || ExcelJSMod;
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await file.arrayBuffer());

    wb.eachSheet(ws => {
      const rows = [];
      ws.eachRow({ includeEmpty: false }, rowObj => {
        const values = [];
        // rowObj.values is 1-indexed with a leading hole.
        const raw = Array.isArray(rowObj.values) ? rowObj.values.slice(1) : [];
        for (let i = 0; i < raw.length; i++) values.push(cellToText(raw[i]));
        if (values.some(v => String(v).trim() !== '')) rows.push(values);
      });
      if (rows.length > 0) sheets.push({ name: ws.name, rows });
    });
  }

  if (sheets.length === 0) throw new Error('No readable data found in this file.');

  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: landscape ? 'landscape' : 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 36;
  const maxWidth = pageW - margin * 2;

  let firstSheet = true;
  let totalRows = 0;

  for (const sheet of sheets) {
    if (!firstSheet) doc.addPage();
    firstSheet = false;

    onProgress(`Rendering sheet "${sheet.name}"...`);

    const colCount = Math.max(...sheet.rows.map(r => r.length));
    const header = sheet.rows[0];
    const body = sheet.rows.slice(1);
    totalRows += sheet.rows.length;

    // Size columns proportionally to their longest content, within limits.
    const weights = [];
    for (let c = 0; c < colCount; c++) {
      let longest = 0;
      for (const r of sheet.rows) longest = Math.max(longest, String(r[c] ?? '').length);
      weights.push(Math.min(Math.max(longest, 4), 40));
    }
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const colWidths = weights.map(w => (w / weightSum) * maxWidth);

    const fontSize = colCount > 12 ? 6 : colCount > 8 ? 7 : 8;
    const lineHeight = fontSize * 1.25;

    let y = margin;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(sheet.name, margin, y + 12);
    y += 26;

    function drawRow(cells, isHeader) {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');

      const wrapped = [];
      for (let c = 0; c < colCount; c++) {
        wrapped.push(doc.splitTextToSize(String(cells[c] ?? ''), colWidths[c] - 6));
      }
      const rowLines = Math.max(...wrapped.map(w => w.length), 1);
      const rowHeight = rowLines * lineHeight + 5;

      if (y + rowHeight > pageH - margin) {
        doc.addPage();
        y = margin;
        // Repeat the header on each new page.
        if (!isHeader) drawRow(header, true);
      }

      let x = margin;
      for (let c = 0; c < colCount; c++) {
        if (isHeader) {
          doc.setFillColor(238, 242, 247);
          doc.rect(x, y, colWidths[c], rowHeight, 'F');
        }
        doc.setDrawColor(205);
        doc.rect(x, y, colWidths[c], rowHeight);
        wrapped[c].forEach((ln, i) => {
          doc.text(ln, x + 3, y + 3 + (i + 1) * lineHeight - 2);
        });
        x += colWidths[c];
      }
      y += rowHeight;
    }

    drawRow(header, true);
    for (const r of body) drawRow(r, false);
  }

  doc.save(`${baseName(file.name)}.pdf`);
  return { sheets: sheets.length, rows: totalRows, pages: doc.getNumberOfPages() };
}
