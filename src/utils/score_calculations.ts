// scoreCalculations.ts - Updated score calculation utilities with UNDETECTED_STATUS handling
import { SCORE_BANDS } from '../config/scoring_constants';

export function colorWeight(color: string): number {
  const c = (color || "").toLowerCase();
  if (c === "red") return 4;
  if (c === "yellow") return 2;
  if (c === "blue" || c === "green") return 1;
  return 1;
}

export function aggregateWeightedScore(markers: Array<{ score: number | null; color: string }>): number | null {
  let num = 0;
  let den = 0;
  
  for (const m of markers) {
    if (m.score === null || m.score === undefined || Number.isNaN(m.score)) continue;
    
    const w = colorWeight(m.color);
    num += Number(m.score) * w;
    den += 100 * w;
  }
  
  if (den === 0) return null;
  
  return Math.floor((num / den) * 100);
}

export function parseIncomingScore(r: any): number | null {
  // Normalize the values for comparison
  const undetectedStatus = (r.UNDETECTED_STATUS || "").toString().toLowerCase().trim();
  const color = (r.COLOR || "").toString().toLowerCase().trim();
  
  // Handle special case: below_loq with green color should be treated as score 100
  if (undetectedStatus === 'below_loq' && color === 'green') {
    return 100;
  }
  
  // Handle case: below_loq with non-green color should be treated as missing data
  if (undetectedStatus === 'below_loq' && color !== 'green') {
    return null;
  }
  
  // Handle case: below_lod with green color - check if there's an explicit score
  if (undetectedStatus === 'below_lod' && color === 'green') {
    // First try to get the explicit score
    const cand = [r.SCORE, r.BiomarkerScore, r.BIOMARKER_SCORE];
    for (const c of cand) {
      if (c === undefined || c === null || c === "") continue;
      const s = String(c).trim();
      if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) continue;
      const v = Number(s);
      if (Number.isFinite(v)) return Math.max(0, Math.min(100, Math.floor(v)));
    }
    // If no explicit score but below_lod + green, treat as optimal
    return 100;
  }
  
  // Handle case: below_lod with non-green color should be treated as missing data
  if (undetectedStatus === 'below_lod' && color !== 'green') {
    return null;
  }
  
  // For all other cases, try to parse the explicit score
  const cand = [r.SCORE, r.BiomarkerScore, r.BIOMARKER_SCORE];
  for (const c of cand) {
    if (c === undefined || c === null || c === "") continue;
    const s = String(c).trim();
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) continue;
    const v = Number(s);
    if (Number.isFinite(v)) return Math.max(0, Math.min(100, Math.floor(v)));
  }
  return null;
}

export function scoreBandLabel(score: number | null) {
  if (score === null || score === undefined || !Number.isFinite(score)) return null;
  const s = Math.floor(score);
  let best = null;
  for (const band of SCORE_BANDS) {
    if (s >= band.min) best = band;
  }
  return best;
}

export function getScoreCategory(score: number | null): string | null {
  const band = scoreBandLabel(score);
  return band ? band.category : null;
}