import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSlots, squadPower } from '../src/lib/domain/squads.js';
import { getSquads, saveSquads } from '../src/lib/core/squads.js';
import { writePreference } from '../src/lib/platform/storage.ts';
const heroes = [{ id: 'a', power: 100 }, { id: 'b', power: 200 }, { id: 'c', power: null }];
test('Formation totals preserve unknown power and verified zero', () => {
  assert.equal(squadPower(['a', 'b', null], heroes), 300);
  assert.equal(squadPower(['a', 'c', null], heroes), null);
  assert.equal(squadPower([null, null, null, null, null], heroes), null);
  assert.equal(squadPower(['missing'], heroes), null);
  assert.equal(squadPower(['zero'], [{ id: 'zero', power: 0 }]), 0);
});
test('Slots reject duplicates and removed references without shifting positions', () => {
  assert.deepEqual(normalizeSlots(['a', 'a', 'b'], heroes), ['a', null, 'b', null, null]);
  assert.deepEqual(normalizeSlots(['missing', 'b'], heroes), [null, 'b', null, null, null]);
  assert.deepEqual(normalizeSlots(null, heroes), [null, null, null, null, null]);
});
test('Persistence repairs malformed storage and cleans squads and presets after removal', () => {
  writePreference('lat-hero-squads', '{');
  assert.equal(getSquads(heroes).squads.length, 4);
  saveSquads({ squads: [['a', 'b']], presets: [{ id: 'p', name: ' Test ', slots: ['a', 'b'] }] }, heroes);
  const remaining = heroes.filter(hero => hero.id !== 'a');
  const saved = getSquads(remaining);
  assert.deepEqual(saved.squads[0], [null, 'b', null, null, null]);
  assert.deepEqual(saved.presets[0], { id: 'p', name: 'Test', slots: [null, 'b', null, null, null] });
});

test('All five slots and their power survive preset persistence', () => {
  const roster = Array.from({ length: 5 }, (_, index) => ({ id: `hero-${index}`, power: 100 * (index + 1) }));
  const slots = roster.map(hero => hero.id);
  saveSquads({ squads: [slots], presets: [{ id: 'five', name: 'Five', slots }] }, roster);
  const saved = getSquads(roster);
  assert.deepEqual(saved.squads[0], slots);
  assert.deepEqual(saved.presets[0].slots, slots);
  assert.equal(squadPower(saved.squads[0], roster), 1500);
});
