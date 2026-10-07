import { zipSync, strToU8 } from "fflate";

export const createZip = (files: { path: string; content: string }[]) => {
  const entries: Record<string, Uint8Array> = {};
  for (const file of files) entries[file.path] = strToU8(file.content);
  return zipSync(entries, { level: 6 });
};
