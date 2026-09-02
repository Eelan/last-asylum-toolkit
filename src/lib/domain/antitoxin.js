import { GAME_DATA } from '../data.js';

/** Calculates per-level and cumulative Antitoxin costs for a hero level range. */
export function calculateAntitoxinProgression(current, target) {
  if (target <= current) return { valid: false, total: 0, duelPoints: 0, levels: [] };

  let total = 0;
  const levels = [];
  for (let level = current + 1; level <= target; level++) {
    const cost = GAME_DATA.antitoxin[level] || 0;
    total += cost;
    levels.push({ level, cost, cumulative: total, sanctuary: Math.ceil(level / 5) });
  }
  return { valid: true, total, duelPoints: Math.floor(total / GAME_DATA.duel.antitoxinUnit), levels };
}
