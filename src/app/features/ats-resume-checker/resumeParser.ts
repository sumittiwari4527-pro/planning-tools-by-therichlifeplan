import { inflateRaw, inflate } from "pako";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

function decodeXml(xml: string): string {
  return xml
    .replace(/<w:tab\b[^>]*\/>/g, " ")
    .replace(/<w:br\b[^>]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function findZipEntry(bytes: Uint8Array, name: string): string {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("This DOCX file could not be opened.");
  const entries = view.getUint16(eocd + 10, true);
  let cursor = view.getUint32(eocd + 16, true);
  for (let i = 0; i < entries; i++) {
    if (view.getUint32(cursor, true) !== 0x02014b50) break;
    const method = view.getUint16(cursor + 10, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localOffset = view.getUint32(cursor + 42, true);
    const entryName = new TextDecoder().decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
    if (entryName === name) {
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.subarray(start, start + compressedSize);
      if (method === 0) return new TextDecoder().decode(compressed);
      if (method === 8) return new TextDecoder().decode(inflateRaw(compressed));
      throw new Error("This DOCX compression format is not supported.");
    }
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error("No readable document text was found in this DOCX file.");
}

function decodePdfLiteral(value: string): string {
  return value
    .replace(/\\([nrtbf()\\])/g, (_, ch) => ({ n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" }[ch] || ch))
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

type PdfJsTextItem = { str?: string; hasEOL?: boolean };
type PdfJsDocument = {
  numPages: number;
  getPage(pageNumber: number): Promise<{
    getTextContent(): Promise<{ items: Array<PdfJsTextItem | { type: string }> }>;
  }>;
};
type PdfJsLibrary = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(options: { data: Uint8Array }): { promise: Promise<PdfJsDocument> };
};

declare global {
  interface Window {
    pdfjsLib?: PdfJsLibrary;
  }
}

const PDFJS_VERSION = "3.11.174";
let pdfJsLoadPromise: Promise<PdfJsLibrary> | undefined;

function loadPdfJs(): Promise<PdfJsLibrary> {
  if (typeof window === "undefined") return Promise.reject(new Error("PDF reading is only available in a browser."));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (!pdfJsLoadPromise) {
    pdfJsLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) resolve(window.pdfjsLib);
        else reject(new Error("The PDF reader loaded but could not be initialized. Please try a DOCX file."));
      };
      script.onerror = () => {
        pdfJsLoadPromise = undefined;
        reject(new Error("The PDF reader couldn't be loaded. Check your internet connection or upload a DOCX/TXT file."));
      };
      document.head.appendChild(script);
    });
  }
  return pdfJsLoadPromise;
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  if (bytes.length < 5 || new TextDecoder("latin1").decode(bytes.subarray(0, 5)) !== "%PDF-") {
    throw new Error("This file doesn't appear to be a valid PDF.");
  }

  const pdfjs = await loadPdfJs();
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => "str" in item ? item.str || "" : "")
      .filter(Boolean)
      .join(" ");
    pages.push(pageText);
  }

  const text = pages.join("\n").replace(/\s+/g, " ").trim();
  const letters = (text.match(/[A-Za-z]/g) || []).length;
  if (text.length < 30 || letters < 20) {
    throw new Error("We couldn't find selectable text in this PDF. It may be scanned; please upload a DOCX/TXT file or paste the resume text.");
  }
  return text;
}
export async function extractResumeText(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) throw new Error("Please choose a file smaller than 8 MB.");
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".txt")) return (await file.text()).trim();
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (lowerName.endsWith(".docx")) {
    const xml = findZipEntry(bytes, "word/document.xml");
    const text = decodeXml(xml);
    if (text.length < 20) throw new Error("No readable resume text was found in this DOCX file.");
    return text;
  }
  if (lowerName.endsWith(".pdf")) return await extractPdfText(bytes);
  throw new Error("Please upload a PDF, DOCX, or TXT file.");
}
