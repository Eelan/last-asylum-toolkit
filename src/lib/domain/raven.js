import { GAME_DATA } from '../data.js';

export const RAVEN_ESSENCE_PHASES = 5;

/** Calculates event points from the Corbeau resources consumed by a valid upgrade plan. */
export function calculateRavenEventPoints({ fruit, essence, duelBonus = 0 }) {
  const consumedFruit = Math.max(0, Number(fruit) || 0);
  const consumedEssence = Math.max(0, Number(essence) || 0);
  const bonus = Math.max(0, Number(duelBonus) || 0);
  const { allianceDuel, survivalBattle } = GAME_DATA.ravenEventPoints;
  const multiplier = 1 + bonus / 100;
  const allianceDuelFruitBasePoints = allianceDuel.ravenFruit.points / allianceDuel.ravenFruit.unit;
  const allianceDuelEssenceBasePoints = allianceDuel.ravenEssence.points / allianceDuel.ravenEssence.unit;
  const duelBasePoints = consumedFruit / allianceDuel.ravenFruit.unit * allianceDuel.ravenFruit.points
    + consumedEssence / allianceDuel.ravenEssence.unit * allianceDuel.ravenEssence.points;
  const survivalBattlePoints = Math.floor(consumedFruit / survivalBattle.ravenFruit.unit)
    * survivalBattle.ravenFruit.points;

  return {
    allianceDuelBasePoints: Math.floor(duelBasePoints),
    allianceDuelPoints: Math.floor(duelBasePoints * multiplier),
    allianceDuelFruitBasePoints,
    allianceDuelFruitPoints: Math.floor(allianceDuelFruitBasePoints * multiplier),
    allianceDuelEssenceBasePoints,
    allianceDuelEssencePoints: Math.floor(allianceDuelEssenceBasePoints * multiplier),
    survivalBattlePoints,
    survivalBattleFruitUnit: survivalBattle.ravenFruit.unit,
    survivalBattleFruitPoints: survivalBattle.ravenFruit.points
  };
}

/** Returns the cost of upgrading from the supplied Corbeau level. */
export function getRavenUpgradeCost(level) {
  const band = GAME_DATA.raven.find(([from, to]) => level >= from && level <= to);
  if (!band) return { fruit: 0, essencePerPhase: 0, essence: 0, phaseCount: 0 };

  const essencePerPhase = band[3];
  const phaseCount = essencePerPhase > 0 ? RAVEN_ESSENCE_PHASES : 0;
  return {
    fruit: band[2],
    essencePerPhase,
    essence: essencePerPhase * phaseCount,
    phaseCount
  };
}

/**
 * Calculates Corbeau costs for every upgrade in the selected range.
 * `completedPhases` only applies to the upgrade starting at `current`.
 */
export function calculateRavenProgression(current, target, completedPhases = 0) {
  if (target <= current) return { valid: false, fruit: 0, essence: 0, levels: [] };

  let fruit = 0;
  let essence = 0;
  const levels = [];
  for (let level = current + 1; level <= target; level++) {
    const cost = getRavenUpgradeCost(level - 1);
    const phasesAlreadyCompleted = level === current + 1
      ? Math.min(Math.max(0, completedPhases), cost.phaseCount)
      : 0;
    const phasesRemaining = cost.phaseCount - phasesAlreadyCompleted;
    const essenceCost = cost.essencePerPhase * phasesRemaining;
    fruit += cost.fruit;
    essence += essenceCost;
    levels.push({
      level,
      fruit: cost.fruit,
      essence: essenceCost,
      essencePerPhase: cost.essencePerPhase,
      phasesRemaining,
      fruitCumulative: fruit,
      essenceCumulative: essence
    });
  }
  return { valid: true, fruit, essence, levels };
}
