import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { GAME_DATA } from '../src/lib/data.js';
import { calculateAntitoxinProgression } from '../src/lib/domain/antitoxin.js';
import { calculateSkillProgression } from '../src/lib/domain/skills.js';
import { calculateFragmentUpgrade } from '../src/lib/domain/fragments.js';
import { calculateRavenProgression, getRavenUpgradeCost } from '../src/lib/domain/raven.js';
import { calculateSanctuaryProgression } from '../src/lib/domain/sanctuary.js';
import { calculateDuelPlan } from '../src/lib/domain/duel.js';

for (const [key, path] of Object.entries({
  antitoxin: 'progression/antitoxin',
  skills: 'progression/skill-badges',
  stars: 'progression/hero-stars',
  raven: 'progression/raven',
  sanctuary: 'progression/sanctuary',
  duel: 'events/alliance-duel'
})) {
  GAME_DATA[key] = JSON.parse(await readFile(new URL(`../public/data/${path}.json`, import.meta.url))).data;
}

test('Antitoxin: sum target-level costs, one level, and reversed range', () => {
  const result = calculateAntitoxinProgression(85, 90);
  assert.equal(result.valid, true);
  assert.equal(result.levels.length, 5);
  assert.equal(
    result.total,
    result.levels.reduce((sum, row) => sum + row.cost, 0)
  );
  assert.equal(calculateAntitoxinProgression(1, 2).levels.length, 1);
  assert.equal(calculateAntitoxinProgression(90, 85).valid, false);
});
test('Skills and fragments retain their range and stock contracts', () => {
  const skills = calculateSkillProgression(1, 10, 0);
  assert.equal(skills.valid, true);
  assert.ok(skills.required > 0);
  assert.equal(calculateSkillProgression(1, 2, Number.MAX_SAFE_INTEGER).missing, 0);
  assert.equal(calculateSkillProgression(10, 1, 0).valid, false);
  const result = calculateFragmentUpgrade({
    current: 0,
    target: 5,
    rarity: 'ur',
    specificStock: 0,
    omniStock: 0
  });
  assert.equal(result.valid, true);
  assert.ok(result.required > 0);
  assert.equal(
    calculateFragmentUpgrade({ current: 5, target: 0, rarity: 'ur', specificStock: 0, omniStock: 0 }).valid,
    false
  );
});
test('Corbeau: completed phases apply only to the first upgrade', () => {
  const first = GAME_DATA.raven.find((row) => row[3] > 0)[0];
  const cost = getRavenUpgradeCost(first);
  const full = calculateRavenProgression(first, first + 2);
  const partial = calculateRavenProgression(first, first + 2, 2);
  assert.equal(full.essence - partial.essence, 2 * cost.essencePerPhase);
  assert.equal(full.fruit, partial.fruit);
  assert.equal(calculateRavenProgression(249, 250).levels.length, 1);
  assert.equal(calculateRavenProgression(250, 1).valid, false);
});
test('Sanctuary totals retain costs and replacement power semantics', () => {
  const result = calculateSanctuaryProgression(1, 30);
  assert.equal(result.valid, true);
  assert.equal(result.levels.length, 29);
  assert.equal(
    result.powerGain,
    GAME_DATA.sanctuary.find((row) => row[0] === 30)[1] - GAME_DATA.sanctuary.find((row) => row[0] === 1)[1]
  );
  assert.equal(calculateSanctuaryProgression(29, 30).levels.length, 1);
  assert.equal(calculateSanctuaryProgression(30, 1).valid, false);
});
test('Duel simulations never mutate supplied stocks', () => {
  const stocks = Object.freeze({ antitoxin: 1000, recruits: 10, ur: 10, ssr: 10, sr: 10, badges: 100 });
  const plan = calculateDuelPlan({ target: 1000, bonus: 0, stocks });
  assert.ok(plan.availablePoints > 0);
  for (const resource of plan.resources) assert.equal(resource.use + resource.keep, resource.stock);
});
