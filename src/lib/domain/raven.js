import { GAME_DATA } from '../data.js';

export const RAVEN_ESSENCE_PHASES = 5;

/** Splits a confirmed incremental Fruit budget into full actions and a final partial action. */
function getFruitStepCosts(fruitPerAction, incrementalFruitCost) {
  if (!fruitPerAction || incrementalFruitCost === null) return [];

  const fullActions = Math.floor(incrementalFruitCost / fruitPerAction);
  const remainder = incrementalFruitCost % fruitPerAction;
  return [
    ...Array(fullActions).fill(fruitPerAction),
    ...(remainder > 0 ? [remainder] : [])
  ];
}

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
  if (!band) return { fruitPerAction: null, fruit: null, essencePerPhase: 0, essence: 0, phaseCount: 0, stepCosts: [] };

  const essencePerPhase = band[3];
  const phaseCount = essencePerPhase > 0 ? RAVEN_ESSENCE_PHASES : 0;
  const fruitPerAction = band[2];
  const incrementalFruitCost = band[4];
  const stepCosts = phaseCount > 0
    ? Array(phaseCount).fill(fruitPerAction)
    : getFruitStepCosts(fruitPerAction, incrementalFruitCost);
  return {
    fruitPerAction,
    fruit: phaseCount > 0 ? fruitPerAction * phaseCount : incrementalFruitCost,
    incrementalFruitCost,
    essencePerPhase,
    essence: essencePerPhase * phaseCount,
    phaseCount,
    stepCount: stepCosts.length,
    stepCosts
  };
}

/**
 * Calculates Corbeau costs for every upgrade in the selected range.
 * `completedSteps` only applies to the upgrade starting at `current`.
 */
export function calculateRavenProgression(current, target, completedSteps = 0) {
  if (target <= current) return { valid: false, fruit: 0, essence: 0, levels: [] };

  let fruit = 0;
  let fruitKnown = true;
  let essence = 0;
  const levels = [];
  for (let level = current + 1; level <= target; level++) {
    const cost = getRavenUpgradeCost(level - 1);
    const stepsAlreadyCompleted = level === current + 1
      ? Math.min(Math.max(0, completedSteps), cost.stepCount)
      : 0;
    const phasesRemaining = cost.phaseCount > 0 ? cost.phaseCount - stepsAlreadyCompleted : 0;
    const stepsRemaining = cost.stepCount - stepsAlreadyCompleted;
    const essenceCost = cost.essencePerPhase * phasesRemaining;
    const fruitCost = cost.stepCosts.length > 0
      ? cost.stepCosts.slice(stepsAlreadyCompleted).reduce((sum, stepCost) => sum + stepCost, 0)
      : null;
    if (fruitCost === null) fruitKnown = false;
    else fruit += fruitCost;
    essence += essenceCost;
    levels.push({
      level,
      fruit: fruitCost,
      fruitPerAction: cost.fruitPerAction,
      essence: essenceCost,
      essencePerPhase: cost.essencePerPhase,
      phasesRemaining,
      stepsRemaining,
      fruitCumulative: fruitKnown ? fruit : null,
      essenceCumulative: essence
    });
  }
  return { valid: true, fruit: fruitKnown ? fruit : null, fruitKnown, essence, levels };
}
