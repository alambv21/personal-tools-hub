/**
 * Shared pdf.js bootstrap.
 *
 * pdf.js needs an explicit worker URL when bundled. Vite's `?url` suffix
 * emits the worker as its own asset and hands back the hashed public path,
 * which also works correctly under a non-root GitHub Pages base path.
 */
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export { pdfjsLib };

export async function loadPdfDocument(arrayBuffer) {
  // pdf.js transfers/detaches the buffer it is given, so hand it a copy to
  // keep the caller's original ArrayBuffer reusable (e.g. for pdf-lib later).
  const copy = arrayBuffer.slice(0);
  return pdfjsLib.getDocument({ data: copy }).promise;
}
