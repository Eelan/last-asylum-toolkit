import { GAME_DATA } from '../data.js';

/** Returns the cost of upgrading from the supplied Corbeau level. */
export function getRavenUpgradeCost(level) {
  const band = GAME_DATA.raven.find(([from, to]) => level >= from && level <= to);
  return band ? { fruit: band[2], essence: band[3] } : { fruit: 0, essence: 0 };
}

/** Calculates Corbeau costs for every upgrade in the selected range. */
export function calculateRavenProgression(current, target) {
  if (target <= current) return { valid: false, fruit: 0, essence: 0, levels: [] };

  let fruit = 0;
  let essence = 0;
  const levels = [];
  for (let level = current + 1; level <= target; level++) {
    const cost = getRavenUpgradeCost(level - 1);
    fruit += cost.fruit;
    essence += cost.essence;
    levels.push({ level, ...cost, fruitCumulative: fruit, essenceCumulative: essence });
  }
  return { valid: true, fruit, essence, levels };
}
