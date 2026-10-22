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

function extractPdfText(bytes: Uint8Array): string {
  let raw = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    raw += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + 0x8000, bytes.length)));
  }
  if (!raw.startsWith("%PDF-")) throw new Error("This file doesn't appear to be a valid PDF.");
  const chunks: string[] = [];
  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;
  while ((match = streamPattern.exec(raw)) !== null) {
    let stream = match[1];
    const before = raw.slice(Math.max(0, match.index - 500), match.index);
    if (/\/FlateDecode/.test(before)) {
      try {
        const start = match.index + match[0].indexOf(match[1]);
        // `raw` is a one-byte-per-character view of the PDF bytes. Do not use
        // TextEncoder here: UTF-8 would change offsets for binary stream data.
        const streamBytes = bytes.subarray(start, start + stream.length);
        stream = new TextDecoder("latin1").decode(inflate(streamBytes));
      } catch { continue; }
    }
    const tokenPattern = /\(((?:\\.|[^\\)])*)\)\s*Tj|\[((?:.|\n)*?)\]\s*TJ/g;
    let token: RegExpExecArray | null;
    while ((token = tokenPattern.exec(stream)) !== null) {
      if (token[1] !== undefined) chunks.push(decodePdfLiteral(token[1]));
      else {
        const literals = token[2].match(/\(((?:\\.|[^\\)])*)\)/g) || [];
        chunks.push(literals.map((literal) => decodePdfLiteral(literal.slice(1, -1))).join(""));
      }
    }
  }
  const text = chunks.join(" ").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, " ").trim();
  if (text.length < 30) {
    throw new Error("We couldn't extract enough text from this PDF. It may be scanned or use an unsupported text encoding. Try a text-based PDF or paste the resume text instead.");
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
  if (lowerName.endsWith(".pdf")) return extractPdfText(bytes);
  throw new Error("Please upload a PDF, DOCX, or TXT file.");
}
