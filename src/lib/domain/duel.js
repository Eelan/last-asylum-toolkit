import { GAME_DATA } from '../data.js';

/**
 * Builds a non-destructive Alliance Duel spending plan.
 * Resources are consumed by descending point value; a final smallest-unit pass
 * minimizes overshoot when the greedy pass stops just below the target.
 */
export function calculateDuelPlan({ target, bonus, stocks }) {
  const duel = GAME_DATA.duel;
  const resources = [
    { key: 'ur', points: duel.urShardPoints, unit: 1 },
    { key: 'ssr', points: duel.ssrShardPoints, unit: 1 },
    { key: 'recruits', points: duel.recruitPoints, unit: 1 },
    { key: 'sr', points: duel.srShardPoints, unit: 1 },
    { key: 'badges', points: duel.skillBadgePoints, unit: 1 },
    { key: 'antitoxin', points: 1, unit: duel.antitoxinUnit }
  ].map(resource => ({ ...resource, stock: stocks[resource.key] || 0, useUnits: 0 }));

  const multiplier = 1 + bonus / 100;
  const availableBasePoints = resources.reduce(
    (sum, resource) => sum + Math.floor(resource.stock / resource.unit) * resource.points,
    0
  );
  let remainingBasePoints = target > 0 ? Math.ceil(target / multiplier) : 0;

  resources.forEach(resource => {
    const availableUnits = Math.floor(resource.stock / resource.unit);
    resource.useUnits = Math.min(availableUnits, Math.floor(remainingBasePoints / resource.points));
    remainingBasePoints -= resource.useUnits * resource.points;
  });

  if (remainingBasePoints > 0) {
    const smallestAvailableUnit = [...resources]
      .filter(resource => resource.useUnits < Math.floor(resource.stock / resource.unit))
      .sort((a, b) => a.points - b.points)[0];
    if (smallestAvailableUnit) smallestAvailableUnit.useUnits += 1;
  }

  const plannedBasePoints = resources.reduce((sum, resource) => sum + resource.useUnits * resource.points, 0);
  const plannedPoints = Math.floor(plannedBasePoints * multiplier);
  return {
    availablePoints: Math.floor(availableBasePoints * multiplier),
    plannedPoints,
    missingPoints: target > 0 ? Math.max(0, target - plannedPoints) : 0,
    resources: resources.map(resource => ({
      key: resource.key,
      stock: resource.stock,
      use: resource.useUnits * resource.unit,
      keep: resource.stock - resource.useUnits * resource.unit,
      points: Math.floor(resource.useUnits * resource.points * multiplier)
    }))
  };
}
