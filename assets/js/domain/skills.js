import { GAME_DATA } from '../data.js';

/** Calculates Badge de Compétence costs between two skill levels. */
export function calculateSkillProgression(current, target, stock) {
  if (target <= current) return { valid: false, required: 0, missing: 0, duelPoints: 0 };

  let required = 0;
  for (let level = current + 1; level <= target; level++) required += GAME_DATA.skills[level] || 0;
  return {
    valid: true,
    required,
    missing: Math.max(0, required - stock),
    duelPoints: required * GAME_DATA.duel.skillBadgePoints
  };
}
