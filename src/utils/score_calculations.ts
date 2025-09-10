// scoreCalculations.ts - Score calculation utilities
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