// csvParser.ts - CSV parsing utilities
import Papa from 'papaparse';

export function parseCsv(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (v) => (typeof v === "string" ? v.trim() : v),
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });
}