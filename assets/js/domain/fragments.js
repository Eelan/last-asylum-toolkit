import { GAME_DATA } from '../data.js';

/** Returns the Fragment requirement and Duel points for a star upgrade. */
export function calculateFragmentUpgrade({ current, target, rarity, specificStock, omniStock }) {
  if (target <= current) return { valid: false, required: 0, missing: 0, duelPoints: 0 };

  const required = GAME_DATA.stars
    .filter(star => star.value > current && star.value <= target)
    .reduce((sum, star) => sum + star.cost, 0);
  const pointsByRarity = {
    ur: GAME_DATA.duel.urShardPoints,
    ssr: GAME_DATA.duel.ssrShardPoints,
    sr: GAME_DATA.duel.srShardPoints
  };

  return {
    valid: true,
    required,
    missing: Math.max(0, required - specificStock - omniStock),
    duelPoints: required * pointsByRarity[rarity]
  };
}
